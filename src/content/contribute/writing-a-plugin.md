---
title: 编写一个插件
sort: 3
contributors:
  - tbroadley
  - nveenjain
  - iamakulov
  - byzyk
  - franjohn21
---

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来实现相应的钩子，所以做好阅读一些源码的准备！

## 创建一个插件

一个插件由以下构成

- 一个具名 JavaScript 函数。
- 在它的原型上定义 `apply` 方法。
- 指定一个触及到 webpack 本身的 [事件钩子](/api/compiler-hooks/)。
- 操作 webpack 内部的实例特定数据。
- 在实现功能后调用 webpack 提供的 callback。

```javascript
// 一个 JavaScript class
class MyExampleWebpackPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.emit.tapAsync(
      'MyExampleWebpackPlugin',
      (compilation, callback) => {
        console.log('This is an example plugin!');
        console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

        // 使用 webpack 提供的 plugin API 操作构建结果
        compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```

## 基本插件架构

插件是由一个构造函数（此构造函数上的 prototype 对象具有 `apply` 方法）的所实例化出来的。这个 `apply` 方法在安装插件时，会被 webpack compiler 调用一次。`apply` 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。一个简单的插件结构如下：

```javascript
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */
    ) => {
      console.log('Hello World!');
    });
  }
}

module.exports = HelloWorldPlugin;
```

然后，要使用这个插件，在你的 webpack 配置的 `plugins` 数组中添加一个实例：

```javascript
// webpack.config.js
var HelloWorldPlugin = require('hello-world');

module.exports = {
  // ... 这里是其他配置 ...
  plugins: [new HelloWorldPlugin({ options: true })]
};
```

## compiler 和 compilation

在插件开发中最重要的两个资源就是 [`compiler`](/api/node/#compiler-instance) 和 [`compilation`](/api/compilation-hooks/) 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

```javascript
class HelloCompilationPlugin {
  apply(compiler) {
    // tap(触及) 到 compilation hook，而在 callback 回调时，会将 compilation 对象作为参数，
    compiler.hooks.compilation.tap('HelloCompilationPlugin', compilation => {
      // 现在，通过 compilation 对象，我们可以 tap(触及) 到各种可用的 hooks 了
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('正在优化资源。');
      });
    });
  }
}

module.exports = HelloCompilationPlugin;
```

这里列出 `compiler`, `compilation` 和其他重要对象上可用 hooks，请查看 [插件 API](/api/plugins/) 文档。

## 异步事件钩子

有些插件 hooks 是异步的。想要 tap(触及) 某些 hooks，我们可以使用同步方式运行的 `tap` 方法，或者使用异步方式运行的 `tapAsync` 方法或 `tapPromise` 方法。

### tapAsync

在我们使用 `tapAsync` 方法 tap 插件时，我们需要调用 callback，此 callback 将作为最后一个参数传入函数。

```javascript
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('HelloAsyncPlugin', (compilation, callback) => {
      // 做一些异步的事情……
      setTimeout(function() {
        console.log('Done with async work...');
        callback();
      }, 1000);
    });
  }
}

module.exports = HelloAsyncPlugin;
```

#### tapPromise

在我们使用 `tapPromise` 方法 tap 插件时，我们需要返回一个 promise，此 promise 将在我们的异步任务完成时 resolve。

```javascript
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise('HelloAsyncPlugin', compilation => {
      // 返回一个 Promise，在我们的异步任务完成时 resolve……
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          console.log('异步工作完成……');
          resolve();
        }, 1000);
      });
    });
  }
}

module.exports = HelloAsyncPlugin;
```

## 示例

一旦能我们深入理解 webpack compiler 和每个独立的 compilation，我们就能通过 webpack 引擎本身做到无穷无尽的事情。我们可以重新格式化已有的文件，创建衍生的文件，或者制作全新的生成文件。

我们来写一个简单的示例插件，生成一个叫做 `filelist.md` 的新文件；文件内容是所有构建生成的文件的列表。这个插件大概像下面这样：

```javascript
class FileListPlugin {
  apply(compiler) {
    // emit 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      // 在生成文件中，创建一个头部字符串：
      var filelist = 'In this build:\n\n';

      // 遍历所有编译过的资源文件，
      // 对于每个文件名称，都添加一行内容。
      for (var filename in compilation.assets) {
        filelist += '- ' + filename + '\n';
      }

      // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
      };

      callback();
    });
  }
}

module.exports = FileListPlugin;
```

## 不同插件形状

根据插件所能触及到的 event hook(事件钩子)，对其进行分类。每个 event hook 都被预先定义为 synchronous hook(同步), asynchronous hook(异步), waterfall hook(瀑布), parallel hook(并行)，而在 webpack 内部会使用 call/callAsync 方法调用这些 hook。通常在 `this.hooks` 属性中指定可以支持或可以触及的 hooks 列表。

示例：

```javascript
this.hooks = {
  shouldEmit: new SyncBailHook(['compilation'])
};
```

这表示唯一支持的 hook 是 `shouldEmit`，而 hook 的类型是 `SyncBailHook`，传递给所有触及到 `shouldEmit` hook 的插件的唯一参数是 `compilation`。

以下是支持的各种 hooks 类型：

### synchronous hooks(同步钩子)

- __SyncHook(同步钩子)__

    - 通过 `new SyncHook([params])` 定义。
    - 使用 `tap` 方法触及。
    - 使用 `call(...params)` 方法调用。

- __Bail Hooks(保释钩子)__

    - 通过 `SyncBailHook[params]` 定义。
    - 使用 `tap` 方法触及。
    - 使用 `call(...params)` 方法调用。

  在这些 hooks 类型中，一个接一个地调用每个插件，并且 callback 会传入特定的 `args`。如果任何插件返回任何非 undefined 值，则由 hook 返回该值，并且不再继续调用插件 callback。许多有用的事件，如 `optimizeChunks`, `optimizeChunkModules` 都是 SyncBailHooks 类型。

- __Waterfall Hooks(瀑布钩子)__

    - 通过 `SyncWaterfallHook[params]` 定义。
    - 使用 `tap` 方法触及。
    - 使用 `call(...params)` 方法调用。

  在这些 hooks 类型中，一个接一个地调用每个插件，并且会使用前一个插件的返回值，作为后一个插件的参数。必须考虑插件的执行顺序。
  它必须接收来自先前执行插件的参数。第一个插件的值是 `init`。因此，waterfall hooks 必须提供至少一个参数。这种插件模式用于 Tapable 实例，而这些实例与 `ModuleTemplate`, `ChunkTemplate` 等 webpack 模板相互关联。

### asynchronous hooks(异步钩子)

- __Async Series Hook(异步串行钩子)__

    - 通过 `AsyncSeriesHook[params]` 定义。
    - 使用 `tap`/`tapAsync`/`tapPromise` 方法触及。
    - 使用 `callAsync(...params)` 方法调用。

  调用插件处理函数，传入所有参数，并使用签名 `(err?: Error) -> void` 调用回调函数。处理函数按照注册顺序进行调用。所有处理函数都被调用之后会调用 `callback`。
  这种插件模式常用于 `emit`, `run` 等事件。

- __Async waterfall(异步瀑布钩子)__ 插件将以瀑布方式异步使用。

    - 通过 `AsyncWaterfallHook[params]` 定义。
    - 使用 `tap`/`tapAsync`/`tapPromise` 方法触及。
    - 使用 `callAsync(...params)` 方法调用。

  调用插件处理函数，传入当前值作为参数，并使用签名 `(err?: Error) -> void` 调用回调函数。在调用处理函数中的 `nextValue`，是下一个处理函数的当前值。第一个处理函数的当前值是 `init`。所有处理函数都被调用之后，会调用 `callback`，并且传入最后一个值。如果任何处理函数向 `err` 方法传递一个值，则会调用 callback，并且将这个错误传入，然后不再调用处理函数。
  这种插件模式常用于 `before-resolve`, `after-resolve` 等事件。

- __Async Series Bail__

    - 通过 `AsyncSeriesBailHook[params]` 定义。
    - 使用 `tap`/`tapAsync`/`tapPromise` 方法触及。
    - 使用 `callAsync(...params)` 方法调用。

- __Async Parallel__

    - 通过 `AsyncParallelHook[params]` 定义。
    - 使用 `tap`/`tapAsync`/`tapPromise` 方法触及。
    - 使用 `callAsync(...params)` 方法调用。
