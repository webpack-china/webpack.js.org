---
title: loader
sort: 3
contributors:
  - manekinekko
  - evenstensberg
  - SpaceK33z
  - gangachris
  - TheLarkInn
  - simon04
  - jhnns
  - byzyk
  - debs-obrien
  - EugeneHlushko
  - wizardofhogwarts
  - lukasgeiter
  - furkle
---

loader 用于对模块的源代码进行转换。loader 可以使你在 `import` 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 `import` CSS文件！


## 示例

例如，你可以使用 loader 告诉 webpack 加载 CSS 文件，或者将 TypeScript 转为 JavaScript。为此，首先安装相对应的 loader：

``` bash
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

然后指示 webpack 对每个 `.css` 使用 [`css-loader`](/loaders/css-loader)，以及对所有 `.ts` 文件使用 [`ts-loader`](https://github.com/TypeStrong/ts-loader)：

__webpack.config.js__

``` js
module.exports = {
  module: {
    rules: [
      { test: /\\.css$/, use: 'css-loader' },
      { test: /\\.ts$/, use: 'ts-loader' }
    ]
  }
};
```


## 使用 loader

在你的应用程序中，有三种使用 loader 的方式：

- [配置](#configuration)（推荐）：在 __webpack.config.js__ 文件中指定 loader。
- [内联](#inline)：在每个 `import` 语句中显式指定 loader。
- [CLI](#cli)：在 shell 命令中指定它们。


### 配置(configuration)

[`module.rules`](/configuration/module/#module-rules) 允许你在 webpack 配置中指定多个 loader。
这种方式是展示 loader 的一种简明方式，并且有助于使代码变得简洁和易于维护。同时让你对各个 loader 有个全局概览：

loader 从右到左（或从下到上）地取值(evaluate)/执行(execute)。在下面的示例中，从 sass-loader 开始执行，然后继续执行 css-loader，最后以 style-loader 为结束。查看 [loader 功能](/concepts/loaders/#loader-features) 了解有关 loader 顺序的更多信息。

``` js-with-links
module.exports = {
  module: {
    rules: [
      {
        test: /\\.css$/,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: 'style-loader' },
          // [css-loader](/loaders/css-loader)
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```


### 内联(inline)

可以在 `import` 语句或任何 [等同于 "import" 的方法](/api/module-methods) 中指定 loader。使用 `!` 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过为内联 `import` 语句添加前缀，可以覆盖 [配置](/configuration) 中的所有 loaders, preLoaders 和 postLoaders：

- 使用 `!` 前缀，将禁用所有已配置的普通 loaders

```js
import Styles from '!style-loader!css-loader?modules!./styles.css';
```

- 使用 `!!` 前缀，将禁用所有已配置的 loaders（preLoaders, loaders, postLoaders）

```js
import Styles from '!!style-loader!css-loader?modules!./styles.css';
```

- 使用 `-!` 前缀，将禁用所有已配置的 preLoaders 和 loaders（但是不禁用 postLoaders）

```js
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```

选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`。

T> 尽可能使用 `module.rules`，因为这样可以减少源码中样板文件的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。


### CLI

还可以通过 CLI 使用 loader：

```bash
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

这会对 `.jade` 文件使用 `jade-loader`，以及对 `.css` 文件使用 [`style-loader`](/loaders/style-loader) 和 [`css-loader`](/loaders/css-loader)。


## loader 特性

- loader 支持链式传递。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。最后，链中的最后一个 loader，返回 webpack 期望 JavaScript。
- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何 Node.js 能做到的操作。
- loader 可以通过 `options` 对象配置（仍然支持使用 `query` 参数来设置选项，但是这种方式已被废弃）。
- 除了常见的通过 `package.json` 的 `main` 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 `loader` 字段直接引用一个模块。
- 插件(plugin)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。

通过（loader）预处理函数，loader 为 JavaScript 生态系统提供了更多能力。
用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和 [更多其他特性](/loaders)。


## 解析 loader

loader 遵循 [模块解析](/concepts/module-resolution/) 标准。多数情况下，loader 将从 [模块路径](/concepts/module-resolution/#module-paths) 加载（通常是从 `npm install`, `node_modules` 进行加载）。

通常使用 npm 进行管理，但是也可以将自定义 loader 作为应用程序中的文件。按照约定，loader 通常被命名为 `xxx-loader`（例如 `json-loader`）。更多详细信息请查看 [编写一个 loader](/contribute/writing-a-loader/)。
