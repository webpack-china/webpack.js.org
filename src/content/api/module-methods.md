---
title: 模块方法(Module Methods)
group: Modules
sort: 3
contributors:
  - skipjack
  - sokra
related:
  - title: CommonJS Wikipedia
    url: https://en.wikipedia.org/wiki/CommonJS
  - title: Asynchronous Module Definition
    url: https://en.wikipedia.org/wiki/Asynchronous_module_definition
---

本节涵盖了使用 webpack 编译代码的所有方法。在 webpack 打包应用程序时，你可以选择各种模块语法风格，包括 [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015), [CommonJS](https://en.wikipedia.org/wiki/CommonJS) 和 [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition)。

W> 虽然 webpack 支持多种模块语法，但我们建议尽量遵循一致的语法，避免一些奇怪的行为和 bug。这是一个混合使用了 ES6 和 CommonJS 的[示例](https://github.com/webpack/webpack.js.org/issues/552)，但我们确定还有其他的 BUG 会产生。


## ES6（推荐）

webpack 2 支持原生的 ES6 模块语法，意味着你可以无须额外引入 babel 这样的工具，就可以使用 `import` 和 `export`。但是注意，如果使用其他的 ES6+ 特性，仍然需要引入 babel。webpack 支持以下的方法：


### `import`

通过 `import` 以静态的方式，导入另一个通过 `export` 导出的模块。

``` javascript
import MyModule from './my-module.js';
import { NamedExport } from './other-module.js';
```

W> 这里的关键词是__静态的__。标准的 `import` 语句中，模块语句中不能以「具有逻辑或含有变量」的动态方式去引入其他模块。关于 import 的更多信息和 `import()` 动态用法，请查看这里的[说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)。


### `export`

`默认`导出整个模块，或具名导出模块

``` javascript
// 具名导出
export var Count = 5;
export function Multiply(a, b) {
  return a * b;
}

// 默认导出
export default {
  // Some data...
}
```


### `import()`

`import('path/to/module') -> Promise`

动态地加载模块。调用 `import()` 之处，被作为分离的模块起点，意思是，被请求的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。

T> [ES2015 loader 规范](https://whatwg.github.io/loader/) 定义了 `import()` 方法，可以在运行时动态地加载 ES2015 模块。

``` javascript
if ( module.hot ) {
  import('lodash').then(_ => {
    // Do something with lodash (a.k.a '_')...
  })
}
```

W> import() 特性依赖于内置的 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。如果想在低版本浏览器使用 import()，记得使用像 [es6-promise](https://github.com/stefanpenner/es6-promise) 或者 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) 这样 polyfill 库，来预先填充(shim) `Promise` 环境。

`import` 规范不允许控制模块的名称或其他属性，因为 "chunks" 只是 webpack 中的一个概念。幸运的是，webpack 中可以通过注释接收一些特殊的参数，而无须破坏规定：

``` js
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);
```

`webpackChunkName`：新 chunk 的名称。从 webpack 2.6.0 开始，`[index]` and `[request]` 占位符，分别支持赋予一个递增的数字和实际解析的文件名。

`webpackMode`：从 webpack 2.6.0 开始，可以指定以不同的模式解析动态导入。支持以下选项：

- `"lazy"`（默认）：为每个 `import()` 导入的模块，生成一个可延迟加载(lazy-loadable) chunk。
- `"lazy-once"`：生成一个可以满足所有 `import()` 调用的单个可延迟加载(lazy-loadable) chunk。此 chunk 将在第一次 `import()` 调用时获取，随后的 `import()` 调用将使用相同的网络响应。注意，这种模式仅在部分动态语句中有意义，例如 ``import(`./locales/${language}.json`)``，其中可能含有多个被请求的模块路径。
- `"eager"`：不会生成额外的 chunk，所有模块都被当前 chunk 引入，并且没有额外的网络请求。仍然会返回 `Promise`，但是是 resolved 状态。和静态导入相对比，在调用 import（）完成之前，该模块不会被执行。
- `"weak"`：尝试加载模块，如果该模块函数已经以其他方式加载（即，另一个 chunk 导入过此模块，或包含模块的脚本被加载）。仍然会返回 `Promise`，但是只有在客户端上已经有该 chunk 时才成功解析。如果该模块不可用，`Promise` 将会是 rejected 状态，并且网络请求永远不会执行。当需要的 chunks 始终在（嵌入在页面中的）初始请求中手动提供，而不是在应用程序导航在最初没有提供的模块导入的情况触发，这对于通用渲染（SSR）是非常有用的。

T> 请注意，这两个选项可以组合起来使用，如 `/* webpackMode: "lazy-once", webpackChunkName: "all-i18n-data" */`，这会按没有花括号的 JSON5 对象去解析。

W> 完全动态的语句（如 `import(foo)`），因为 webpack 至少需要一些文件的路径信息，而 `foo` 可能是系统或项目中任何文件的任何路径，因此 `foo` 将会解析失败。`import()` 必须至少包含模块位于何处的路径信息，所以打包应当限制在一个指定目录或一组文件中。

W> 调用 `import()` 时，包含在其中的动态表达式 request，会潜在的请求的每个模块。例如，``import(`./locale/${language}.json`)`` 会导致 `./locale` 目录下的每个 `.json` 文件，都被打包到新的 chunk 中。在运行时，当计算出变量 `language` 时，任何文件（如 `english.json` 或 `german.json`）都可能会被用到。

W> 在 webpack 中使用 `System.import` [不符合提案规范](https://github.com/webpack/webpack/issues/2163)，所以在[2.1.0-beta.28](https://github.com/webpack/webpack/releases/tag/v2.1.0-beta.28) 后被弃用，并且建议使用 `import()`。


## CommonJS

CommonJS致力于为浏览器之外的JavaScript指定一个生态系统。webpack支持以下的CommonJS方法：


### `require`

``` javascript
require(dependency: String)
```

以同步的方式检索其他模块的导出，编译器将确保依赖项在输出包中可用。

``` javascript
var $ = require("jquery");
var myModule = require("my-module");
```

W> 使用异步可能不会达到预期的效果。


### `require.resolve`

``` javascript
require.resolve(dependency: String)
```

同步检索模块的ID。编译器将会确保依赖项在导出模块可用。更多关于模块的信息，请点击这里[`module.id`](/api/module-variables#module-id-commonjs-)。

W> webpack中模块ID是一个数字(相反，在NodeJS中是一个字符串 -- 文件名)


### `require.cache`

多个需要相同的模块导致只有一个运行和输出，所以运行的时候存在缓存，删除缓存会导致新的模块运行。

W> 只有很少数的情况需要兼容性!

``` javascript
var d1 = require("dependency");
require("dependency") === d1
delete require.cache[require.resolve("dependency")];
require("dependency") !== d1
```

``` javascript
// in file.js
require.cache[module.id] === module
require("./file.js") === module.exports
delete require.cache[module.id];
require.cache[module.id] === undefined
require("./file.js") !== module.exports // in theory; in praxis this causes a stack overflow
require.cache[module.id] !== module
```


### `require.ensure`

W> `require.ensure()`是webpack专用的，并且被 `import()` 取代。

``` javascript
require.ensure(dependencies: String[], callback: function(require), errorCallback: function(error), chunkName: String)
```

将给定的依赖关系拆分成一个单独的包，它将被异步加载。当使用CommonJS语法的时候，这是唯一动态加载依赖的方法。意味着代码可以在执行的时候加载，只有在满足某些条件时才加载依赖项。

W> 这个特点依赖于内部的 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。如果想在低版本浏览器使用 `require.ensure` ，请使用例如 es6-promise 或者 promise-polyfill 的第三方库。

``` javascript
var a = require('normal-dep');

if ( module.hot ) {
  require.ensure(['b'], function(require) {
    var c = require('c');

    // Do something special...
  });
}
```

以上参数按以上指定的顺序支持：

- `dependencies`: 一个字符串数组，声明回掉函数(`callback`)中所需要的所有模块。
- `callback`: 当依赖关系被加载，webpack就会立即执行运行这些依赖。`require` 作为一个参数传入这个函数。当程序运行需要依赖时，可以使用 `require()` 来加载依赖。
- `errorCallback`: 当依赖没有成功加载，发生错误执行的函数。
- `chunkName`: `require.ensure()` 的名字。通过相同的 `chunkName` 传递给不同的 `require.ensure()` 调用，我们可以将它们的代码合并到一个块中，从而只产生一个浏览器必须加载的包。

W> 尽管 `require` 的实现时通过作为参数传递给回掉函数，但是使用任意的名字，例如 `require.ensure([], function(request) { request('someModule'); })` 不会被webpack静态解析器处理，使用 `require` 代替 `require.ensure([], function(require) { require('someModule'); })` 。



## AMD

AMD是一种定义了写入和加载模块的JavaScript规范。webpack支持以下的AMD方法：


### `define` (with factory)

``` javascript
define([name: String], [dependencies: String[]], factoryMethod: function(...))
```

如果提供依赖关系，每个依赖的导出将会调用 `factoryMethod` 方法(以相同的顺序)。如果未提供依赖关系，则使用`require`, `exports` 和 `module`调用 `factoryMethod` 方法(为了兼容性)。如果此方法返回一个值，则返回值会被该模块导出。编译器将确保每个依赖都可用。

W> 注意：webpack忽略 `name` 参数。

``` javascript
define(['jquery', 'my-module'], function($, myModule) {
  // Do something with $ and myModule...

  // Export a function
  return function doSomething() {
    // ...
  };
});
```

W> 上述方法不能在异步函数中使用。


### `define` (with value)

``` javascript
define(value: !Function)
```

这里只会导出传入的值，这里的值可以是除了函数意外的任何值。

``` javascript
define({
  answer: 42
});
```

W> 上述方法不能在异步函数中使用。


### `require` (amd-version)

``` javascript
require(dependencies: String[], [callback: function(...)])
```

与 `require.ensure` 类似，这将会把给定的依赖拆成一个单独的包，然后会被异步加载。回掉函数将会在每个依赖导出后被调用。

W> 该功能在内部依赖于 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。如果想在低版本浏览器使用 AMD ，请使用例如 es6-promise 或者 promise-polyfill 的第三方库。

``` javascript
require(['b'], function(b) {
  var c = require("c");
});
```

W> 这里没有提供模块名称的选项。



## Labeled Modules

webpack内部的 `LabeledModulesPlugin` 允许使用下面的方法导入或者导出模块


### `export` label

导出给定的值。 `export` 可以出现在变量声明跟函数声明前边。函数名或者变量名是导出该值的标识符。

``` javascript
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

W> 使用异步可能不会达到预期的效果。


### `require` label

从生产环境导出的所有的依赖项在当前作用域都可以用。 `require` 标签可以出现在字符串之前。依赖项名称必须使用 `export` 标签的导出值。 CommonJS 或者 AMD 模块中不可以这样使用。

__some-dependency.js__

``` javascript
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

``` javascript
require: 'some-dependency';
console.log(answer);
method(...);
```



## Webpack

webpack除了支持上述的语法之外，也允许使用一些特定于webpack的方法。


### `require.context`

``` javascript
require.context(directory:String, includeSubdirs:Boolean /* optional, default true */, filter:RegExp /* optional */)
```

使用 `directory` 的路径，参数 `includeSubdirs` 和 `filter` 指定一组依赖关系，对包含的模块进行更多的控制。

```javascript
var context = require.context('components', true, /\.html$/);
var componentA = context.resolve('componentA');
```


### `require.include`

``` javascript
require.include(dependency: String)
```

引入一个不需要执行的依赖，这样的话可以用于优化输出模块中的依赖模块的位置。

``` javascript
require.include('a');
require.ensure(['a', 'b'], function(require) { /* ... */ });
require.ensure(['a', 'c'], function(require) { /* ... */ });
```

这样会出现一下输出:

- entry chunk: `file.js` and `a`
- anonymous chunk: `b`
- anonymous chunk: `c`

如果不使用 `require.include('a')` ，将会输出的两个模块中都有模块a。


### `require.resolveWeak`

与 `require.resolve` 类似，但这样将不会把模块进行打包，这就是所谓的弱依赖。

``` javascript
if(__webpack_modules__[require.resolveWeak('module')]) {
  // Do something when module is available...
}
if(require.cache[require.resolveWeak('module')]) {
  // Do something when module was loaded before...
}

// You can perform dynamic resolves ("context")
// just as with other require/import methods.
const page = 'Foo';
__webpack_modules__[require.resolveWeak(`./page/${page}`)]
```

T> `require.resolveWeak` 是通用渲染(SSR + Code Splitting)的基础。例如在[react-universal-component](https://github.com/faceyspacey/react-universal-component) 等包中使用。它允许代码在服务器端和客户端初始页面加载上同步呈现。它要求手动或以某种方式提供模块。
它可以在不需要指示应该被打包的情况下引入模块。它与`import()`一起使用，当用户导航触发额外的导入时它会接管。

***

> 原文：https://webpack.js.org/api/module-methods/
