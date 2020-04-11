---
title: LimitChunkCountPlugin
contributors:
  - rouzbeh84
  - skipjack
  - tbroadley
  - byzyk
  - EugeneHlushko
---

当你在编写代码时，可能已经添加了许多代码分离点(code split point)来实现按需加载(load stuff on demand)。在编译完之后，你可能会注意到有一些很小的 chunk - 这产生了大量 HTTP 请求开销。`LimitChunkCountPlugin` 插件可以通过合并的方式，后处理你的 chunk，以减少请求数。

``` js
new webpack.optimize.LimitChunkCountPlugin({
  // 选项……
});
```


## 选项

可以支持以下选项：

### `maxChunks`

`number`

使用大于或等于 `1` 的值，来限制 chunk 的最大数量。使用 `1` 防止添加任何其他额外的 chunk，这是因为 entry/main chunk 也会包含在计数之中。

__webpack.config.js__

```javascript
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5
    })
  ]
};
```

### `minChunkSize`

`number`

设置 chunk 的最小大小。

__webpack.config.js__

```javascript
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      minChunkSize: 1000
    })
  ]
};
```


## 命令行接口(CLI)用法

此插件和其选项还可以通过 [命令行接口(CLI)](/api/cli/) 执行：

```bash
webpack --optimize-max-chunks 15
```

或

```bash
webpack --optimize-min-chunk-size 10000
```
