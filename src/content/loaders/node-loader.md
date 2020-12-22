---
title: node-loader
source: https://raw.githubusercontent.com/webpack-contrib/node-loader/master/README.md
edit: https://github.com/webpack-contrib/node-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/node-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



[Node.js add-ons](https://nodejs.org/dist/latest/docs/api/addons.html) loader 是一个
增强 require 的模块。 在
[enhanced-require](https://github.com/webpack/enhanced-require) 上执行 add-ons。

## 要求

该模块要求 Node 版本不低于 v6.9.0 而且 Webpack 版本不低于 v4.0.0。

## 开始

首先，需要安装 `node-loader`：

```console
$ npm install node-loader --save-dev
```

然后将 loader 添加到 `webpack` 配置中。比如：

```js
import node from 'file.node';
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  }
}
```

通过命令行：

```console
$ webpack --module-bind 'node=node-loader'
```

### 内联使用

**在项目中**
```js
import node from 'node-loader!./file.node';
```

然后使用你更喜欢的方式运行 `webpack`。

## 证书

#### [MIT](https://github.com/webpack-contrib/node-loader/blob/master/LICENSE)

[npm]: https://img.shields.io/npm/v/node-loader.svg
[npm-url]: https://npmjs.com/package/node-loader

[node]: https://img.shields.io/node/v/node-loader.svg
[node-url]: https://nodejs.org/

[deps]: https://david-dm.org/webpack-contrib/node-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/node-loader

[tests]: https://circleci.com/gh/webpack-contrib/node-loader.svg?style=svg
[tests-url]: https://circleci.com/gh/webpack-contrib/node-loader

[cover]: https://codecov.io/gh/webpack-contrib/node-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/node-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack