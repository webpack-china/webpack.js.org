---
title: 入口和上下文(entry and context)
sort: 4
contributors:
  - sokra
  - skipjack
  - tarang9211
  - byzyk
  - madhavarshney
---

entry 对象是用于 webpack 查找启动并构建 bundle。其上下文是入口文件所处的目录的绝对路径的字符串。


## `context`

`string`

基础目录，__绝对路径__，用于从配置中解析入口起点(entry point)和 loader

``` js
module.exports = {
  //...
  context: path.resolve(__dirname, 'app')
};
```

默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory - 当前执行路径)。

---


## `entry`

`string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })`

开始应用程序打包过程的一个或多个起点。如果传递数组，则会处理所有条目。

动态加载的模块__不是__入口起点。

简单规则：每个 HTML 页面都有一个入口起点。单页应用(SPA)：一个入口起点，多页应用(MPA)：多个入口起点。

```js
module.exports = {
  //...
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js'
  }
};
```


### 命名

如果传入一个字符串或字符串数组，chunk 会被命名为 `main`。如果传入一个对象，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。


### 动态入口

If a function is passed then it will be invoked on every [make](/api/compiler-hooks/#make) event.

> Note that the make event triggers when webpack starts and for every invalidation when [watching for file changes](/configuration/watch/).

```js
module.exports = {
  //...
  entry: () => './demo'
};
```

或

```js
module.exports = {
  //...
  entry: () => new Promise((resolve) => resolve(['./demo', './demo2']))
};
```

For example: you can use dynamic entries to get the actual entries from an external source (remote server, file system content or database):

__webpack.config.js__

``` js
module.exports = {
  entry() {
    return fetchPathsFromSomeExternalSource(); // returns a promise that will be resolved with something like ['src/main-layout.js', 'src/admin-layout.js']
  }
};
```

当结合 [`output.library`](/configuration/output#outputlibrary) 选项时：如果传入数组，则只导出最后一项。
