---
title: 构建性能
sort: 17
contributors:
  - sokra
---

本指南包含一些改进构建/编译性能的实用技巧。

---

## 常规

无论你正在 [development](/guides/development) 或构建 [production](/guides/production)，以下做法应该帮助到你达到最佳。


### 保持版本最新

使用最新的 webpack 版本。我们会经常进行性能优化。最新版的 webpack 是:

[![latest webpack version](https://img.shields.io/npm/v/webpack.svg?label=webpack&style=flat-square&maxAge=3600)](https://github.com/webpack/webpack/releases)

保持最新的 __Node.js__ 也能够保证性能。除此之外，保证你的包管理工具 (例如 `npm` 或者 `yarn` ) 为最新也能保证性能。较新的版本能够建立更高效的模块树以及提高解析速度。


### Loaders

将 loaders 应用于最少数的必要模块中。而不是:

``` js
{
  test: /\.js$/,
  loader: "babel-loader"
}
```

使用 `include` 字段仅将 loader 应用在实际需要转换的模块中:

``` js
{
  test: /\.js$/,
  include: path.resolve(__dirname, "src"),
  loader: "babel-loader"
}
```


### Bootstrap

每个额外的 loader/plugin 都有启动时间。尽量少使用不同的工具。


### 解析

以下几步可以提供解析速度:

- 在增加文件系统调用时，尽量减少 `resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles` 的数量。
- 如果你不需要使用 symlinksSet ，你可以设置 `resolve.symlinks: false` (例如 `npm link` 或者 `yarn link`).
- 如果你使用自定义解析 plugins ，并且与特殊 context 无关。你可以设置 `resolve.cacheWithContext: false` 。


### Dlls

使用 `DllPlugin` 将更改不频繁的代码进行单独编译。这将改善引用程序的编译速度，即使它增加了构建过程的复杂性。


### Smaller = Faster

减少编译的整体大小，以提高构建性能。尽量保持 chunks 小巧。

- 使用 较少/较小 的库。
- 在多页面应用程序中使用 `CommonsChunksPlugin`。
- 在多页面应用程序中以 `async` 模式使用 `CommonsChunksPlugin ` 。
- 移除不使用的代码。
- 只编译你当前正在开发部分的代码。


### Worker Pool

`thread-loader` 可以将非常消耗资源的 loaders 加入到 worker pool 中。

W> 不要使用太多的 wokers ，因为 Node.js 的 runtime 和 loader 有一定的系统开销。减少 workers 和主进程间的传输。进程间通讯(IPC)是非常消耗资源的。


### 持久化缓存

使用 `cache-loader` 启用持久化缓存。使用 `package.json` 中的 `"postinstall"` 清除缓存目录。


### 自定义 plugins/loaders

这里不对他们配置的性能问题作过多赘述。

---


## Development

下面步骤对于 _development_ 特别有用。


### 增量编译

使用 webpack 的监听模式。在监听你的文件和调用 webpack 时不要使用其他工具。在监听模式下构建会记录时间戳并将信息传递给编译让缓存失效。

在某些设置中，监听会回退到轮询模式。有许多监听文件会导致 CPU 大量负载。在这些情况下，你可以使用 `watchOptions.poll` 来增加轮询的间隔。


### 内存编译

以下几个实用工具通过在内存中进行代码的编译和资源的提供，但并不写入磁盘来提高性能:

- `webpack-dev-server`
- `webpack-hot-middleware`
- `webpack-dev-middleware`


### Devtool

需要注意的是不同的 `devtool` 的设置，会导致不同的性能差异。

- `"eval"` 具有最好的性能，但并不能帮助你处理代码。
- 如果你历经了较差的映射性能，使用 `cheap-source-map` 配置拥有更高的性能
- 增量编译使用 `eval-source-map` 配置。

=> 在大多数情况下，`eval-cheap-module-source-map` 是最好的选择。


### 忽略生产环境下的特殊工具

某些实用工具，无论是 plugins 还是 loaders 都只能在构建生产环境时才能够使用。例如，在开发时使用 `UglifyJsPlugin` 来压缩和修改代码是没有意义的。以下这些工具通常在开发中不会使用:

- `UglifyJsPlugin`
- `ExtractTextPlugin`
- `[hash]`/`[chunkhash]`
- `AggressiveSplittingPlugin`
- `AggressiveMergingPlugin`
- `ModuleConcatenationPlugin`


### 保证入口 Chunk 最小

webpack 只会告知文件系统已经更新的 chunk 。对于某些配置选项(HMR, `[name]`/`[chunkhash]` in `output.chunkFilename`, `[hash]`)来说，除了已经改变的 chunks 外，对于入口 chunk 来说不会生效。

Make sure the entry chunk is cheap to emit by keeping it small. The following code block extracts a chunk containing only the runtime with _all other chunks as children_:

``` js
new CommonsChunkPlugin({
  name: "manifest",
  minChunks: Infinity
})
```

---


## Production

The following steps are especially useful in _production_.

W> __Don't sacrifice the quality of your application for small performance gains!__ Keep in mind that optimization quality is in most cases more important than build performance.


### Multiple Compilations

When using multiple compilations the following tools can help:

- [`parallel-webpack`](https://github.com/trivago/parallel-webpack): It allows to do compilation in a worker pool.
- `cache-loader`: The cache can be shared between multiple compilations.


### Source Maps

Source maps are really expensive. Do you really need them?

---


## Specific Tooling Issues

The following tools have certain problems that can degrade build performance.


### Babel

- Minimize the number of preset/plugins


### Typescript

- Use the `fork-ts-checker-webpack-plugin` for type checking in a separate process.
- Configure loaders to skip typechecking.
- Use the `ts-loader` in `happyPackMode: true` / `transpileOnly: true`.


### Sass

- `node-sass` has a bug which blocks threads from the Node.js threadpool. When using it with the `thread-loader` set `workerParallelJobs: 2`.

