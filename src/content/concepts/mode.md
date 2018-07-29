---
title: 模式(mode)
sort: 4
contributors:
  - EugeneHlushko
---

提供 `mode` 配置选项，告知 webpack 使用相应模式的内置优化。

`string`

## 用法

只在配置中提供 `mode` 选项：

```javascript
module.exports = {
  mode: 'production'
};
```


或者从 [CLI](/api/cli/) 参数中传递：

```bash
webpack --mode=production
```

如果不设置，webpack 会将 `production` 设为 `mode` 的默认值。mode 支持以下值：

选项                | 描述
--------------------- | -----------------------
`development`         | 会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。
`production`          | 会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.
`none`                | 不选用任何默认优化选项

T> 记住，只设置 `NODE_ENV`，则不会自动设置 `mode`。


### mode: development


```diff
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```


### mode: production


```diff
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```


### mode: none


```diff
// webpack.custom.config.js
module.exports = {
+  mode: 'none',
-  plugins: [
-  ]
}
```
