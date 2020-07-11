---
title: sass-loader
source: https://raw.githubusercontent.com/webpack-contrib/sass-loader/master/README.md
edit: https://github.com/webpack-contrib/sass-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/sass-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



加载 Sass/SCSS 文件并将他们编译为 CSS。

## 快速开始

首先，你需要安装 `sass-loader`：

```console
npm install sass-loader sass webpack --save-dev
```

`sass-loader` requires you to install either [Dart Sass](https://github.com/sass/dart-sass) or [Node Sass](https://github.com/sass/node-sass) on your own (more documentation can be found below).

This allows you to control the versions of all your dependencies, and to choose which Sass implementation to use.

> ℹ️ We recommend using [Dart Sass](https://github.com/sass/dart-sass).

> ⚠ [Node Sass](https://github.com/sass/node-sass) does not work with [Yarn PnP](https://classic.yarnpkg.com/en/docs/pnp/) feature.

Chain the `sass-loader` with the [css-loader](/loaders/css-loader/) and the [style-loader](/loaders/style-loader/) to immediately apply all styles to the DOM or the [mini-css-extract-plugin](/plugins/mini-css-extract-plugin/) to extract it into a separate file.

然后将本 loader 添加到你的 Webpack 配置中。例如：

**app.js**

```js
import './style.scss';
```

**style.scss**

```scss
$body-color: red;

body {
  color: $body-color;
}
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
    ],
  },
};
```

最后通过你喜欢的方式运行 `webpack`。

### 解析 `import` at-rules

Webpack 提供一种 [解析文件的高级机制](/concepts/module-resolution/)。

`sass-loader` 使用 Sass 提供的 custom importer 特性，将所有 query 传递给 Webpack 解析引擎。只要在包名前加上 `~` ，告诉 Webpack 这不是一个相对路径，这样就可以从 `node_modules` 中 import 自己的 Sass 模块了：

```scss
@import '~bootstrap';
```

重要的是，只在前面加上 `~`，因为`~/` 将会解析到用户的主目录（home directory）。
因为 CSS 和 Sass 文件没有用于导入相关文件的特殊语法，所以 Webpack 需要区分 `bootstrap` 和 `~bootstrap`。
 `@import "style.scss"` 和 `@import "./style.scss";` 两种写法是相同的。

###  `url(...)` 的问题

由于 Saass 的实现没有提供 [url rewriting](https://github.com/sass/libsass/issues/532) 的功能，所以相关的资源都必须是相对于输出文件（ouput）而言的。

- 如果生成的 CSS 传递给了 `css-loader`，则所有的 url 规则都必须是相对于入口文件的（例如：`main.scss`）。
- 如果仅仅生成了 CSS 文件，没有将其传递给 `css-loader`，那么所有的 url 都是相对于网站的根目录的。

第一种情况可能会带来一些困扰。通常情况下我们希望相对路径引用的解析是相对于声明它的 `.sass`/`.scss` 文件（如同在 `.css` 文件中一样）。

幸运的是，有两种方法可以解决这个问题：

- 将 [resolve-url-loader](https://github.com/bholloway/resolve-url-loader) 设置于 loader 链中的 `sass-loader` 之前，就可以重写 url。
- Library 作者一般都会提供变量，用来设置资源路径。 比如 [bootstrap-sass](https://github.com/twbs/bootstrap-sass) 可以通过 `$icon-font-path` 进行设置。

## 配置选项

|                   Name                    |         Type         |                 Default                 | Description                                                       |
| :---------------------------------------: | :------------------: | :-------------------------------------: | :---------------------------------------------------------------- |
|  **[`implementation`](#implementation)**  |      `{Object}`      |                 `sass`                  | Setup Sass implementation to use.                                 |
|     **[`sassOptions`](#sassoptions)**     | `{Object\|Function}` | defaults values for Sass implementation | Options for Sass.                                                 |
|       **[`sourceMap`](#sourcemap)**       |     `{Boolean}`      |           `compiler.devtool`            | Enables/Disables generation of source maps.                       |
|  **[`additionalData`](#additionaldata)**  | `{String\|Function}` |               `undefined`               | Prepends/Appends `Sass`/`SCSS` code before the actual entry file. |
| **[`webpackImporter`](#webpackimporter)** |     `{Boolean}`      |                 `true`                  | Enables/Disables the default Webpack importer.                    |

### `implementation`

类型： `Object`
默认值： `sass`

特殊的 `implementation` 选项确定要使用的 Sass 实现。 

默认情况下，loader 将会根据你的依赖解析需要使用的实现。
只需将必需的实现添加到 `package.json`（`sass` 或 `node-sass` 包）中并安装依赖项即可。

例如此时 `sass-loader` 将会使用 `sass` （`dart-sass`）实现：

**package.json**

```json
{
  "devDependencies": {
    "sass-loader": "^7.2.0",
    "sass": "^1.22.10"
  }
}
```

例如此时 `sass-loader` 将会使用 `node-sass` 实现：

**package.json**

```json
{
  "devDependencies": {
    "sass-loader": "^7.2.0",
    "node-sass": "^4.0.0"
  }
}
```

需要注意同时安装 `node-sass` 和 `sass` 的情况！ 默认情况下，`sass-loader` 会选择 `sass`。
为了避免这种情况，您可以使用 `implementation` 选项。

`implementation` 选项可以以模块的形式接受 `sass`（`Dart Sass`）或 `node-sass`。

例如，为了使用 Dart Sass，你应该传递：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // `dart-sass` 是首选
              implementation: require('sass'),
            },
          },
        ],
      },
    ],
  },
};
```

需要注意的是，当使用 `sass`（`Dart Sass`）时，由于异步回调的开销，通常情况下**同步编译的速度是异步编译速度的两倍**。
为了避免这种开销，你可以使用 [fibers](https://www.npmjs.com/package/fibers) 包从同步代码中调用异步导入程序。

如果可能，我们会自动注入 [`fibers`](https://github.com/laverdet/node-fibers) 软件包（设置 `sassOptions.fiber`）（当然需要您安装 [`fibers`](https://github.com/laverdet/node-fibers) 包）。

**package.json**

```json
{
  "devDependencies": {
    "sass-loader": "^7.2.0",
    "sass": "^1.22.10",
    "fibers": "^4.0.1"
  }
}
```

你可以通过向 `sassOptions.fiber` 传递 `false` 参数关闭自动注入的 [`fibers`](https://github.com/laverdet/node-fibers) 包。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
              },
            },
          },
        ],
      },
    ],
  },
};
```

你还可以通过一下代码传递 `fiber`：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `sassOptions`

类型：`Object|Function`
默认值：Sass 实现的默认值

[Dart Sass](http://sass-lang.com/dart-sass) 或者 [Node Sass](https://github.com/sass/node-sass) 实现的选项。

> ℹ️ `indentedSyntax` 选项对于 `sass` 拓展为 `true`。

> ℹ️ 像 `data` 和 `file` 这样的选项是不可用的并且他们将会被忽略。

> ℹ 我们推荐不要设置 `outFile`，`sourceMapContents`，`sourceMapEmbed`，`sourceMapRoot` 这些选项，因为当 `sourceMap` 是 `true` 时，`sass-loader` 会自动设置这些选项。

> ℹ️ Access to the [loader context](/api/loaders/#the-loader-context) inside the custom importer can be done using the `this.webpackLoaderContext` property.

There is a slight difference between the `sass` (`dart-sass`) and `node-sass` options.

在使用他们之前，请查阅有关文档：

- [Dart Sass 文档](https://github.com/sass/dart-sass#javascript-api) 提供了所有可用的 `sass` 选项。
- [Node Sass 文档](https://github.com/sass/node-sass/#options) 提供了所有可用的 `node-sass` 选项。

#### `Object`

使用对象设置 Sass 实现的启动选项。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentWidth: 4,
                includePaths: ['absolute/path/a', 'absolute/path/b'],
              },
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

允许通过 loader 上下文为 Sass 实现设置不同的选项。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: (loaderContext) => {
                // 有关可用属性的更多信息 https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === 'styles/foo.scss') {
                  return {
                    includePaths: ['absolute/path/c', 'absolute/path/d'],
                  };
                }

                return {
                  includePaths: ['absolute/path/a', 'absolute/path/b'],
                };
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `sourceMap`

类型：`Boolean`
默认值：取决于 `compiler.devtool` 的值

开启 / 关闭生成 source maps。

默认情况下 source maps 的生成取决于 [`devtool`](/configuration/devtool/) 选项。
除 `eval` 和 `false` 之外的所有值都将开启 source map 的生成。

> ℹ 如果为 `true` 将会忽略来自 `sassOptions` 的 `sourceMap`，`sourceMapRoot`，`sourceMapEmbed`，`sourceMapContents` 和 `omitSourceMapUrl` 选项。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ In some rare cases `node-sass` can output invalid source maps (it is a `node-sass` bug).

> > In order to avoid this, you can try to update `node-sass` to latest version or you can try to set within `sassOptions` the `outputStyle` option to `compressed`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `additionalData`

类型：`String|Function`
默认值：`undefined`

Prepends `Sass`/`SCSS` code before the actual entry file.
In this case, the `sass-loader` will not override the `data` option but just **prepend** the entry's content.

当某些 Sass 变量取决于环境时，这非常有用：

#### `String`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '$env: ' + process.env.NODE_ENV + ';',
            },
          },
        ],
      },
    ],
  },
};
```

#### `Function`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: (content, loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === 'styles/foo.scss') {
                  return '$value: 100px;' + content;
                }

                return '$value: 200px;' + content;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `webpackImporter`

类型：`Boolean`
默认值：`true`

开启 / 关闭默认的 Webpack importer。

在某些情况下，可以提高性能。 但是请谨慎使用，因为 aliases 和以 `〜` 开头的 `@import` 规则将不起作用。
你可以传递自己的 `importer` 来解决这个问题（参阅 [`importer docs`](https://github.com/sass/node-sass#importer--v200---experimental)）。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              webpackImporter: false,
            },
          },
        ],
      },
    ],
  },
};
```

## 示例

### 提取样式表

对于生产版本，我们建议从 bundle 中提取 CSS，以便之后可以使 CSS / JS 资源并行加载。

从 bundle 中提取样式表，有2种可用的方法：

- [mini-css-extract-plugin](/plugins/mini-css-extract-plugin/)（在使用 webpack 4 时使用此 plugin，它将适用于所有用例）
- [extract-loader](https://github.com/peerigon/extract-loader)（简单，专门针对 css-loader 的输出）

**webpack.config.js**

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 在开发过程中回退到 style-loader
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 与 webpackOptions.output 中的选项相似
      // 所有的选项都是可选的
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
```

### Source maps

开启 / 关闭 source maps 的生成。

为了开启 CSS source maps，需要将 `sourceMap` 选项作为参数，传递给 `sass-loader` 和 `css-loader`。

**webpack.config.js**

```javascript
module.exports = {
  devtool: 'source-map', // 任何类似于“source-map”的选项都是可以的
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
```

如果你要在 Chrome 中编辑原始的 Sass 文件， 建议阅读 [这篇不错的博客](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)。具体示例参考 [test/sourceMap](https://github.com/webpack-contrib/sass-loader/tree/master/test)。

## Contributing

如果你还没有阅读过我们的贡献指南，请花一点时间阅读它。

[CONTRIBUTING](https://github.com/webpack-contrib/sass-loader/blob/master/.github/CONTRIBUTING.md)

## License

[MIT](https://github.com/webpack-contrib/sass-loader/blob/master/LICENSE)

[npm]: https://img.shields.io/npm/v/sass-loader.svg
[npm-url]: https://npmjs.com/package/sass-loader
[node]: https://img.shields.io/node/v/sass-loader.svg
[node-url]: https://nodejs.org/
[deps]: https://david-dm.org/webpack-contrib/sass-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/sass-loader
[tests]: https://github.com/webpack-contrib/sass-loader/workflows/sass-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/sass-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/sass-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/sass-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=sass-loader
[size-url]: https://packagephobia.now.sh/result?p=sass-loader
