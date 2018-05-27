---
title: SplitChunksPlugin
contributors:
  - sokra
  - jeremenichelli
related:
  - title: "webpack 4: Code Splitting, chunk graph and the splitChunks optimization"
    url: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
---

起初，chunk （以及被其引入的模块）是以父子关系的形式被包含在 webpack 的图结构中的。`CommonsChunkPlugin` 曾经被用来避免模块之间重复引用的问题，但是这个插件将不会继续维护了。

自从 webpack 的第 4 个版本开始，`CommonsChunkPlugin` 插件将会被移除，取而代之的是 `optimization.splitChunks` 和 `optimization.runtimeChunk` 两个配置项。以下内容讲解了这些新的工作流如何使用。

## 默认情况

开箱即用的 `SplitChunksPlugin` 应该可以满足大部分用户的需求。

默认情况下该插件只会影响按需加载的 chunks ，因为改变入口 chunks 将会影响到编译后 HTML 页面中 script 标签的插入。

webpack 将会根据以下几点情况自动的分割 chunks ：

* 被分割的新 chunk 可以被共享**或者** 模块是来自 `node_modules` 目录下的。
* 被分割的新 chunk 体积将会大于 30kb （在 min+gz 之前）。
* 在按需加载 chunks 时，并发请求数应小于等于 5 。
* 在首页加载 chunks 时，并发数应小于等于 3 。

当尝试满足后 2 条情况时，通常会优先选择体积更大的 chunks 。

我们来看几个例子。

### 默认情况：例子 1

``` js
// index.js

// 动态引入 a.js
import("./a");
```

``` js
// a.js
import "react";

// ...
```

**结果：** 一个包含 react 库和 a.js 的分割 chunk 将会被创建。import 的使用会让分离出去的 chunk 文件与原入口的 chunk 文件并行加载。

为什么：

* 情况 1：入口 chunk 包含来自 `node_modules` 目录下的模块
* 情况 2：`react` 库的体积大于 30kb
* 情况 3：由于 import 的使用，页面的并发请求数为 2
* 情况 4：不影响首页的加载

变成这种情况的原因是什么？ `react` 库文件在应用中一般不会经常性的变动。将其分割到一个单独的 chunk 中可以与应用代码分别缓存（假设你正在使用 chunkhash、records、Cache-Control 或其他类似的长期缓存方案）。

### 默认情况：例子 2

``` js
// entry.js

// 动态引入 a.js 和 b.js
import("./a");
import("./b");
```

``` js
// a.js
import "./helpers"; // helpers 文件有 40kb 的体积

// ...
```

``` js
// b.js
import "./helpers";
import "./more-helpers"; // more-helpers 文件也有 40kb 的体积

// ...
```

**结果：** 一个包含 helpers 和其所有依赖的分割 chunk 将会被创建。import 的使用让分割 chunk 与原有的入口 chunks 并行加载。

为什么：

* 情况 1：分割 chunk 可以在 a.js 和 b.js 中共享。
* 情况 2：`helpers` 文件大于 30kb。
* 情况 3：使用 import 进行按需加载所产生的并发数为 2。
* 情况 4：不影响首页文件的加载请求。

将 `helpers` 文件中的内容放到每个 chunk 中将会导致每个 chunk 中的 helper 模块被加载 2 次。通过使用代码分割将会变成只加载一次。但是这样做将会导致附加一个并发请求，这时我们就需要有所考虑和权衡。因此才会有一个体积 30kb 的最小限度。


## 配置

为了让那些想要对这个功能有更多控制权的开发者们， webpack 提供了一组自定义的设置来让你满足自己的需求。

如果你手动的更改了分割策略配置，请确定你所配置的结果产生的影响是真正有益的。

W> 我们所提供的默认配置是为了满足 web 性能而产生的最佳实践，但是最好的优化策略，仍然依赖于你项目的实际情况。

### 配置缓存组

默认的配置将所有引用自 `node_modules` 目录下的模块分配到了一个叫做 `vendors` 的缓存组，同时所有模块至少被重复引用 2 次才会被归入 `default` 缓存组。

一个模块是可以被分配到多个缓存组里的。需要被优化的模块会更喜欢`优先级`（ `priority` 配置项）更高的缓存组，或体积更大的 chunks 。

### 分割情况

来自相同 chunks 和缓存组的模块完全满足下列可控的分割情况时，将会产生一个新的 chunk 。

这里有 4 个选项可以控制分割情况：

* `minSize` （默认：30000）一个 chunk 的最小体积。
* `minChunks` （默认：1）模块最少被重复引用几次才会被分割。
* `maxInitialRequests` (默认：3) 入口页面的最大并发数。
* `maxAsyncRequests` (默认：5) 按需加载的最大并发数。

### 命名

为了控制分割后的 chunk 的文件名，可以通过 `name` 选项进行设置。

W> 当把相同的命名分配给不同的分割 chunks 时，所有的混合模块将会被放置到一个单独的共享 chunk 中，但是我们并不赞成这么做，因为这将导致多余的代码加载。

使用魔法般的 `true` 值将会根据 chunks 和 缓存组键名自动选择命名，或者你也可以传入一个字符串或者函数。

当分割 chunk 命名与入口 chunk 的命名相同时，入口 chunk 将会被移除。

#### `optimization.splitChunks.automaticNameDelimiter`

默认情况下 webpack 将会使用源 chunk 的名字自动生成分割 chunk 的名字，例如 `vendors~main.js` 。

如果你的项目不喜欢使用 `~` 字符，你可以通过该设置项设置一个别的字符，例如： `automaticNameDelimiter: "-"` 。

之后，分隔 chunk 的名字将会变成 `vendors-main.js` 。

### 选择模块

`test` 设置项控制了那些模块可以入选缓存组。默认是全部模块都有机会入选，你可以传入正则表达式，字符串或者函数进行控制。

它可以匹配模块的绝对地址或 chunk 的名字。当匹配到 chunk 的名字后，其中所有的模块都会被选中。

### 选择 chunks

使用 `chunks` 配置项可以控制该插件作用于哪种情况的 chunks 。

该设置项有 3 个可能的值 `"initial"`, `"async"` 和 `"all"` 。分别对应初始加载、按需加载、和全部情况。

`reuseExistingChunk` 选项设置了当模块完全匹配时，允许重复使用已存在的 chunks 而不是重新创建。

每个缓存组均可以设置该设置项。


### `optimization.splitChunks.chunks: all`

如之前所说，该插件会作用于动态加载的模块。当将这个选项设置为 all 时，所有初始化 chunks 也将会被该插件影响（即便其中一些模块并不是动态加载的）。这个配置甚至可以在入口文件和按需加载文件中共享分割出来的 chunks 。

这是一个推荐的做法。

T> 你可以结合 [HtmlWebpackPlugin](/plugins/html-webpack-plugin/) 插件来使用这个配置项，它可以为你自动注入所有生成的分隔 chunk 的 script 引用。


## `optimization.splitChunks`

以下的配置对象体现了 `SplitChunksPlugin` 插件的默认配置。

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

默认情况下缓存组会继承 `splitChunks` 的默认配置，但是 `test`,`priority` 和 `reuseExistingChunk` 只能在缓存组中进行配置。

`cacheGroups` 是一个以键名作为缓存组命名的对象。可用的配置有： `chunks`, `minSize`, `minChunks`, `maxAsyncRequests`, `maxInitialRequests`, `name` 。

你可以通过设置 `optimization.splitChunks.cacheGroups.default` 为 `false` 来禁用默认的缓存组或 `vendors` 缓存组。

默认缓存组的优先级是不允许比其他自定义缓存组的优先级高的（默认优先级为 `0`）。

以下是一些配置的例子，以及相应的作用。

### Chunks 分割：例子 1

创建一个包含所有可在入口 chunk 中共享代码段的 `commons` chunk。

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

W>这个配置会使你的代码文件过大，所以当一个模块不是立即被需要的时候，我们推荐使用动态引入(按需加载) 。

### Chunks 分割：例子 2

创建一个包含应用中所有来自 `node_modules` 目录下的模块的 `vendors` chunk。

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

W> 这个也许会产生一个包含所有外部库、并且体积非常大的代码文件。我们建议其中只包含你关心的框架和实用的代码段，其余的实用动态加载去引入剩余的部分。


## `optimization.runtimeChunk`

设置 `optimization.runtimeChunk` 为 `true` 后可以在运行时为每个 entry point 添加一个额外的 chunk。

如果设置值为 `single` ，则会只创建一个可被所有 chunk 引用的代码文件，而不是在每个 chunk 中引入重复代码。
