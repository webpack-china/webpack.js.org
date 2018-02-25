---
title: Plugin API
group: Plugins
sort: 0
---

T> 本文是编写插件的高级指导，请先阅读[编写一个插件](/contribute/writing-a-plugin).

webpack 中的很多对象继承了 `Tapable` 类，暴露出一个 `plugin` 方法。通过 `plugin` 方法，插件可以注入自定义的构建步骤。你会看到 `compiler.plugin` 和 `compilation.plugin` 被大量使用。本质上，在插件中的每一次调用 `plugin` 方法都会绑定了一个回调函数，在整个构建过程的某些特定的步骤触发。

有两种类型的 plugin 接口...

__Timing Based__

- sync (默认): plugin 同步执行，返回它的输出
- async: plugin 异步执行，使用给定的 `callback` 来返回它的输出
- parallel: 处理函数被并行地调用

__Return Value__

- not bailing (默认): 没有返回值
- bailing: 处理函数被顺序调用，直到一个处理函数有返回值
- parallel bailing: 处理函数被并行（异步）地调用。第一个被返回的值会被使用。
- waterfall: 每一个处理函数以上一个处理函数的结果作为一个入参。

一个 plugin 在 webpack 启动时被安装。webpack 通过调用 plugin 的 `apply` 方法来安装它，传入一个指向 webpack `compiler` 对象的引用。你可以调用 `compiler.plugin` 来访问 asset 的 compilations 和它们各自的构建步骤。例如：

__my-plugin.js__

``` js
function MyPlugin(options) {
  // 使用 options 配置你的 plugin
}

MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compile", function(params) {
    console.log("The compiler is starting to compile...");
  });

  compiler.plugin("compilation", function(compilation) {
    console.log("The compiler is starting a new compilation...");

    compilation.plugin("optimize", function() {
      console.log("The compilation is starting to optimize files...");
    });
  });

  compiler.plugin("emit", function(compilation, callback) {
    console.log("The compilation is going to emit files...");
    callback();
  });
};

module.exports = MyPlugin;
```

__webpack.config.js__

``` js
plugins: [
  new MyPlugin({
    options: 'nada'
  })
]
```

## Tapable & Tapable Instances

plugin 架构之所以在多数情况下适用于 webpack 是由于一个内部的名为 Tapable 的库。
在 webpacK 源代码中 **Tapable 实例** 是一些由 `Tapable` 类继承或混入而来的类。

对于 plugin 作者来说，知道 webpack 源码中哪些是 `Tapable` 实例是很重要的。这些实例提供了大量的事件钩子，自定义的 plugins 可以被附着在这些钩子上。
因此，贯穿这一段的是一个列表，列出了 webpack 中所有 `Tapable` 实例（和它们的事件钩子），plugin 的作者可以使用它们。

获取更多 `Tapable` 的信息，可以访问 [完整概述](/api/tapable) 或 [tapable 仓库](https://github.com/webpack/tapable)。
