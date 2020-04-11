---
title: json5-loader
source: https://raw.githubusercontent.com/webpack-contrib/json5-loader/master/README.md
edit: https://github.com/webpack-contrib/json5-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/json5-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



A webpack loader for parsing [json5](https://json5.org/) files into JavaScript objects.

## Getting Started

To begin, you'll need to install `json5-loader`:

```sh
$ npm install json5-loader --save-dev
```

你可以通过以下两种用法使用此 loader：

- 在 webpack 配置里的 `module.loaders` 对象中配置 `json5-loader`；
- 或者，直接在 require 语句中使用 `json5-loader!` 前缀。

假设我们有如下 `json5` 文件：

**file.json5**

```json5
// file.json5
{
  env: 'production',
  passwordStrength: 'strong',
}
```

### Usage with preconfigured loader

**webpack.config.js**

```js
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    /* ... */
  },
  module: {
    loaders: [
      {
        // 使所有以 .json5 结尾的文件使用 `json5-loader`
        test: /\.json5$/,
        loader: 'json5-loader',
      },
    ],
  },
};
```

```js
// index.js
var appConfig = require('./appData.json5');
// 或者 ES6 语法
// import appConfig from './appData.json5'

console.log(appConfig.env); // 'production'
```

### require 语句使用 loader 前缀的用法
```js
var appConfig = require('json5-loader!./appData.json5');
// 返回的是 json 解析过的对象

console.log(appConfig.env); // 'production'
```

如果需要在 Node.js 中使用，不要忘记兼容(polyfill) require。更多参考 webpack 文档。

## 贡献

Please take a moment to read our contributing guidelines if you haven't yet done so.

[贡献指南](https://raw.githubusercontent.com/webpack-contrib/json5-loader/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/json5-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/json5-loader.svg
[npm-url]: https://npmjs.com/package/json5-loader
[node]: https://img.shields.io/node/v/json5-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/json5-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/json5-loader
[tests]: http://img.shields.io/travis/webpack-contrib/json5-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/json5-loader
[cover]: https://codecov.io/gh/webpack-contrib/json5-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/json5-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=json5-loader
[size-url]: https://packagephobia.now.sh/result?p=json5-loader
