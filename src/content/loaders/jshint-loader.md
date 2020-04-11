---
title: jshint-loader
source: https://raw.githubusercontent.com/webpack-contrib/jshint-loader/master/README.md
edit: https://github.com/webpack-contrib/jshint-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/jshint-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



处理 JSHint 模块的 webpack loader。
在构建时(build-time)，对 bundle 中的 JavaScript 文件，执行 [JSHint](http://jshint.com/) 检查。

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `jshint-loader`：

```console
$ npm install jshint-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.js/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: `jshint-loader`,
            options: {...options}
          }
        ]
      }
    ]
  }
}
```


然后，通过你偏爱的方式去运行 `webpack`。

## 选项

除了下面列出的自定义 loader 选项外，
所有有效的 JSHint 选项在此对象中都有效：

delete options.;
delete options.;
delete options.;

### `emitErrors`

类型：`Boolean`
默认值：`undefined`

命令 loader，将所有 JSHint 警告和错误，都作为 webpack 错误触发。

### `failOnHint`

类型：`Boolean`
默认值：`undefined`

命令 loader，在所有 JSHint 发生警告和错误时，
都产生 webpack 构建失败。

### `reporter`

类型：`Function`
默认值：`undefined`

此函数用于对 JSHint 输出进行格式化，也可以发出警告和错误。

## 自定义报告函数(custom reporter)

默认情况下，`jshint-loader` 自带一个默认报告函数。

然而，如果你想设置自定义的报告函数，
向 `jshint` 选项的 `reporter` 属性传递一个函数（查看*上面*用法）

报告函数执行时，会传入一个 JSHint 产生的，
由错误/警告构成的数组，结构如下：
```js
[
{
    id:        [字符串，通常是 '(error)'],
    code:      [字符串，错误/警告编码(error/warning code)],
    reason:    [字符串，错误/警告消息(error/warning message)],
    evidence:  [字符串，产生此错误的那段代码]
    line:      [数字]
    character: [数字]
    scope:     [字符串，消息作用域；
                通常是 '(main)' 除非代码被解析过(eval)]

    [+ 还有一些旧有字段，不必关心。]
},
// ...
// 更多的错误/警告
]
```

报告函数执行时，loader context 会作为函数中的 `this`。
你可以使用 `this.emitWarning(...)` 或 `this.emitError(...)` 来发出消息。
查看 [webpack 文档中关于 loader context 的部分](https://webpack.js.org/api/loaders/#the-loader-context)。

_注意：JSHint reporter **并不兼容** JSHint-loader！
这是因为，事实上 reporter 的输入，
只能处理一个文件，而不能处理多个文件。
以这种方式报告的错误，不同于用于 JSHint 的 [传统 reporter](http://www.jshint.com/docs/reporters/) 报告的错误，
这是因为，会对每个资源文件执行 loader plugin（也就是 JSHint-loader），
因此 reporter 函数也会被每个文件执行。_

webpack CLI 中的输出通常是：
```js
...
WARNING in ./path/to/file.js
<reporter output>
...
```
`

## 贡献

如果你从未阅读过我们的贡献指南，请在上面花点时间。

#### [贡献指南](https://raw.githubusercontent.com/webpack-contrib/jshint-loader/master/.github/CONTRIBUTING)

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/jshint-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/jshint-loader.svg
[npm-url]: https://npmjs.com/package/jshint-loader

[node]: https://img.shields.io/node/v/jshint-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/jshint-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/jshint-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/jshint-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/jshint-loader

[cover]: https://codecov.io/gh/webpack-contrib/jshint-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/jshint-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
