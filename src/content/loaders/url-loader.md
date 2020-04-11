<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# url-loader

一个将文件转换成 base64 URIs 的 webpack loader。

## 起步

首先，你需要安装 `url-loader`：

```console
$ npm install url-loader --save-dev
```

`url-loader` 功能类似于
[`file-loader`](https://github.com/webpack-contrib/file-loader), 但是在文件大小（byte）小于某个阈值时，可以返回一个 DataURL。

**index.js**

```js
import img from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
```

配置完成后，按照你喜欢的方式运行 `webpack`。

## 选项(Options)

|             名称              |            类型             |                            默认值                            | 描述                                                                         |
| :---------------------------: | :-------------------------: | :-----------------------------------------------------------: | :---------------------------------------------------------------------------------- |
|     **[`limit`](#limit)**     | `{Boolean\|Number\|String}` |                            `true`                             | Specifying the maximum size of a file in bytes.                                     |
|  **[`mimetype`](#mimetype)**  |     `{Boolean\|String}`     | based from [mime-types](https://github.com/jshttp/mime-types) | Sets the MIME type for the file to be transformed.                                  |
|  **[`encoding`](#encoding)**  |     `{Boolean\|String}`     |                           `base64`                            | Specify the encoding which the file will be inlined with.                           |
| **[`generator`](#generator)** |        `{Function}`         |           `() => type/subtype;encoding,base64_data`           | You can create you own custom implementation for encoding data.                     |
|  **[`fallback`](#fallback)**  |         `{String}`          |                         `file-loader`                         | 当目标文件的大小超过设置的阈值时，指定一个替代 url-loader 的 loader。 |
|  **[`esModule`](#esmodule)**  |         `{Boolean}`         |                            `true`                             | Use ES modules syntax.                                                              |

### `limit`

Type: `Boolean|Number|String`
Default: `undefined`

可以通过 loader 选项指定阈值，默认不限制阈值。

#### `Boolean`

是否开启将文件转换为 base64。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `Number|String`

传递一个 `Number` 或 `String` 来指定文件的最大大小，以字节为单位。
如果文件大小等于或大于阈值，将会（默认）使用 [`file-loader`](https://github.com/webpack-contrib/file-loader) 来处理文件，并且所有参数都会传递过去。

通过 `fallback` 选项可以设置其它 `loader` 来替代 `file-loader`。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
```

### `mimetype`

Type: `Boolean|String`
Default: based from [mime-types](https://github.com/jshttp/mime-types)

设置要转换文件的 `mimetype` 类型。
如果没有指定 `mimetype` 的值，则使用 [mime-types](https://github.com/jshttp/mime-types) 指定。

#### `Boolean`

The `true` value allows to generation the `mimetype` part from [mime-types](https://github.com/jshttp/mime-types).
The `false` value removes the `mediatype` part from a Data URL (if omitted, defaults to `text/plain;charset=US-ASCII`).

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `String`

Sets the MIME type for the file to be transformed.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
};
```

### `encoding`

Type: `Boolean|String`
Default: `base64`

Specify the `encoding` which the file will be inlined with.
If unspecified the `encoding` will be `base64`.

#### `Boolean`

If you don't want to use any encoding you can set `encoding` to `false` however if you set it to `true` it will use the default encoding `base64`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              encoding: false,
            },
          },
        ],
      },
    ],
  },
};
```

#### `String`

It supports [Node.js Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) which are `["utf8","utf16le","latin1","base64","hex","ascii","binary","ucs2"]`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              encoding: 'utf8',
            },
          },
        ],
      },
    ],
  },
};
```

### `generator`

Type: `Function`
Default: `(mimetype, encoding, content, resourcePath) => mimetype;encoding,base64_content`

You can create you own custom implementation for encoding data.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|html)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // The `mimetype` and `encoding` arguments will be obtained from your options
              // The `resourcePath` argument is path to file.
              generator: (content, mimetype, encoding, resourcePath) => {
                if (/\.html$/i.test(resourcePath)) {
                  return `data:${mimetype},${content.toString()}`;
                }

                return `data:${mimetype}${
                  encoding ? `;${encoding}` : ''
                },${content.toString(encoding)}`;
              },
            },
          },
        ],
      },
    ],
  },
};
```

### `fallback`

Type: `String`
Default: `'file-loader'`

当目标文件的大小超过设置的阈值（通过 `limit` 选项设置）时，指定一个替代 url-loader 的 loader。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: require.resolve('responsive-loader'),
            },
          },
        ],
      },
    ],
  },
};
```

通过 fallback 指定的 loader 将会接收和 url-loader 一样的配置选项。

例如，想要传递给 responsive-loader 一个 quality 选项，需要如下：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: require.resolve('responsive-loader'),
              quality: 85,
            },
          },
        ],
      },
    ],
  },
};
```

### `esModule`

Type: `Boolean`
Default: `true`

By default, `file-loader` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS module syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

## Examples

### SVG

SVG can be compressed into a more compact output, avoiding `base64`.
You can read about it more [here](https://css-tricks.com/probably-dont-base64-svg/).
You can do it using [mini-svg-data-uri](https://github.com/tigt/mini-svg-data-uri) package.

**webpack.config.js**

```js
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/url-loader.svg
[npm-url]: https://npmjs.com/package/url-loader
[node]: https://img.shields.io/node/v/url-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/url-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/url-loader
[tests]: https://dev.azure.com/webpack-contrib/url-loader/_apis/build/status/webpack-contrib.url-loader?branchName=master
[tests-url]: https://dev.azure.com/webpack-contrib/url-loader/_build/latest?definitionId=2&branchName=master
[cover]: https://codecov.io/gh/webpack-contrib/url-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/url-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=url-loader
[size-url]: https://packagephobia.now.sh/result?p=url-loader

```

```
