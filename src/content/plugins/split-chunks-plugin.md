---
title: SplitChunksPlugin
contributors:
  - sokra
  - jeremenichelli
  - masquevil
related:
  - title: "webpack 4: Code Splitting, chunk graph and the splitChunks optimization"
    url: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
---

Chunks (以及其中引入的模块) 在 webpack 内部结构里被一种父-子的数据结构表示。 `CommonsChunkPlugin`插件是用来避免其中的产生重复依赖的，但更进一步的优化就不可能了。

从 webpack4 以后，`CommonsChunkPlugin`已经被移除，并由`optimization.splitChunks`和`optimization.runtimeChunk`选项代替。下面我们来看看新的流程是如何工作的。


## 默认值

无需经过配置的`SplitChunksPlugin`对于大多数用户来说已经足够使用了。

使用默认的配置，只有那些异步加载的组件会受到处理，因为如果改变原始 chunks 会造成 script 标签的改变，需要将 html 文件也包含进整个项目里才能使用。

webpack 会根据这些条件自动分离 chunks：

* 新的 chunk 可以被复用或者是来自 `node_modules` 目录下
* 新的 chunk 体积大于 30kb（压缩+gzip前）
* 异步加载 chunks 时，最大同时网络请求数小于或等于 5
* 入口页的最大同时网络请求数小于或等于 3

为了满足最后两条条件，chunks 的体积会变得大一些。

我们来看一些例子。

### 默认配置: Example 1

``` js
// index.js

// 动态加载 a.js
import("./a");
```

``` js
// a.js
import "react";

// ...
```

**结果：**会创建一个包含 `react` 的独立的 chunk。这个 chunk 会在动态加载`./a`的同时被加载。

原因：

* 条件1: 这个 chunk 包含来自 `node_modules` 的模块
* 条件2: `react` 超过 30kb
* 条件3: import 被调用时的最大同时请求数为 2
* 条件4: 不影响页面加载时的请求

这么做的原因是什么？在你的应用代码中， `react` 一般不会频繁的更改。把它分离到一个单独的 chunk 里，可以与你的应用代码分开缓存（这里假设你使用了 chunkhash、records、Cache-Control 或者其它长时间缓存策略）。

### 默认配置: Example 2

``` js
// entry.js

// 动态加载 a.js 和 b.js
import("./a");
import("./b");
```

``` js
// a.js
import "./helpers"; // helpers 的大小为 40kb

// ...
```

``` js
// b.js
import "./helpers";
import "./more-helpers"; // more-helpers 的大小为 40kb

// ...
```

**结果：** 会创建一个包含 `./helpers` 和其所有依赖的独立的 chunk。这个 chunk 会在原始 chunks 被调用的同时进行加载。

原因：

* 条件1: 这个模块被不同模块复用
* 条件2: `helpers` 的体积大于 30kb
* 条件3: import 被调用时的最大同时请求数为 2
* 条件4: 不影响页面加载时的请求

将 `helpers` 分别放到每个 chunk 里会导致这部分代码被重复下载两次，使用分离的 chunk 则只会下载一次。我们为此产生了一次额外的请求，而这一点看起来是可以接受的。这就是为什么我们会有体积超过 30kb 的限制。


## 配置

有些开发者希望对这个功能有更多的控制，webpack 为此提供了一系列选项来更好的满足你的需求。

如果你选择手动更改代码分离的配置，请观察评估这些改动所带来的影响，并确定它真的能带来好处。

> 默认配置是根据网站性能的最佳实践而被选择的，但你的项目的最佳体验可能会因为你的需求而有所不同

### Configuring cache groups

The defaults assign all modules from `node_modules` to a cache group called `vendors` and all modules duplicated in at least 2 chunks to a cache group `default`.

A module can be assigned to multiple cache groups. The optimization then prefers the cache group with the higher `priority` (`priority` option) or that one that forms bigger chunks.

### Conditions

Modules from the same chunks and cache group will form a new chunk when all conditions are fulfilled.

There are 4 options to configure the conditions:

* `minSize` (default: 30000) Minimum size for a chunk.
* `minChunks` (default: 1) Minimum number of chunks that share a module before splitting
* `maxInitialRequests` (default 3) Maximum number of parallel requests at an entrypoint
* `maxAsyncRequests` (default 5) Maximum number of parallel requests at on-demand loading

### Naming

To control the chunk name of the split chunk the `name` option can be used.

W> When assigning equal names to different split chunks, all vendor modules are placed into a single shared chunk, though it's not recommend since it can result in more code downloaded.

The magic value `true` automatically chooses a name based on chunks and cache group key, otherwise a string or function can be passed.

When the name matches an entry point name, the entry point is removed.

#### `optimization.splitChunks.automaticNameDelimiter`

By default webpack will generate names using origin and name of the chunk, like `vendors~main.js`.

If your project has a conflict with the `~` character, it can be changed by setting this option to any other value that works for your project: `automaticNameDelimiter: "-"`.

Then the resulting names will look like `vendors-main.js`.

### Select modules

The `test` option controls which modules are selected by this cache group. Omitting it selects all modules. It can be a RegExp, string or function.

It can match the absolute module resource path or chunk names. When a chunk name is matched, all modules in this chunk are selected.

### Select chunks

With the `chunks` option the selected chunks can be configured.

There are 3 values possible `"initial"`, `"async"` and `"all"`. When configured the optimization only selects initial chunks, on-demand chunks or all chunks.

The option `reuseExistingChunk` allows to reuse existing chunks instead of creating a new one when modules match exactly.

This can be controlled per cache group.


### `optimization.splitChunks.chunks: all`

As it was mentioned before this plugin will affect dynamic imported modules. Setting the `optimization.splitChunks.chunks` option to `"all"` initial chunks will get affected by it (even the ones not imported dynamically). This way chunks can even be shared between entry points and on-demand loading.

This is the recommended configuration.

T> You can combine this configuration with the [HtmlWebpackPlugin](/plugins/html-webpack-plugin/), it will inject all the generated vendor chunks for you.


## `optimization.splitChunks`

This configuration object represents the default behavior of the `SplitChunksPlugin`.

```js
splitChunks: {
	chunks: "async",
	minSize: 30000,
	minChunks: 1,
	maxAsyncRequests: 5,
	maxInitialRequests: 3,
	automaticNameDelimiter: '~',
	name: true,
	cacheGroups: {
		vendors: {
			test: /[\\/]node_modules[\\/]/,
			priority: -10
		},
    default: {
			minChunks: 2,
			priority: -20,
			reuseExistingChunk: true
		}
	}
}
```

By default cache groups inherit options from `splitChunks.*`, but `test`, `priority` and `reuseExistingChunk` can only be configured on cache group level.

`cacheGroups` is an object where keys are the cache group names. All options from the ones listed above are possible: `chunks`, `minSize`, `minChunks`, `maxAsyncRequests`, `maxInitialRequests`, `name`.

You can set `optimization.splitChunks.cacheGroups.default` to `false` to disable the default cache group, same for `vendors` cache group.

The priority of the default groups are negative to allow any custom cache group to take higher priority (the default value is `0`).

Here are some examples and their effect:

### Split Chunks: Example 1

Create a `commons` chunk, which includes all code shared between entry points.

```js
splitChunks: {
	cacheGroups: {
		commons: {
			name: "commons",
			chunks: "initial",
			minChunks: 2
		}
	}
}
```

W> This configuration can enlarge your initial bundles, it is recommended to use dynamic imports when a module is not immediately needed.

### Split Chunks: Example 2

Create a `vendors` chunk, which includes all code from `node_modules` in the whole application.

``` js
splitChunks: {
	cacheGroups: {
		commons: {
			test: /[\\/]node_modules[\\/]/,
			name: "vendors",
			chunks: "all"
		}
	}
}
```

W> This might result in a large chunk containing all external packages. It is recommended to only include your core frameworks and utilities and dynamically load the rest of the dependencies.


## `optimization.runtimeChunk`

Setting `optimization.runtimeChunk` to `true` adds an additonal chunk to each entrypoint containing only the runtime.

The value `single` instead creates a runtime file to be shared for all generated chunks.
