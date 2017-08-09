---
title: thread-loader
source: https://raw.githubusercontent.com/webpack-contrib/thread-loader/master/README.md
edit: https://github.com/webpack-contrib/thread-loader/edit/master/README.md
---
## Install
安装

```bash
npm install --save-dev thread-loader
```

## Usage
使用
把这个loader放置在其他loader之前， 放置在这个loader之后的loader就会在一个单独的工人池(worker pool)中运行

在工人池(worker pool)中运行的loader是受到限制的。 比如
* 这些Loader不能产生新的文件
* 这些Loader不能使用定制的loader API(即，通过插件)
* 这些Loader无法获取webpack的选项设置

每个工人(worker)都是一个单独的有600ms限制的node.js进程。 同时跨进程的数据交换也会被限制。

请仅在耗时的loader上使用

## Examples
例子
**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
          "expensive-loader"
        ]
      }
    ]
  }
}
```

**with options**
选项
```js
use: [
  {
    loader: "thread-loader",
    // 有同样配置的loader会共享一个工人池(worker pool)
    options: {
      // 产生的工人(workre)的数量，默认是cpu的核心数
      workers: 2,

      // 一个工人(workre)进程中并行执行工作的数量
      // 默认为20
      workerParallelJobs: 50,

      // 额外的node.js参数
      workerNodeArgs: ['--max-old-space-size', '1024'],

      // 闲置时定时删除工人(workre)进程
      // 默认为500ms
      // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持工人(workre)持续存在
      poolTimeout: 2000,

      // 池(pool)分配给工人(workre)的工作数量
      // 默认为200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池(pool)的名称
      // 可以修改名称来创建其余选项都一样的池(pool)
      name: "my-pool"
    }
  },
  "expensive-loader"
]
```

**prewarming**
预热
可以通过预热工人池(worker pool)来防止启动工人(worker)时的高延时

这会启动池(pool)内最大数量的工人(workre)并把指定的模块载入node.js的模块缓存中。

``` js
const threadLoader = require('thread-loader');

threadLoader.warmup({
  // pool options, like passed to loader options
  // must match loader options to boot the correct pool
}, [
  // modules to load
  // can be any module, i. e.
  'babel-loader',
  'babel-preset-es2015',
  'sass-loader',
]);
```


## Maintainers
维护者
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/sokra">
          <img width="150" height="150" src="https://github.com/sokra.png?size=150">
          </br>
          sokra
        </a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/thread-loader.svg
[npm-url]: https://npmjs.com/package/thread-loader

[deps]: https://david-dm.org/webpack-contrib/thread-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/thread-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack-contrib/thread-loader.svg
[test-url]: https://travis-ci.org/webpack-contrib/thread-loader

[cover]: https://codecov.io/gh/webpack-contrib/thread-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/thread-loader

***

> 原文：https://webpack.js.org/loaders/thread-loader/
