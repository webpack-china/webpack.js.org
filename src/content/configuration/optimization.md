---
title: 优化(optimization)
sort: 8
contributors:
  - EugeneHlushko
  - jeremenichelli
  - simon04
  - byzyk
  - madhavarshney
  - dhurlburtusa
related:
  - title: 'webpack 4: Code Splitting, chunk graph and the splitChunks optimization'
    url: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
---

从 webpack 4 开始，会根据你选择的 [`mode`](/concepts/mode/) 来执行不同的优化，不过所有的优化还是可以手动配置和重写。


## `optimization.minimize`

`boolean`

告知 webpack 使用 [TerserPlugin](/plugins/terser-webpack-plugin/) 压缩 bundle。

`production` 模式下，这里默认是 `true`。

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    minimize: false
  }
};
```

T> 了解 [mode](/concepts/mode/) 工作机制。

## `optimization.minimizer`

`[<plugin>]` and or `[function (compiler)]`

允许你通过提供一个或多个定制过的 [TerserPlugin](/plugins/terser-webpack-plugin/) 实例，覆盖默认压缩工具(minimizer)。

__webpack.config.js__

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  }
};
```

Or, as function:

```js
module.exports = {
  optimization: {
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({ /* your config */ }).apply(compiler);
      }
    ],
  }
};
```

## `optimization.splitChunks`

`object`

对于动态导入模块，默认使用 webpack v4+ 提供的全新的通用分块策略(common chunk strategy)。请在 [SplitChunksPlugin](/plugins/split-chunks-plugin/) 页面中查看配置其行为的可用选项。

## `optimization.runtimeChunk`

`object` `string` `boolean`

将 `optimization.runtimeChunk` 设置为 `true` 或 `"multiple"`，会为每个仅含有 runtime 的入口起点添加一个额外 chunk。此设置是如下设置的别名：

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
};
```

值 `"single"` 会创建一个在所有生成 chunk 之间共享的运行时文件。此设置是如下设置的别名：

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

通过将 `optimization.runtimeChunk` 设置为 `object`，对象中可以设置只有 `name` 属性，其中属性值可以是名称或者返回名称的函数，用于为 runtime chunks 命名。

默认值是 `false`：每个入口 chunk 中直接嵌入 runtime。

W> 对于每个 runtime chunk，导入的模块会被分别初始化，因此如果你在同一个页面中引用多个入口起点，请注意此行为。你或许应该将其设置为 `single`，或者使用其他只有一个 runtime 实例的配置。

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    }
  }
};
```

## `optimization.noEmitOnErrors`

`boolean`

在编译出错时，使用 `optimization.noEmitOnErrors` 来跳过生成阶段(emitting phase)。这可以确保没有生成出错误资源。而 stats 中所有 assets 中的 `emitted` 标记都是 `false`。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    noEmitOnErrors: true
  }
};
```

W> 如果你正在使用 webpack [CLI](/api/cli/)，在此插件开启时，webpack 处理过程不会因为错误代码而退出。如果你希望在使用 CLI 时 webpack "失败(fail)"，请查看 [`bail` 选项](/api/cli/#advanced-options)。

## `optimization.namedModules`

`boolean: false`

告知 webpack 使用可读取模块标识符(readable module identifiers)，来帮助更好地调试。webpack 配置中如果没有设置此选项，默认会在 [mode](/concepts/mode/) `development` 启用，在 [mode](/concepts/mode/) `production` 禁用。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    namedModules: true
  }
};
```

## `optimization.namedChunks`

`boolean: false`

告知 webpack 使用可读取 chunk 标识符(readable chunk identifiers)，来帮助更好地调试。webpack 配置中如果没有设置此选项，默认会在 [mode](/concepts/mode/) `development` 启用，在 [mode](/concepts/mode/) `production` 禁用。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    namedChunks: true
  }
};
```

## `optimization.moduleIds`

`bool: false` `string: natural, named, hashed, size, total-size`

Tells webpack which algorithm to use when choosing module ids. Setting `optimization.moduleIds` to `false` tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. By default `optimization.moduleIds` is set to `false`.

The following string values are supported:

Option                | Description
--------------------- | -----------------------
`natural`             | Numeric ids in order of usage.
`named`               | Readable ids for better debugging.
`hashed`              | Short hashes as ids for better long term caching.
`size`                | Numeric ids focused on minimal initial download size.
`total-size`          | numeric ids focused on minimal total download size.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    moduleIds: 'hashed'
  }
};
```

## `optimization.chunkIds`

`bool: false` `string: natural, named, size, total-size`

Tells webpack which algorithm to use when choosing chunk ids. Setting `optimization.chunkIds` to `false` tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. There are couple of defaults for `optimization.chunkIds`:

- if [`optimization.occurrenceOrder`](#optimization-occurrenceorder) is enabled `optimization.chunkIds` is set to `'total-size'`
- Disregarding previous if, if [`optimization.namedChunks`](#optimization-namedchunks) is enabled `optimization.chunkIds` is set to `'named'`
- if none of the above, `optimization.namedChunks` will be defaulted to `'natural'`

The following string values are supported:

Option                  | Description
----------------------- | -----------------------
`'natural'`             | Numeric ids in order of usage.
`'named'`               | Readable ids for better debugging.
`'size'`                | Numeric ids focused on minimal initial download size.
`'total-size'`          | numeric ids focused on minimal total download size.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    chunkIds: 'named'
  }
};
```

## `optimization.nodeEnv`

`string` `bool: false`

告知 webpack 将 `process.env.NODE_ENV` 设置为一个给定字符串。如果 `optimization.nodeEnv` 不是 `false`，则会使用 [DefinePlugin](/plugins/define-plugin/)，`optimization.nodeEnv` __默认值__取决于 [mode](/concepts/mode/)，如果为 falsy 值，则会回退到 `"production"`。

可能的值有：

- 任何字符串：用于设置 `process.env.NODE_ENV` 的值。
- false：不修改/设置 `process.env.NODE_ENV`的值。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    nodeEnv: 'production'
  }
};
```

## `optimization.mangleWasmImports`

`bool: false`

在设置为 `true` 时，告知 webpack 通过将导入修改为更短的字符串，来减少 WASM 大小。这会破坏模块和导出名称。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    mangleWasmImports: true
  }
};
```

## `optimization.removeAvailableModules`

`bool: true`

如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。将 `optimization.removeAvailableModules` 设置为 `false` 以禁用这项优化。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    removeAvailableModules: false
  }
};
```

## `optimization.removeEmptyChunks`

`bool: true`

如果 chunk 为空，告知 webpack 检测或移除这些 chunk。将 `optimization.removeEmptyChunks` 设置为 `false` 以禁用这项优化。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    removeEmptyChunks: false
  }
};
```

## `optimization.mergeDuplicateChunks`

`bool: true`

告知 webpack 合并含有相同模块的 chunk。将 `optimization.mergeDuplicateChunks` 设置为 `false` 以禁用这项优化。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    mergeDuplicateChunks: false
  }
};
```

## `optimization.flagIncludedChunks`

`bool`

告知 webpack 确定和标记出作为其他 chunk 子集的那些 chunk，其方式是在已经加载过较大的 chunk 之后，就不再去加载这些 chunk 子集。`optimization.flagIncludedChunks` 默认会在 `production` [mode](/concepts/mode/) 中启用，其他情况禁用。

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    flagIncludedChunks: true
  }
};
```

## `optimization.occurrenceOrder`

`bool`

Tells webpack to figure out an order of modules which will result in the smallest initial bundle. By default `optimization.occurrenceOrder` is enabled in `production` [mode](/concepts/mode/) and disabled elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    occurrenceOrder: false
  }
};
```

## `optimization.providedExports`

`bool`

Tells webpack to figure out which exports are provided by modules to generate more efficient code for `export * from ...`. By default  `optimization.providedExports` is enabled.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    providedExports: false
  }
};
```

## `optimization.usedExports`

`bool`

Tells webpack to determine used exports for each module. This depends on [`optimization.providedExports`](#optimization-occurrenceorder). Information collected by `optimization.usedExports` is used by other optimizations or code generation i.e. exports are not generated for unused exports, export names are mangled to single char identifiers when all usages are compatible.
Dead code elimination in minimizers will benefit from this and can remove unused exports.
By default `optimization.usedExports` is enabled in `production` [mode](/concepts/mode/) and disabled elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    usedExports: true
  }
};
```

## `optimization.concatenateModules`

`bool`

Tells webpack to find segments of the module graph which can be safely concatenated into a single module. Depends on [`optimization.providedExports`](#optimization-providedexports) and [`optimization.usedExports`](#optimization-usedexports).
By default `optimization.concatenateModules` is enabled in `production` [mode](/concepts/mode/) and disabled elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    concatenateModules: true
  }
};
```

## `optimization.sideEffects`

`bool`

Tells webpack to recognise the [`sideEffects`](https://github.com/webpack/webpack/blob/master/examples/side-effects/README.md) flag in `package.json` or rules to skip over modules which are flagged to contain no side effects when exports are not used.

__package.json__

``` json
{
  "name": "awesome npm module",
  "version": "1.0.0",
  "sideEffects": false
}
```

T> Please note that `sideEffects` should be in the npm module's `package.json` file and doesn't mean that you need to set `sideEffects` to `false` in your own project's `package.json` which requires that big module.

`optimization.sideEffects` depends on [`optimization.providedExports`](#optimization-providedexports) to be enabled. This dependency has a build time cost, but eliminating modules has positive impact on performance because of less code generation. Effect of this optimization depends on your codebase, try it for possible performance wins.

By default `optimization.sideEffects` is enabled in `production` [mode](/concepts/mode/) and disabled elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    sideEffects: true
  }
};
```

## `optimization.portableRecords`

`bool`

`optimization.portableRecords` tells webpack to generate records with relative paths to be able to move the context folder.

By default `optimization.portableRecords` is disabled. Automatically enabled if at least one of the records options provided to webpack config: [`recordsPath`](/configuration/other-options/#recordspath), [`recordsInputPath`](/configuration/other-options/#recordsinputpath), [`recordsOutputPath`](/configuration/other-options/#recordsoutputpath).

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    portableRecords: true
  }
};
```
