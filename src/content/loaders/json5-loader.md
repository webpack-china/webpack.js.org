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



用于将 [json5](https://json5.org/) 文件解析为 JavaScript 对象的 webpack loader。

## 开始

首先，你需要安装 `json5-loader`：

```sh
$ npm install json5-loader --save-dev
```

或者你也可以这样使用：

- 在 webpack 配置里的 `module.rules` 对象中配置 `json5-loader` ；
- 直接在 require 语句中使用 `json5-loader!` 前缀。

假设我们有下面这个 `json5` 文件

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

## Options

|            Name             |    Type     | Default | Description            |
| :-------------------------: | :---------: | :-----: | :--------------------- |
| **[`esModule`](#esmodule)** | `{Boolean}` | `true`  | Uses ES modules syntax |

### `esModule`

Type: `Boolean`
Default: `true`

有些情况下，使用 ES 模块是非常有益的，比如 [module concatenation](/plugins/module-concatenation-plugin/)
和 [tree shaking](/guides/tree-shaking/).

可以使用以下方式启用 ES 模块语法：

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

## 例子

### 在 require 居中使用 loader 前缀

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

如何你想在 Node.js 中使用，别忘记完善 require 语句。 详见 webpack 文档。

## 贡献

如果您还没有阅读我们的贡献指南，请花点时间阅读。

[CONTRIBUTING](https://github.com/webpack-contrib/json5-loader/blob/master/.github/CONTRIBUTING.md)

## License

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
