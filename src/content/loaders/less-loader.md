---
title: less-loader
source: https://raw.githubusercontent.com/webpack-contrib/less-loader/master/README.md
edit: https://github.com/webpack-contrib/less-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/less-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



处理 less 的 webpack loader。将 Less 编译为 CSS。

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `less-loader`：

```console
$ npm install less-loader --save-dev
```

然后，修改 `webpack.config.js`：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      loader: 'less-loader' // 将 Less 编译为 CSS
    }]
  }
};
```

然后，通过你偏爱的方式去运行 `webpack`。

The `less-loader` requires [less](https://github.com/less/less.js) as [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies).
Thus you are able to control the versions accurately.

## 示例

将 [`css-loader`](/loaders/css-loader/)、
[`style-loader`](/loaders/style-loader/)
和 `less-loader` 链式调用，
可以把所有样式立即应用于 DOM。

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader' // creates style nodes from JS strings
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'less-loader' // compiles Less to CSS
      }]
    }]
  }
};
```

You can pass any Less specific options to the `less-loader` via [loader options](https://webpack.js.org/configuration/module/#rule-options-rule-query).
See the [Less documentation](http://lesscss.org/usage/#command-line-usage-options)
for all available options in dash-case. Since we're passing these options to
Less programmatically, you need to pass them in camelCase here:

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader', options: {
          strictMath: true,
          noIeCompat: true
        }
      }]
    }]
  }
};
```

Unfortunately, Less doesn't map all options 1-by-1 to camelCase. When in doubt,
[check their executable](https://github.com/less/less.js/blob/3.x/bin/lessc)
and search for the dash-case option.

### In production

Usually, it's recommended to extract the style sheets into a dedicated file in
production using the
[MiniCssExtractPlugin](/plugins/mini-css-extract-plugin/).
This way your styles are not dependent on JavaScript.

### Imports

Starting with `less-loader` 4, you can now choose between Less' builtin resolver
and webpack's resolver. By default, webpack's resolver is used.

#### webpack resolver

webpack 提供了一种
[解析文件的高级机制](https://webpack.js.org/configuration/resolve/)。
`less-loader` 应用一个 Less 插件，并且将所有查询参数传递给 webpack resolver。
所以，你可以从 `node_modules` 导入你的 less 模块。
只要添加一个 `~` 前缀，
告诉 webpack 去查询 [`模块`](https://webpack.js.org/configuration/resolve/#resolve-modules)。

```css
@import '~bootstrap/less/bootstrap';
```

重要的是只使用 `~` 前缀，因为 `~/` 会解析为主目录。
webpack 需要区分 `bootstrap` 和 `~bootstrap`，
因为 CSS 和 Less 文件没有用于导入相对文件的特殊语法。
`@import "file"` 与 `@import "./file";` 写法相同

##### Non-Less imports

使用 webpack resolver，你可以引入任何文件类型。
你只需要一个导出有效的 Less 代码的 loader。
通常，你还需要设置 `issuer` 条件，
以确保此规则仅适用于 Less 文件的导入：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.js$/,
      issuer: /\.less$/,
      use: [{
        loader: 'js-to-less-loader'
      }]
    }]
  }
};
```

#### Less resolver

If you specify the `paths` option, the `less-loader` will not use webpack's
resolver. Modules, that can't be resolved in the local folder, will be searched
in the given `paths`. This is Less' default behavior. `paths` should be an array
with absolute paths:

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader', options: {
          paths: [
            path.resolve(__dirname, 'node_modules')
          ]
        }
      }]
    }]
  }
};
```

In this case, all webpack features like importing non-Less files or aliasing
won't work of course.

### 插件

想要使用 [插件](http://lesscss.org/usage/#plugins)，
只需像下面这样简单设置 `plugins` 选项：

```js
// webpack.config.js
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
  ...
    {
      loader: 'less-loader', options: {
        plugins: [
          new CleanCSSPlugin({ advanced: true })
        ]
      }
    }]
  ...
};
```

### Extracting style sheets

Bundling CSS with webpack has some nice advantages like referencing images and
fonts with hashed urls or
[hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/)
in development. In production, on the other hand, it's not a good idea to apply
your style sheets depending on JS execution. Rendering may be delayed or even a
[FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) might be visible.
Thus it's often still better to have them as separate files in your final
production build.

There are two possibilities to extract a style sheet from the bundle:

- [`extract-loader`](https://github.com/peerigon/extract-loader) (simpler, but
  specialized on the css-loader's output)
- [MiniCssExtractPlugin](/plugins/mini-css-extract-plugin/)
(more complex, but works in all use-cases)

### source map

想要启用 CSS 的 source map，
你需要将 `sourceMap` 选项传递给 *`less-loader`* 和 *`css-loader`*。
所以你的 `webpack.config.js' 应该是这样：

```javascript
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader', options: {
          sourceMap: true
        }
      }, {
        loader: 'less-loader', options: {
          sourceMap: true
        }
      }]
    }]
  }
};
```

Also checkout the [sourceMaps example](https://github.com/webpack-contrib/less-loader/tree/master/examples/sourceMaps).

如果你要在 Chrome 中编辑原始 Less 文件，
[这里有一个很好的博客文章](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)。
此博客文章是关于 Sass 的，但它也适用于 Less。

### CSS modules gotcha

There is a known problem with Less and
[CSS modules](https://github.com/css-modules/css-modules) regarding relative
file paths in `url(...)` statements.
[See this issue for an explanation](https://github.com/webpack-contrib/less-loader/issues/109#issuecomment-253797335).

## 贡献

如果你从未阅读过我们的贡献指南，
请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/less-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/less-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/less-loader.svg
[npm-url]: https://npmjs.com/package/less-loader

[node]: https://img.shields.io/node/v/less-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/less-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/less-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/less-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/less-loader

[cover]: https://codecov.io/gh/webpack-contrib/less-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/less-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
