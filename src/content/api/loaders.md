---
title: Loader Interface
sort: 5
contributors:
  - TheLarkInn
  - jhnns
  - tbroadley
  - byzyk
  - sokra
  - EugeneHlushko
  - jantimon
  - superburrito
  - wizardofhogwarts
  - snitin315
---

loader 只是一个导出为函数的 JavaScript 模块。[loader runner](https://github.com/webpack/loader-runner) 会调用这个函数，然后把上一个 loader 产生的结果或者资源文件(resource file)传入进去。函数的 this 上下文将由 webpack 填充，并且 [loader runner](https://github.com/webpack/loader-runner) 具有一些有用方法，可以使 loader 改变为异步调用方式，或者获取 query 参数。

第一个 loader 只有一个传入参数：资源文件(resource file)的内容。compiler 预期得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（能够被转换为一个 string），代表了模块的 JavaScript 源码。另外，还可以传递一个可选的 SourceMap 结果（格式为 JSON 对象）。

如果是单个处理结果，可以在__同步模式__中直接返回。如果有多个处理结果，则必须调用 this.callback()。在__异步模式__中，必须调用 this.async()，来指示  [loader runner](https://github.com/webpack/loader-runner) 等待异步结果，它会返回 this.callback() 回调函数，随后 loader 必须返回 undefined 并且调用该回调函数。


## 示例

以下部分提供了不同类型的 loader 的一些基本示例。注意，map 和 meta 参数是可选的，查看下面的 this.callback。

### 同步 Loaders

无论是 return 还是 this.callback 都可以同步地返回转换后的 content 内容：

__sync-loader.js__

``` javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
```

this.callback 方法则更灵活，因为它允许传递多个参数，而不仅仅是content。

__sync-loader-with-multiple-results.js__

``` javascript
module.exports = function(content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```

### Asynchronous Loaders
### 异步 Loaders

对于异步 loader，使用 [`this.async`](#thisasync) 来获取 callback 函数：

__async-loader.js__

``` javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
```

__async-loader-with-multiple-results.js__

``` javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result, sourceMaps, meta) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```

T> loader 最初被设计为可以在同步 loader pipline（如 Node.js ，使用 [enhanced-require](https://github.com/webpack/enhanced-require))，_以及_在异步 pipeline（如 webpack ）中运行。然而在 Node.js 这样的单线程环境下进行耗时长的同步计算不是个好想法，我们建议尽可能地使你的 loader 异步化。但如果计算量很小，同步 loader 也是可以的。

### "Raw" Loader

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。每一个 loader 都可以用 String 或者 Buffer 的形式传递它的处理结果。Complier 将会把它们在 loader 之间相互转换。

__raw-loader.js__

``` javascript
module.exports = function(content) {
  assert(content instanceof Buffer);
  return someSyncOperation(content);
  // 返回值也可以是一个 `Buffer`
  // 即使不是 raw loader 也没问题
};
module.exports.raw = true;
```

### Pitching Loader

loader 总是__从右到左地被调用。有些情况下，loader 只关心 request 后面的__元数据(metadata)，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先__从左到右__调用 loader 上的 pitch 方法。

module.exports = {
T> Loaders 可以通过 request 添加或者内联前缀禁用，这将影响到 pitch 和 执行的顺序。更多详情查看[`Rule.enforce`](/configuration/module/#ruleenforce)

对于以下 [`use`](/configuration/module/#ruleuse) 配置：

``` javascript
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'a-loader',
          'b-loader',
          'c-loader'
        ]
      }
    ]
  }
};
```

将会发生这些步骤：

``` diff
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

那么，为什么 loader 可以利用 "跳跃(pitching)" 阶段呢？

首先，传递给 pitch 方法的 data，在执行阶段也会暴露在 this.data 之下，并且可以用于在循环时，捕获和共享前面的信息。

``` javascript
module.exports = function(content) {
  return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.value = 42;
};
```

其次，如果某个 loader 在 pitch 方法中给出一个结果，那么这个过程会回过身来，并跳过剩下的 loader。在我们上面的例子中，如果 b-loader 的 pitch 方法返回了一些东西：

``` javascript
module.exports = function(content) {
  return someSyncOperation(content);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  if (someCondition()) {
    return 'module.exports = require(' + JSON.stringify('-!' + remainingRequest) + ');';
  }
};
```

上面的步骤将被缩短为：

``` diff
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

查看 [bundle-loader](https://github.com/webpack-contrib/bundle-loader) 了解如何以更有意义的方式使用此过程。


## The Loader Context

loader context 表示在 loader 内使用 this 可以访问的一些方法或属性。

下面提供一个例子，将使用 require 进行调用：

In `/abc/file.js`:

``` javascript
require('./loader1?xyz!loader2!./resource?rrr');
```


### `this.version`

__loader API 的版本号__ 目前是 2。这对于向后兼容性有一些用处。通过这个版本号，你可以自定义逻辑或者降级处理。

### `this.context`

__模块所在的目录__ 可以用作解析其他模块成员的上下文。

在我们的例子中：因为 resource.js 在这个目录中，这个属性为 /abc

### `this.rootContext`

从 webpack 4 开始，原先的 this.options.context 被改进为 this.rootContext。

### `this.request`

被解析出来的 request 字符串。

在我们的例子中："/abc/loader1.js?xyz!/abc/node_modules/loader2/index.js!/abc/resource.js?rrr"

### `this.query`

1. 如果这个 loader 配置了 [`options`](/configuration/module/#useentry) 对象的话，this.query 就指向这个 option 对象。
2. 如果 loader 中没有 options，而是以 query 字符串作为参数调用时，this.query 就是一个以 ? 开头的字符串。

### `this.getOptions(schema)`

提取给定的 loader 选项，接受一个可选的 JSON 格式化对象作为参数
T> 从 webpack 5开始， this.getOptions 可以获取到 loader 上下文对象。 它用来替代来自 loader-utils 的 getOptions 方法。

### `this.callback`

一个可以同步或者异步调用的可以返回多个结果的函数。预期的参数是：

<!-- eslint-skip -->

``` javascript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

1. 第一个参数必须是 Error 或者 null
2. 第二个参数是一个 string 或者 [`Buffer`](https://nodejs.org/api/buffer.html)。
3. 可选的：第三个参数必须是一个可以被 [this module](https://github.com/mozilla/source-map) 解析的 source map。
4. 可选的：第四个选项，会被 webpack 忽略，可以是任何东西（例如一些元数据）。

T> 如果希望在加载程序之间共享公共的AST，可以将抽象语法树AST（例如 [`ESTree`](https://github.com/estree/estree)）作为第四个参数（`meta`）传递，以加快构建时间。

如果这个函数被调用的话，你应该返回 undefined 从而避免含糊的 loader 结果。


### `this.async`

告诉 [loader-runner](https://github.com/webpack/loader-runner) 这个 loader 将会异步地回调。返回 this.callback。

### `this.data`

在 pitch 阶段和 normal 阶段之间共享的 data 对象。

### `this.cacheable`

设置是否可缓存标志的函数：

``` typescript
cacheable(flag = true: boolean)
```

默认情况下，loader 的处理结果会被标记为可缓存。调用这个方法然后传入 false，可以关闭 loader 处理结果的缓存能力。

一个可缓存的 loader 在输入和相关依赖没有变化时，必须返回相同的结果。这意味着 loader 除了 this.addDependency 里指定的以外，不应该有其它任何外部依赖。


### `this.loaders`

所有 loader 组成的数组。它在 pitch 阶段的时候是可以写入的。

<!-- eslint-skip -->

``` javascript
loaders = [{request: string, path: string, query: string, module: function}]
```

In the example:
在示例中：

``` javascript
[
  {
    request: '/abc/loader1.js?xyz',
    path: '/abc/loader1.js',
    query: '?xyz',
    module: [Function]
  },
  {
    request: '/abc/node_modules/loader2/index.js',
    path: '/abc/node_modules/loader2/index.js',
    query: '',
    module: [Function]
  }
];
```


### `this.loaderIndex`

当前 loader 在 loader 数组中的索引。

在示例中：loader1 中得到：0，loader2 中得到：1


### `this.resource`

request 中的资源部分，包括 query 参数。

在示例中："/abc/resource.js?rrr"


### `this.resourcePath`

资源文件的路径。

在示例中："/abc/resource.js"

### `this.resourceQuery`

资源的 query 参数。

在示例中："?rrr"

### `this.target`

Compilation 的目标。从配置选项中传递过来的。

示例："web", "node"

### `this.webpack`

如果是由 webpack 编译的，这个布尔值会被设置为 true。

T> loader 最初被设计为可以同时当 Babel transform 用。如果你编写了一个 loader 可以同时兼容二者，那么可以使用这个属性了解是否存在可用的 loaderContext 和 webpack 特性。

### `this.sourceMap`

应该生成一个 source map。因为生成 source map 可能会非常耗时，你应该确认 source map 确实有必要请求。


### `this.emitWarning`

``` typescript
emitWarning(warning: Error)
```

发出一个警告，在输出中显示如下：

``` bash
WARNING in ./src/lib.js (./src/loader.js!./src/lib.js)
Module Warning (from ./src/loader.js):
Here is a Warning!
 @ ./src/index.js 1:0-25
 ```

T> 请注意如果 stats.warnings 设置为 false，警告信息将不会显示。 或者其他一些省略设置被用做 status, 例如，"none"或者 "errors-only"。

### `this.emitError`

``` typescript
emitError(error: Error)
```

发出一个错误，在输出中显示如下：

``` bash
ERROR in ./src/lib.js (./src/loader.js!./src/lib.js)
Module Error (from ./src/loader.js):
Here is an Error!
 @ ./src/index.js 1:0-25
```

T> 与抛出错误中断运行不同， 它不会中断当前模块的编译过程。

### `this.loadModule`

``` typescript
loadModule(request: string, callback: function(err, source, sourceMap, module))
```

解析给定的 request 到一个模块，应用所有配置的 loader ，并且在回调函数中传入生成的 source 、sourceMap 和 模块实例（通常是 [`NormalModule`](https://github.com/webpack/webpack/blob/master/lib/NormalModule.js) 的一个实例）。如果你需要获取其他模块的源代码来生成结果的话，你可以使用这个函数。

### `this.resolve`

``` typescript
resolve(context: string, request: string, callback: function(err, result: string))
```

像 require 表达式一样解析一个 request 。


### `this.addDependency`

``` typescript
addDependency(file: string)
dependency(file: string) // shortcut
```

加入一个文件作为产生 loader 结果的依赖，使它们的任何变化可以被监听到。例如，[`sass-loader`](https://github.com/webpack-contrib/sass-loader), [`less-loader`](https://github.com/webpack-contrib/less-loader) 就使用了这个技巧，当它发现无论何时导入的css文件发生变化时就会重新编译。

### `this.addContextDependency`

``` typescript
addContextDependency(directory: string)
```

添加文件夹作为 loader 结果的依赖。


### `this.clearDependencies`

``` typescript
clearDependencies()
```

移除 loader 结果的所有依赖，甚至自己和其它 loader 的初始依赖。考虑使用 pitch。

### `this.emitFile`

``` typescript
emitFile(name: string, content: Buffer|string, sourceMap: {...})
```

产生一个文件。这是 webpack 特有的。

### `this.hot`

loaders 的 HMR(热模块替换) 相关信息。

```javascript
module.exports = function(source) {
  console.log(this.hot); // true if HMR is enabled via --hot flag or webpack configuration
                         // 如果通过--hot flag或webpack配置启用HMR，则为true
  return source;
};
```

### `this.fs`

用于访问 compilation 的 inputFileSystem 属性。

### `this.mode`

当 webpack 运行时读取 [`mode`](/configuration/mode/) 的值

可能的值为："production", "development", "none"

## 过时的上下文属性

由于我们计划将这些属性从上下文中移除，因此不鼓励使用这些属性。它们仍然列在这里，以备参考。

### `this.exec`

``` typescript
exec(code: string, filename: string)
```

像模块一样执行一些代码片段。 如果有需要查看本注释 [this comment](https://github.com/webpack/webpack.js.org/issues/1268#issuecomment-313513988) 替换方法。

### `this.value`

向下一个 loader 传值。如果你知道了作为模块执行后的结果，请在这里赋值（以元素数组的形式）。

### `this.inputValue`

从上一个 loader 那里传递过来的值。如果你会以模块的方式处理输入参数，建议预先读入这个变量（为了性能因素）。


### `this.debug`

一个布尔值，当处于 debug 模式时为 true。


### `this.minimize`

决定处理结果是否应该被压缩。

### `this._compilation`

一种 hack 写法。用于访问 webpack 的 Compilation 对象。


### `this._compiler`

一种 hack 写法。用于访问 webpack 的 Compiler 对象。

### `this._module`

一种 hack 写法。用于访问当前加载的 Module 对象。

## Error Reporting
## 错误报告

您可以通过以下方式从加载程序内部报告错误：

- 使用 [this.emitError](/api/loaders/#thisemiterror). 将在不中断模块编译的情况下报告错误。
- 使用“throw”（或其他未捕获的意外异常）。加载程序运行时引发错误将导致当前模块编译失败。
- 使用“callback”（异步模式）。向回调传递错误也会导致模块编译失败。

For example:

__./src/index.js__

``` javascript
require('./loader!./lib');
```

从loader当中抛出错误：

__./src/loader.js__

``` javascript
module.exports = function(source) {
  throw new Error('This is a Fatal Error!');
};
```

或者在异步模式下，传入一个错误给 callback：

__./src/loader.js__

``` javascript
module.exports = function(source) {
  const callback = this.async();
  //...
  callback(new Error('This is a Fatal Error!'), source);
};
```

这个模块将获取像下面的 bundle

<!-- eslint-skip -->

``` javascript
/***/ "./src/loader.js!./src/lib.js":
/*!************************************!*\
  !*** ./src/loader.js!./src/lib.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./src/loader.js):\nError: This is a Fatal Error!\n    at Object.module.exports (/workspace/src/loader.js:3:9)");

/***/ })
```

然后构建输出结果将显示错误，与 this.emitError 相似:

``` bash
ERROR in ./src/lib.js (./src/loader.js!./src/lib.js)
Module build failed (from ./src/loader.js):
Error: This is a Fatal Error!
    at Object.module.exports (/workspace/src/loader.js:2:9)
 @ ./src/index.js 1:0-25
```

如下所示，不仅有错误消息，还提供了有关所涉及的加载程序和模块的详细信息：

- 模块路径: ERROR in ./src/lib.js
- request 字符串：(./src/loader.js!./src/lib.js)
- loader 路径：(from ./src/loader.js)
- 调用路径：@ ./src/index.js 1:0-25

W> 从 webpack 4.12 开始，loader 路径将在报错信息中显示。

T> 所有的报错和警告信息将被记录到 state 当中。详情请查看[Stats Data](/api/stats/#errors-and-warnngs)。

### Inline matchResource

在webpack v4中引入了一种新的内联请求语法。前缀为“<match resource>！=!`将为此请求设置“matchResource”。

W> 不建议在应用程序代码中使用此语法。

内联请求语法仅用于加载程序生成的代码。
不遵循此建议将使您的代码不遵循 webpack 标准和规范。

T> 相对的“matchResource”将相对包含模块的当前上下文进行解析。

When a `matchResource` is set, it will be used to match with the [`module.rules`](/configuration/module/#modulerules) instead of the original resource. This can be useful if further loaders should be applied to the resource, or if the module type needs to be changed. It's also displayed in the stats and used for matching [`Rule.issuer`](/configuration/module/#ruleissuer) and [`test` in `splitChunks`](/plugins/split-chunks-plugin/#splitchunkscachegroupscachegrouptest).

Example:

__file.js__

```javascript
/* STYLE: body { background: red; } */
console.log('yep');
```

加载程序可以将文件转换为以下文件，并使用“matchResource”应用用户指定的CSS处理规则：

__file.js__ (transformed by loader)

```javascript
import './file.js.css!=!extract-style-loader/getStyles!./file.js';
console.log('yep');
```

This will add a dependency to `extract-style-loader/getStyles!./file.js` and treat the result as `file.js.css`. Because [`module.rules`](/configuration/module/#modulerules) has a rule matching `/\.css$/` and it will apply to this dependency.

The loader could look like this:

__extract-style-loader/index.js__

```javascript
const stringifyRequest = require('loader-utils').stringifyRequest;
const getRemainingRequest = require('loader-utils').getRemainingRequest;
const getStylesLoader = require.resolve('./getStyle');

module.exports = function (source) {
  if (STYLES_REGEXP.test(source)) {
    source = source.replace(STYLES_REGEXP, '');
    const remReq = getRemainingRequest(this);
    return `import ${stringifyRequest(`${this.resource}.css!=!${getStylesLoader}!${remReq}`)};${source}`;
  }
  return source;
};
```

__extract-style-loader/getStyles.js__

```javascript
module.exports = function(source) {
  const match = STYLES_REGEXP.match(source);
  return match[0];
};
```

## Logging

自webpack 4.37发布以来，日志API就可用了。当 [`stats configuration`](/configuration/stats/#statslogging) 或者 [`infrastructure logging`](/configuration/other-options/#infrastructurelogging) 开启 logging 时，加载程序可以记录消息，这些消息将以相应的日志格式（stats，infrastructure）打印出来。

- Loaders 最好使用 this.getLogger() 用于日志记录，这是指向 compilation.getLogger() 具有加载程序路径和已处理的文件。这种日志记录被存储到Stats中并相应地格式化。它可以被webpack用户过滤和导出。
- Loaders 可以使用 this.getLogger("name") 获取具有子名称的独立记录器。仍会添加加载程序路径和已处理的文件。
- Loaders 可以使用特殊的回退逻辑来检测日志支持 this.getLogger() ? this.getLogger() : console。 在使用不支持 getLogger 方法的旧webpack版本时提供回退选项。
