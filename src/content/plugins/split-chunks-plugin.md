---
title: SplitChunksPlugin
contributors:
  - sokra
  - jeremenichelli
related:
  - title: "webpack 4: Code Splitting, chunk graph and the splitChunks optimization"
    url: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
---

最初, 块 (和模块内部引入的模块)通过内部webpack图谱中的父子关系进行关联.  `CommonsChunkPlugin` 用来避免重复的依赖关系, 并在复杂的情况下进一步优化

从版本4之后 `CommonsChunkPlugin` 被移除以支持 `optimization.splitChunks` 和 `optimization.runtimeChunk` 选项. 这是新流程的工作原理


## 默认

开箱即用的 `SplitChunksPlugin` 应该适合大部分用户。

默认情况下他影响按需块因为更改初始模块会影响HTML文件运行时应包含的脚本标记。

webpack将会根据以下条件自动分块：

* 新块可以被共享或者来自`node_modules`文件夹的可以被共享
* 新块大于 30kb (before min+gz)
* 按需加载块时，并行请求的最大数量要小于等于5
* 初始页面加载时的最大并行请求数量要小于等于3

当试图满足最后两个条件时，更大的块是首选

让我们看几个例子：

### 默认: 例1

``` js
// index.js

// dynamically import a.js
import("./a");
```

``` js
// a.js
import "react";

// ...
```

**结论:** 创建一个包含`react`的单独的块. 在导入调用时，该块与包含块`./a`的原始块并行加载.

为什么:

* 条件 1: 该块包含来自`node_modules`的模块
* 条件 2: `react`模块大于30k
* 条件 3: 导入模块的并行请求数是2
* 条件 4: 不影响初始页面加载请求

背后的原理是什么? `react` 或许没有你应用代码的改动那么频繁. 通过将他移动到单独的块中，可以将此块和应用代码单独缓存(假设你正在使用chunkhash, records, Cache-Control 或其他长期缓存方法).

### 默认: 例2

``` js
// entry.js

// dynamically import a.js and b.js
import("./a");
import("./b");
```

``` js
// a.js
import "./helpers"; // helpers is 40kb in size

// ...
```

``` js
// b.js
import "./helpers";
import "./more-helpers"; // more-helpers is also 40kb in size

// ...
```

**结论:** 将创建一个单独的块，其中包含`./helpers`块和他的所有依赖. 在调用时，该块和原始块并行加载。

为什么:

* 条件 1: 该块在两个导入调用之间共存
* 条件 2: `helpers` 大于30kb
* 条件 3: 导入的并发请求数为2
* 条件 4: 不影响初始页面加载请求

将`helpers`的内容放到每个块中将导致他的代码被下载两次. 通过使用单独的块只会下载一次. 我们支付额外请求的成本,这被认为是一种这种方案. 这就是为什么最小为30kb的原因.


## 配置项

对于想更多控制此功能的开发者, webpack 提供了一组选项更好的满足你的需求

如果你手动的改变分割配置, 请衡量改变的影响并确保有真正的用处.

W> 默认选择的配置适合web性能的最佳实践，但是项目的最佳策略会根据其性质而推迟.

### 配置缓存组

缺省值将`node_modules`中的所有模块跟配给一个称为 `vendors` 缓存组，并且所有的模块至少在两个块中缓存到`default`组.

一个模块可以分配给多个缓存组. `optimization`配置会优化选择具有高优先级 `priority` (`priority` option)的高速缓存组或者形成更大块的告诉缓存组.

### 条件

当条件满足时，从相同块中引入的模块和缓存组将形成一个新的块.

可配置的四个选项:

* `minSize` (default: 30000) 块的最小大小.
* `minChunks` (default: 1) 分割之前共享模块的最小块数
* `maxInitialRequests` (default 3) 一个入口点的最大并行请求数
* `maxAsyncRequests` (default 5) 按需加载时最大并行请求数量

### 命名

要控制拆分块的块名称，可以用`name`选项.

W> 为不同的拆分块分配相同的名字时, 所有的vendor模块会被替换成一个分享模块,但不推荐使用，因为可能会导致更多的代码下载.

魔术值 `true` 自动根据块和缓存组件选择一个名称, 除此之外也可以传递 string 和 function.

当命名匹配入口文件名的时候, 入口点被删除.

#### `optimization.splitChunks.automaticNameDelimiter`

默认情况下webpack将会根据源和块名字生成名称，像 `vendors~main.js`.

如果你的项目跟`~` 字符有冲突, 可以通过此选项设置为适用于你项目的其他值: `automaticNameDelimiter: "-"` 通过这样的方式更改.

最终生成的文件名为 `vendors-main.js`.

### 选择模块

`test` 选项控制被缓存组选中哪个模块. 省略此选项会选择所有模块. 他可以是正则, 字符串 或者 函数.

他可以匹配绝对模块资源路径或者块名称. 当块名被匹配的时候, 这个块里的所有模块都会被选中.

### 选择块

使用`chunks` 选项可以配置选定的块.

有三个值可能是 `"initial"`, `"async"` 和 `"all"`. 配置时三个值分别对应初始块，按需加载的块和所有的块.

`reuseExistingChunk` 配置允许重复使用现有的块而不是模块完全匹配时创建一个新的块.

这样就可以控制缓存组.


### `optimization.splitChunks.chunks: all`

正如之前提到的，这个插件会影响动态导入模块. 把 `optimization.splitChunks.chunks` 这个选项设置为 `"all"` 初始块将受其影响 (即使不是动态导入也会被影响). 这种方式甚至可以在入口点和按需加载之间共享.

这是推荐的配置.

T> 你可以将次配置跟 [HtmlWebpackPlugin](/plugins/html-webpack-plugin/)结合使用, 他将会注入到所有生成的vendor块中.


## `optimization.splitChunks`

此配置对象表现 `SplitChunksPlugin` 的默认行为.

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

默认情况下，缓存组将继承 `splitChunks.*`的配置, 但是 `test`, `priority` 和 `reuseExistingChunk` 配置只能在缓存组级别配置.

`cacheGroups` 是一个对象，其中键是缓存组名. 可配置字段为: `chunks`, `minSize`, `minChunks`, `maxAsyncRequests`, `maxInitialRequests`, `name`.

你可以设置 `optimization.splitChunks.cacheGroups.default` 为 `false` 禁用默认缓存组, 对 `vendors` 缓存组也是如此.

默认组的优先级为负数以允许任何一个自定义组有更高的优先级 (默认优先级的值为 `0`).

以下是示例和效果:

### 拆分块: 示例 1

创建一个`commons` 块, 包括所有的入口共享代码.

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

W> 此配置可以扩展你的初始捆绑包, 当一个模块不直接需要的话，我们推荐动态引入.

### 拆分块: 示例 2

创建一个 `vendors` 块, 包含整个应用程序中 `node_modules` 文件夹里所有的代码.

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

W> 这可能会导致生成一个包含所有扩展文件的很大的块. 建议只包含核心框架和实用程序，并动态加载依赖关系.


## `optimization.runtimeChunk`

设置 `optimization.runtimeChunk` 字段为 `true` 会为每个入口添加一个附加块.

值 `single` 代替创建一个运行时文件，以便所有生成的块共享.
