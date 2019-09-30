---
title: url-loader
source: https://raw.githubusercontent.com/webpack-contrib/url-loader/master/README.md
edit: https://github.com/webpack-contrib/url-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/url-loader
---

该文档适用于：`v2.1.0`

一个将文件转换成 `base64 URIs` 的 `webpack` `loader`。

## 用法

首先，你需要安装 `url-loader`:

```console
$ npm install url-loader --save-dev
```

`url-loader` 功能类似于
[`file-loader`](https://github.com/webpack-contrib/file-loader), 但是在文件大小（byte）小于某个阈值时，可以返回一个 `DataURL`。

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

配置完成后，通过你喜欢的方式运行 `webpack` 。

## 选项（Options）

### `fallback`

类型: `String`
默认值: `'file-loader'`

当目标文件的大小超过设置的阈值（通过 `limit` 选项设置）时，指定一个替代 `url-loader` 的 `loader`。

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
              fallback: 'responsive-loader',
            },
          },
        ],
      },
    ],
  },
};
```

通过 `fallback` 指定的 `loader` 将会接收和 `url-loader` 一样的配置项。

例如，在 `url-loader` 上的配置 `quality: 85` 也会传递给 `responsive-loader`。

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
              fallback: 'responsive-loader',
              quality: 85,
            },
          },
        ],
      },
    ],
  },
};
```

### `limit`

类型: `Number|Boolean|String`
默认值: `undefined`

通过配置 `limit` 选项，可以为 `url-loader` 指定一个阈值，当文件大小小于该阈值或者没设置该选项时使用 `url-loader`。

#### `Number`

如果 `limit` 配置了一个数值型的值，则表示文件最大大小（阈值）。

如果文件真实大小大于或等于 `limit`，将会使用 `file-loader` （默认）来处理文件，并且所有参数都会传递过去。

通过 `fallback` 选项可以设置其它 `loader` 来替代 `url-loader`。

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

#### `Boolean`

如果 `limit` 配置了一个布尔型的值，则表示是否转成 `base64`。

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

### `mimetype`

类型: `String`
默认值: `(file extension)`

设置要转换文件的 `MIME` 类型。如果没有指定，则使用文件扩展名来查找 `MIME` 类型。

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

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)