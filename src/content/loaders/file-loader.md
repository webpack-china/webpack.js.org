---
title: file-loader
source: https://raw.githubusercontent.com/webpack-contrib/file-loader/master/README.md
edit: https://github.com/webpack-contrib/file-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/file-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



`file-loader` 将 `import`/`require()` 引入的文件解析成 url，并将文件输出到输出目录。

## 入门指南

首先，你需要安装 `file-loader`:

```console
$ npm install file-loader --save-dev
```

通过 Import (或 `require`) 在其中一个 bundles 文件引入目标文件：

**file.js**

```js
import img from './file.png';
```

然后在 `webpack` 配置文件中添加 loader。比如：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
```

最后，通过你喜欢的方式运行 `webpack`。运行完毕后将会生成 `file.png` 文件
并输出到输出目录（如果 Options 指定了输出文件的命名方式，文件将遵循该命名约定），
同时返回该文件的公共 URI。

> ℹ️ 默认情况下，生成的文件的文件名就是文件内容的哈希值并保留所引用资源的原始扩展名。

## Options

### `name`

类型: `String|Function`
默认值: `'[contenthash].[ext]'`

使用查询参数 `name` 为目标文件制定一个自定义文件名模板。
例如，将 `context` 目录下的一个文件输出到输出目录，
并且保留完整的目录结构，你可以这样操作：

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name(resourcePath, resourceQuery) {
            // `resourcePath` - `/absolute/path/to/file.js`
            // `resourceQuery` - `?foo=bar`

            if (process.env.NODE_ENV === 'development') {
              return '[path][name].[ext]';
            }

            return '[contenthash].[ext]';
          },
        },
      },
    ],
  },
};
```

> ℹ️ 默认情况下，文件将会按照你指定的目录和名称输出到该目录，而且你也可以通过使用同样的 URI 访问输出的文件。

### `outputPath`

类型: `String|Function`
默认值: `undefined`

为目标文件指定放置的文件系统路径。

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: (url, resourcePath, context) => {
            // `resourcePath` 指向资源的原始绝对路径
            // `context` 指向存放资源（`rootContext`）和 `context` 选项的目录

            // 要获取相对路径，你可以使用
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_output_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `output_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `publicPath`

类型: `String|Function`
默认值: [`__webpack_public_path__`](/api/module-variables/#__webpack_public_path__-webpack-specific)

为目标文件指定自定义公共路径。

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          publicPath: 'assets',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          publicPath: (url, resourcePath, context) => {
            // `resourcePath` 指向资源的原始绝对路径
            // `context` 指向存放资源（`rootContext`）和 `context` 选项的目录

            // 要获取相对路径，你可以使用
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_public_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `public_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `postTransformPublicPath`

类型: `Function`
默认值: `undefined`

指定自定义函数来后处理生成的公共路径。该函数用于预先添加或追加仅在运行时可用的动态全局变量，如 `__webpack_public_path__`。如果只配置 `publicPath` 是不可用的，因为变量的值会被转化成字符串。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          publicPath: '/some/path/',
          postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
        },
      },
    ],
  },
};
```

### `context`

类型: `String`
默认值: [`context`](/configuration/entry-context/#context)

指定一个自定义文件上下文。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: 'project',
            },
          },
        ],
      },
    ],
  },
};
```

### `emitFile`

类型: `Boolean`
默认值: `true`

如果为 true， 则输出一个文件（将文件写入文件系统）。
如果为 false，loader 将会返回一个公共 URI，但不会输出文件。
通常对服务端的包禁用此选项是有用的。

**file.js**

```js
// bundle 文件
import img from './file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
};
```

### `regExp`

类型: `RegExp`
默认值: `undefined`

为目标文件路径的一个或多个部分指定正则表达式。
在 `name` 属性中使用 `[N]`
[placeholder](https://github.com/webpack-contrib/file-loader#placeholders) 可以重用捕获组。

**file.js**

```js
import img from './customer01/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/i,
              name: '[1]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ️ 如果使用 `[0]`，将被整个测试字符串替换，而 `[1]` 将包含正则表达式的第一个捕获括号，依此类推。。。

### `esModule`

类型: `Boolean`
默认值: `true`

默认情况下，`file loader` 生成使用 ES 模块语法的 JS 模块。
有些情况下，使用ES模块是有益的，比如 [module concatenation](/plugins/module-concatenation-plugin/) 和
 [tree shaking](/guides/tree-shaking/)。

你可以使用以下命令启用 CommonJS 模块语法：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
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

## Placeholders

更多关于占位符（placeholder）的内容，请查看 [这里](https://github.com/webpack/loader-utils#interpolatename).

### `[ext]`

类型: `String`
默认值: `file.extname`

目标文件/资源的文件扩展。

### `[name]`

类型: `String`
默认值: `file.basename`

文件/资源的基本名称。

### `[path]`

类型: `String`
默认值: `file.directory`

资源相对于 webpack/config `context` 的路径。

### `[folder]`

类型: `String`
默认值: `file.folder`

资源所在的文件夹。

### `[query]`

类型: `String`
默认值: `file.query`

资源查询，如 `?foo=bar`。

### `[emoji]`

类型: `String`
默认值: `undefined`

`content` 的随机表情符号。

### `[emoji:<length>]`

类型: `String`
默认值: `undefined`

同上，但自定义指定了表情符号的数量。

### `[hash]`

类型: `String`
默认值: `md4`

指定用于散列文件内容的哈希方法。

### `[contenthash]`

类型: `String`
默认值: `md4`

指定用于散列文件内容的哈希方法。

### `[<hashType>:hash:<digestType>:<length>]`

类型: `String`

散列选项。内容（缓冲器 buffer）(默认情况下是十六进制摘要)。

#### `digestType`

类型: `String`
默认值: `'hex'`

指哈希函数应该使用的 [摘要](https://en.wikipedia.org/wiki/Cryptographic_hash_function)。
有效值包括：base26、base32、base36、
base49、base52、base58、base62、base64 和 hex。

#### `hashType`

类型: `String`
默认值: `'md4'`

has函数应使用的哈希类型。有效值包括：`md4`、`md5`、`sha1`、`sha256` 和 `sha512`。

#### `length`

类型: `Number`
默认值: `undefined`

用户可以为计算出的哈希指定一个长度。

### `[N]`

类型: `String`
默认值: `undefined`

通过将当前文件名与 `regExp` 匹配而获得的第n个匹配项。

## Examples

### Names

下面的示例演示了如何使用 `file loader` 以及结果。

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'dirname/[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

结果:

```bash
# 结果
dirname/0dcbbaa701328ae351f.png
```

---

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

结果:

```bash
# 结果
gdyb21L.png
```

---

**file.js**

```js
import png from './path/to/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[contenthash]',
            },
          },
        ],
      },
    ],
  },
};
```

结果:

```bash
# 结果
path/to/file.png?e43b20c069c4a01867c31e98cbce33c9
```

### CDN

下面的示例演示如何对CDN 使用查询参数时使用 `file loader`。

**file.js**

```js
import png from './directory/image.png?width=300&height=300';
```

**webpack.config.js**

```js
module.exports = {
  output: {
    publicPath: 'https://cdn.example.com/',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext][query]',
            },
          },
        ],
      },
    ],
  },
};
```

结果:

```bash
# 结果
https://cdn.example.com/directory/image.png?width=300&height=300
```

### 动态公共路径取决于运行时的环境变量

应用程序可能需要根据仅在运行应用程序时可用的环境变量配置不同的CDN主机。
这可能是一个优势，因为只需要构建一个应用程序，它的行为因部署环境的环境变量而异。
由于文件加载器是在编译应用程序时应用的，而不是在运行应用程序时应用的，因此不能在文件加载程序配置中使用环境变量。
解决此问题的一种方法是根据应用程序入口点的环境变量，将 `__webpack_public_path__` 设置为所需的CDN主机。
选项 `postTransformPublicPath` 可用于配置自定义路径，具体取决于
 `__webpack_public_path__` 等变量。

**main.js**

```js
const assetPrefixForNamespace = (namespace) => {
  switch (namespace) {
    case 'prod':
      return 'https://cache.myserver.net/web';
    case 'uat':
      return 'https://cache-uat.myserver.net/web';
    case 'st':
      return 'https://cache-st.myserver.net/web';
    case 'dev':
      return 'https://cache-dev.myserver.net/web';
    default:
      return '';
  }
};
const namespace = process.env.NAMESPACE;

__webpack_public_path__ = `${assetPrefixForNamespace(namespace)}/`;
```

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'static/assets/',
          publicPath: 'static/assets/',
          postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
        },
      },
    ],
  },
};
```

环境变量为 `NAMESPACE=prod` 时的运行结果：

```bash
# 结果
https://cache.myserver.net/web/static/assets/image.somehash.png
```

环境变量为 `NAMESPACE=dev` 时的运行结果：

```bash
# 结果
https://cache-dev.myserver.net/web/static/assets/image.somehash.png
```

## 贡献

如果您还没有阅读我们的贡献指南，请花点时间阅读。

[CONTRIBUTING](https://github.com/webpack-contrib/file-loader/blob/master/.github/CONTRIBUTING.md)

## 协议

[MIT](https://github.com/webpack-contrib/file-loader/blob/master/LICENSE)

[npm]: https://img.shields.io/npm/v/file-loader.svg
[npm-url]: https://npmjs.com/package/file-loader
[node]: https://img.shields.io/node/v/file-loader.svg
[node-url]: https://nodejs.org/
[deps]: https://david-dm.org/webpack-contrib/file-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/file-loader
[tests]: https://github.com/webpack-contrib/file-loader/workflows/file-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/file-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/file-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/file-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=file-loader
[size-url]: https://packagephobia.now.sh/result?p=file-loader
