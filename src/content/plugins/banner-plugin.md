---
title: BannerPlugin
contributors:
  - simon04
  - byzyk
related:
  - title: banner-plugin-hashing test
    url: https://github.com/webpack/webpack/blob/master/test/configCases/plugins/banner-plugin-hashing/webpack.config.js
---

为每个 chunk 文件头部添加 banner。

```javascript
const webpack = require('webpack');

new webpack.BannerPlugin(banner);
// or
new webpack.BannerPlugin(options);
```


## 选项

<!-- eslint-skip -->

```js
{
  banner: string | function, // 其值为字符串或函数，将作为注释存在
  raw: boolean, // 如果值为 true，将直出，不会被作为注释
  entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
  test: string | RegExp | Array,
  include: string | RegExp | Array,
  exclude: string | RegExp | Array,
}
```

## Usage


```javascript
import webpack from 'webpack';

// string
new webpack.BannerPlugin({
  banner: 'hello world'
});

// function
new webpack.BannerPlugin({
  banner: (yourVariable) => { return `yourVariable: ${yourVariable}`; }
});
```


## 占位符(placeholder)

从 webpack 2.5.0 开始，会对 `banner` 字符串中的占位符取值：

```javascript
import webpack from 'webpack';

new webpack.BannerPlugin({
  banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
});
```
