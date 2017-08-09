---
title: 其它选项(Other Options)
sort: 16
contributors:
  - sokra
  - skipjack
  - terinjokes
related:
  - title: Using Records
    url: https://survivejs.com/webpack/optimizing/separating-manifest/#using-records
---


这些是余下的一些为webpack所支持的选项
W> 寻求帮助： 这个页面还在更新中，如果你发现本页面内有描述不准确或者不完整， 请在[gtihub](https://github.com/webpack/webpack.js.org)上创建issue或者pull request



## `amd`

`object`

设置 `require.amd` 或 `define.amd` 的值：

```js
amd: {
  jQuery: true
}
```

```js
bail: true
```

这将迫使 webpack 退出其打包过程。


## `cache`

`boolean` `object`

缓存生成的 webpack 模块和 chunk，来改善构建速度。缓存默认在观察模式(watch mode)启用。禁用缓存只需简单传入：

```js
cache: false
```

如果传递一个对象，webpack 将使用这个对象进行缓存。保持对此对象的引用，将可以在 compiler 调用之间共享同一缓存：

```js
let SharedCache = {};

export default {
  ...,
  cache: SharedCache
}
```

W> 不要在不同选项的调用之间共享缓存。

?> Elaborate on the warning and example - calls with different configuration options?


## `loader`

`object`

在 loader 上下文中暴露自定义值。

?> Add an example...


## `profile`

`boolean`

捕获一个应用程序"配置文件"，包括统计和提示，然后可以使用 [Analyze](https://webpack.github.io/analyse/) 分析工具进行详细分析。

T> 使用 [StatsPlugin](https://www.npmjs.com/package/stats-webpack-plugin) 可以更好地控制生成的配置文件。


## `recordsPath`

记录地址
打开这个选项可以生成包含webpack记录的JSON文件。这个文件记录了数次编译时的模块的特征。 你可以用这个文件来比较各个编译之间模块的改变。 只要简单的设置一下路径就可以生成这个JSON文件

``` js
recordsPath: path.join(__dirname, 'records.json')
```

当复杂的设置导致使用了[代码分割(Code Splittnig)](/guides/code-splitting)的时候， 地址的记录绘相当有用。 这个JSON文件可以用来确保被分割的bundle文件的确根据你的需求被保存进入了[缓存(caching)](/guides/caching) 

T> 注意：尽管这个文件是编译器自动生成的， 最好还是把他也commit了， 这可以让你看到这个文件的历史改动


W> 设置 `recordsPath`会同时把`recordsInputPath`和`recordsOutputPath`设置成相同的路径. 通常来讲这也是符合逻辑的， 除非你想改变记录文件的名称。 可以看下文的例子

## `recordsInputPath`

设定读取最后一条记录的文件的名称。 这可以用来重命名一个记录文件，可以看下文的例子

## `recordsOutputPath`

设定需要被写入的记录。 下文的例子描述了如何用这个选项和`recordsInptuPaht`来重命名一个记录文件

``` js
recordsInputPath: path.join(__dirname, 'records.json'),
recordsOutputPath: path.join(__dirname, 'newRecords.json')
```

***

> 原文：https://webpack.js.org/configuration/other-options/
