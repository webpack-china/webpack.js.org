---
title: expose-loader
source: https://raw.githubusercontent.com/webpack-contrib/expose-loader/master/README.md
edit: https://github.com/webpack-contrib/expose-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/expose-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



expose loader module for webpack

## Requirements

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## Getting Started

To begin, you'll need to install `expose-loader`:

```console
$ npm install expose-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: `expose-loader`,
            options: {...options}
          }
        ]
      }
    ]
  }
}
```

And then require the target file in your bundle's code:

```js
// src/entry.js
require("expose-loader?libraryName!./thing.js");
```

And run `webpack` via your preferred method.

## Examples

例如，假设你要将 jQuery 暴露至全局并称为 `$`：

```js
require("expose-loader?$!jquery");
```

然后，`window.$` 就可以在浏览器控制台中使用。

或者，你可以通过配置文件来设置：

```js
// webpack.config.js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

除了暴露为 `window. $` 之外，假设你还想把它暴露为 `window.jQuery`。
对于多个暴露，你可以在 loader 字符串中使用 `!`：

```js
// webpack.config.js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: 'jQuery'
    },{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

[`require.resolve`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) 调用是一个 Node.js 函数
（与 webpack 处理流程中的 `require.resolve` 无关）。
`require.resolve` 用来获取模块的绝对路径
（`"/.../app/node_modules/react/react.js"`）。
所以这里的暴露只会作用于 React 模块。
并且只在 bundle 中使用到它时，才进行暴露。

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

#### [CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/expose-loader/master/.github/CONTRIBUTING.md)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/expose-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/expose-loader.svg
[npm-url]: https://npmjs.com/package/expose-loader

[node]: https://img.shields.io/node/v/expose-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/expose-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/expose-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/expose-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/expose-loader

[cover]: https://codecov.io/gh/webpack-contrib/expose-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/expose-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
