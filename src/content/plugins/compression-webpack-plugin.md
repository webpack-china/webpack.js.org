---
title: CompressionWebpackPlugin
source: https://raw.githubusercontent.com/webpack-contrib/compression-webpack-plugin/master/README.md
edit: https://github.com/webpack-contrib/compression-webpack-plugin/edit/master/README.md
repo: https://github.com/webpack-contrib/compression-webpack-plugin
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



预先提供带 Content-Encoding 编码的压缩版本的资源。

## 需求

This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.

## 起步

To begin, you'll need to install `compression-webpack-plugin`:

```console
$ npm install compression-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin()
  ]
}
```

And run `webpack` via your preferred method.

## 选项

### `test`

类型：`String|RegExp|Array<String|RegExp>`
Default: `undefined`

匹配所有对应的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  test: /\.js(\?.*)?$/i
})
```

### `include`

类型：`String|RegExp|Array<String|RegExp>`
默认：`undefined`

所有包含(include)的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  include: /\/includes/
})
```

### `exclude`

类型：`String|RegExp|Array<String|RegExp>`
默认：`undefined`

所有排除(exclude)的文件。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  exclude: /\/excludes/
})
```

### `cache`

类型：`Boolean|String`
默认：`false`

Enable file caching.
The default path to cache directory: `node_modules/.cache/compression-webpack-plugin`.

#### `Boolean`

Enable/disable file caching.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  cache: true
})
```

#### `String`

Enable file caching and set path to cache directory.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  cache: 'path/to/cache'
})
```

### `filename`

类型：`String|Function`
默认：`[path].gz[query]`

目标资源文件名称。

#### `String`

`[file]` is replaced with the original asset filename.
`[path]` is replaced with the path of the original asset.
`[query]` is replaced with the query.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  filename: '[path].gz[query]'
})
```

#### `Function`

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  filename(info) {
    // info.file is the original asset filename
    // info.path is the path of the original asset
    // info.query is the query
    return `${info.path}.gz${info.query}`
  }
})
```

### `algorithm`

类型：`String|Function`
默认：`gzip`

The compression algorithm/function.

#### `String`

The algorithm is taken from [zlib](https://nodejs.org/api/zlib.html).

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  algorithm: 'gzip'
})
```

#### `Function`

Allow to specify a custom compression function.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  algorithm(input, compressionOptions, callback) {
    return compressionFunction(input, compressionOptions, callback);
  }
})
```

### `compressionOptions`

类型：`Object`
默认：`{ level: 9 }`

If you use custom function for the `algorithm` option, the default value is `{}`.

Compression options.
You can find all options here [zlib](https://nodejs.org/api/zlib.html#zlib_class_options).

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  compressionOptions: { level: 1 }
})
```

### `threshold`

类型：`Number`
默认：`0`

只处理比这个值大的资源。按字节计算。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  threshold: 8192
})
```

### `minRatio`

类型：`Number`
默认：`0.8`

只有压缩率比这个值小的资源才会被处理（`minRatio = 压缩大小 / 原始大小`）。
Example: you have `image.png` file with 1024b size, compressed version of file has 768b size, so `minRatio` equal `0.75`.
In other words assets will be processed when the `Compressed Size / Original Size` value less `minRatio` value.
You can use `1` value to process all assets.

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  minRatio: 0.8
})
```

### `deleteOriginalAssets`

类型：`Boolean`
默认：`false`

是否删除原始资源。

```js
// 在 webpack.config.js 中
new CompressionPlugin({
  deleteOriginalAssets: true
})
```

## 示例

### 使用 Zopfli

Prepare compressed versions of assets using `zopfli` library.

> ℹ️ `@gfx/zopfli` require minimum `8` version of `node`.

To begin, you'll need to install `@gfx/zopfli`:

```console
$ npm install @gfx/zopfli --save-dev
```

**webpack.config.js**

```js
const zopfli = require('@gfx/zopfli');

module.exports = {
  plugins: [
    new CompressionPlugin({
      compressionOptions: {
         numiterations: 15
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      }
    })
  ]
}
```

### 使用 Brotli

[Brotli](https://en.wikipedia.org/wiki/Brotli) is a compression algorithm originally developed by Google, and offers compression superior to gzip.

Node 11.7.0 and later has [native support](https://nodejs.org/api/zlib.html#zlib_zlib_createbrotlicompress_options) for Brotli compression in its zlib module.

We can take advantage of this built-in support for Brotli in Node 11.7.0 and later by just passing in the appropriate `algorithm` to the CompressionPlugin:

```js
// 在 webpack.config.js 中
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ]
}
```

**N.B.:** The `level` option matches `BROTLI_PARAM_QUALITY` [for Brotli-based streams](https://nodejs.org/api/zlib.html#zlib_for_brotli_based_streams)

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://raw.githubusercontent.com/webpack-contrib/compression-webpack-plugin/master/.github/CONTRIBUTING.md)

## License

[MIT](https://raw.githubusercontent.com/webpack-contrib/compression-webpack-plugin/master/LICENSE)

[npm]: https://img.shields.io/npm/v/compression-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/compression-webpack-plugin

[node]: https://img.shields.io/node/v/compression-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/compression-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/compression-webpack-plugin

[tests]: https://img.shields.io/circleci/project/github/webpack-contrib/compression-webpack-plugin.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/compression-webpack-plugin

[cover]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[size]: https://packagephobia.now.sh/badge?p=compression-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=compression-webpack-plugin
