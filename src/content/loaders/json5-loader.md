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

## 快速开始 {#getting-started}

首先，你需要安装 `json5-loader`：

```sh
$ npm install json5-loader --save-dev
```

你可以通过以下用法使用这个 loader：

- 在 webpack 配置中的 `module.rules` 对象中配置 `json5-loader`，
- 或者直接在 require 语句中使用 `json5-loader!` 前缀。

假设我们有下面这个 `json5` 文件：

**file.json5**

```json5
{
  env: 'production',
  passwordStrength: 'strong',
}
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.json5$/i,
        loader: 'json5-loader',
        type: 'javascript/auto',
      },
    ],
  },
};
```

## Options {#options}

|            Name             |    Type     | Default | Description            |
| :-------------------------: | :---------: | :-----: | :--------------------- |
| **[`esModule`](#esmodule)** | `{Boolean}` | `true`  | 使用 ES modules 语法 |

### `esModule` {#esmodule}

类型：`Boolean`
默认值：`true`

在某些情况下使用 ES modules 是有益的，比如在使用 [module concatenation](/plugins/module-concatenation-plugin/) 和 [tree shaking](/guides/tree-shaking/) 时。

你可以使用以下配置启用 ES module 语法：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.json5$/i,
        loader: 'json5-loader',
        options: {
          esModule: false,
        },
        type: 'javascript/auto',
      },
    ],
  },
};
```

## 示例 {#examples}

### require 语句使用 loader 前缀的用法 {#usage-with-require-statement-loader-prefix}

**file.json5**

```json5
{
  env: 'production',
  passwordStrength: 'strong',
}
```

**index.js**

```js
import appConfig from 'json5-loader!./file.json5';

console.log(appConfig.env); // 'production'
```

如果需要在 Node.js 中使用，不要忘记兼容(polyfill) require。更多参考 webpack 文档。

## 贡献 {#contributing}

如果你还没有看的话请花一点时间阅读我们的贡献指南。

[贡献指南](https://github.com/webpack-contrib/json5-loader/blob/master/.github/CONTRIBUTING.md)

## License {#license}

[MIT](https://github.com/webpack-contrib/json5-loader/blob/master/LICENSE)

[npm]: https://img.shields.io/npm/v/json5-loader.svg
[npm-url]: https://npmjs.com/package/json5-loader
[node]: https://img.shields.io/node/v/json5-loader.svg
[node-url]: https://nodejs.org/
[deps]: https://david-dm.org/webpack-contrib/json5-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/json5-loader
[tests]: https://github.com/webpack-contrib/json5-loader/workflows/json5-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/json5-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/json5-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/json5-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=json5-loader
[size-url]: https://packagephobia.now.sh/result?p=json5-loader
