---
title: 概念
sort: 1
contributors:
  - TheLarkInn
  - jhnns
  - grgur
  - johnstew
  - jimrfenner
  - TheDutchCoder
  - adambraimbridge
  - EugeneHlushko
  - jeremenichelli
---

本质上，**webpack** 是一个现代 JavaScript 应用程序的_静态模块打包器(static module bundler)_。在 webpack 处理应用程序时，它会在内部创建一个_依赖图(dependency graph)_，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个_bundle_。

T> 可以从[这里](/concepts/modules)了解更多关于 JavaScript 模块和 webpack 模块的信息。

从 webpack v4 开始，可以不用通过**引入一个配置文件**打包项目。然而，webpack 仍然还是 [高度可配置的](/configuration)，并且能够很好的满足需求。

在开始前你需要先理解它的**核心概念**：

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

本文档旨在给出这些概念的**高度**概述，同时提供具体概念的详尽相关用例。


## 入口(entry)

**入口起点(entry point)**指示 webpack 应该使用哪个模块，来作为构建其内部*依赖图*的开始，webpack 会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`，然而，可以通过在 [webpack 配置](/configuration)中配置 **entry** 属性，来指定一个不同的入口起点（或者也可以指定多个入口起点）。

__webpack.config.js__

``` js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

T> 从 [入口起点](/concepts/entry-points) 章节可以了解更多信息。


## 出口(output)

**output** 属性告诉 webpack 在哪里输出它所创建的 *bundles*，以及如何命名这些文件，主输出文件默认为 `./dist/bundle.js`，其他生成文件的默认输出目录是 `./dist`。

你可以通过在配置中指定一个 `output` 字段，来配置这些处理过程：

__webpack.config.js__

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

在上面的示例中，我们通过 `output.filename` 和 `output.path` 属性，来告诉 webpack bundle 的名称，以及我们想要 bundle 生成(emit)到哪里。可能你想要了解在代码最上面导入的 path 模块是什么，它是一个 [Node.js 核心模块](https://nodejs.org/api/modules.html)，用于操作文件路径。

T> `output` 属性还有 [更多可配置的特性](/configuration/output)，可以通过阅读 [输出章节](/concepts/output) 来了解更多关于它的概念。


## loader

作为开箱即用的自带特性，webpack 自身只支持 JavaScript。而 **loader** 能够让 webpack 处理那些非 JavaScript 文件，并且先将它们转换为有效 [模块](/concepts/modules)，然后添加到依赖图中，这样就可以提供给应用程序使用。

W> 注意，loader 能够 `import` 导入任何类型的模块（例如 `.css` 文件），这是 webpack 特有的功能，其他打包程序或任务执行器的可能并不支持。我们认为这种语言扩展是有很必要的，因为这可以使开发人员创建出更准确的依赖关系图。

在更高层面，在 webpack 的配置中 **loader** 有两个目标：

1. `test` 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
2. `use` 属性，表示进行转换时，应该使用哪个 loader。

__webpack.config.js__

```javascript
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

以上配置中，对一个单独的 module 对象定义了 `rules` 属性，里面包含两个必须属性：`test` 和 `use`。这告诉 webpack 编译器(compiler) 如下信息：

> “嘿，webpack 编译器，当你碰到「在 `require()`/`import` 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先**使用** `raw-loader` 转换一下。”

W> 重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 `module.rules` 中，而不是 `rules`。为了使你受益于此，如果没有按照正确方式去做，webpack 会给出警告。

你可以在 [loader 章节](/concepts/loaders) 中，进一步深入了解对引入的 loader 做自定义设置。


## 插件(plugins)

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务，插件的范围包括，打包优化、资源管理和注入环境变量。

T> 通过查看 [插件接口](/api/plugins) 文档，来了解如何使用它扩展 webpack 功能。

想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建它的一个实例。

**webpack.config.js**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

在上面的示例中，`html-webpack-plugin` 会为你的应用程序生成一个 html 文件，然后自动注入所有生成的 bundle。

T> webpack 提供许多开箱可用的插件！查阅我们的 [插件列表](/plugins) 获取更多信息。

在 webpack 配置中使用插件是简单直接的，然而也有很多值得我们进一步探讨的用例，查看这里 [了解更多！](/concepts/plugins)。


## 模式

通过将 `mode` 参数设置为 `development`, `production` 或 `none`，可以启用对应环境下 webpack 内置的优化。默认值为 `production`。

```javascript
module.exports = {
  mode: 'production'
};
```

从 [模式配置](/concepts/mode) 中可以了解到每种模式都做了哪些优化。
