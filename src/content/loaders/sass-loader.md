---
title: sass-loader
source: https://raw.githubusercontent.com/webpack-contrib/sass-loader/master/README.md
edit: https://github.com/webpack-contrib/sass-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/sass-loader
---
Loads a Sass/SCSS file and compiles it to CSS.

Use the [css-loader](/loaders/css-loader/) or the [raw-loader](/loaders/raw-loader/) to turn it into a JS module and the [mini-css-extract-plugin](/plugins/mini-css-extract-plugin/) to extract it into a separate file.
Looking for the webpack 1 loader? Check out the [archive/webpack-1 branch](https://github.com/webpack-contrib/sass-loader/tree/archive/webpack-1).

## 安装

```bash
npm install sass-loader node-sass webpack --save-dev
```

[webpack](https://github.com/webpack) 是 sass-loader 的 [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies)，
并且还需要你预先安装
[Node Sass](https://github.com/sass/node-sass) 或 [Dart Sass](https://github.com/sass/dart-sass)。
这可以控制所有依赖的版本，
并选择要使用的 Sass 实现。

[Node Sass]：https://github.com/sass/node-sass
[Dart Sass]：http://sass-lang.com/dart-sass

## 示例

通过将 [style-loader](https://github.com/webpack-contrib/style-loader) 和 [css-loader](https://github.com/webpack-contrib/css-loader) 与 sass-loader 链式调用，可以立刻将样式作用在 DOM 元素。

```bash
npm install style-loader css-loader --save-dev
```

```js
// webpack.config.js
module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // 将 JS 字符串生成为 style 节点
                "css-loader", // 将 CSS 转化成 CommonJS 模块
                "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
            ]
        }]
    }
};
```

也可以直接将选项传递给 [Node Sass][] 或 [Dart Sass][]：

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader",
        options: {
          includePaths: ["absolute/path/a", "absolute/path/b"]
        }
      }]
    }]
  }
};
```

更多 Sass 可用选项，查看 [Node Sass 文档](https://github.com/sass/node-sass/blob/master/README.md#options) for all available Sass options.

By default the loader resolve the implementation based on your dependencies.
Just add required implementation to `package.json`
(`node-sass` or `sass` package) and install dependencies.

Example where the `sass-loader` loader uses the `sass` (`dart-sass`) implementation:

**package.json**

```json
{
   "devDependencies": {
      "sass-loader": "*",
      "sass": "*"
   }
}
```

Example where the `sass-loader` loader uses the `node-sass` implementation:

**package.json**

```json
{
   "devDependencies": {
      "sass-loader": "*",
      "node-sass": "*"
   }
}
```

Beware the situation
when `node-sass` and `sass` was installed, by default the `sass-loader`
prefers `node-sass`, to avoid this situation use the `implementation` option.

The special `implementation` option determines which implementation of Sass to
use. It takes either a [Node Sass][] or a [Dart Sass][] module. For example, to
use Dart Sass, you'd pass:

```js
// ...
    {
        loader: "sass-loader",
        options: {
            implementation: require("sass")
        }
    }
// ...
```

Note that when using Dart Sass, **synchronous compilation is twice as fast as
asynchronous compilation** by default, due to the overhead of asynchronous
callbacks. To avoid this overhead, you can use the
[`fibers`](https://www.npmjs.com/package/fibers) package to call asynchronous
importers from the synchronous code path. To enable this, pass the `Fiber` class
to the `fiber` option:

```js
// webpack.config.js
const Fiber = require('fibers');

module.exports = {
    ...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    implementation: require("sass"),
                    fiber: Fiber
                }
            }]
        }]
    }
};
```

##

通常，生产环境下比较推荐的做法是，使用 [mini-css-extract-plugin](/plugins/mini-css-extract-plugin/) 将样式表抽离成专门的单独文件。这样，样式表将不再依赖于 JavaScript：

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                // fallback to style-loader in development
                process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
```

## 用法

### 导入(import)

webpack 提供一种[解析文件的高级的机制](https://webpack.js.org/concepts/module-resolution/)。sass-loader 使用 Sass 的 custom importer 特性，将所有的 query 传递给 webpack 的解析引擎(resolving engine)。只要它们前面加上 `~`，告诉 webpack 它不是一个相对路径，这样就可以 import 导入 `node_modules` 目录里面的 sass 模块：

```css
@import "~bootstrap/dist/css/bootstrap";
```

重要的是，只在前面加上 `~`，因为 `~/` 会解析到主目录(home directory)。webpack 需要区分 `bootstrap` 和 `~bootstrap`，因为 CSS 和 Sass 文件没有用于导入相关文件的特殊语法。`@import "file"` 与 `@import "./file";` 这两种写法是相同的

### `url(...)` 的问题

由于 Sass/[libsass](https://github.com/sass/libsass) 并没有提供[url rewriting](https://github.com/sass/libsass/issues/532) 的功能，所以所有的链接资源都是相对输出文件(output)而言。

- 如果生成的 CSS 没有传递给 css-loader，它相对于网站的根目录。
- 如果生成的 CSS 传递给了 css-loader，则所有的 url 都相对于入口文件（例如：`main.scss`）。

第二种情况可能会带来一些问题。正常情况下我们期望相对路径的引用是相对于 `.scss` 去解析（如同在 `.css` 文件一样）。幸运的是，有2个方法可以解决这个问题：

- 将 [resolve-url-loader](https://github.com/bholloway/resolve-url-loader) 设置于 loader 链中的 sass-loader 之前，就可以重写 url。
- Library 作者一般都会提供变量，用来设置资源路径，如 [bootstrap-sass](https://github.com/twbs/bootstrap-sass) 可以通过 `$icon-font-path` 来设置。参见[this working bootstrap example](https://github.com/webpack-contrib/sass-loader/tree/master/test/bootstrapSass)。

### 提取样式表

使用 webpack 打包 CSS 有许多优点，在开发环境，可以通过 hashed urls 或 [模块热替换(HMR)](https://webpack.js.org/concepts/hot-module-replacement/) 引用图片和字体资源。而在线上环境，使样式依赖 JS 执行环境并不是一个好的实践。渲染会被推迟，甚至会出现 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)，因此在最终线上环境构建时，最好还是能够将 CSS 放在单独的文件中。

从 bundle 中提取样式表，有2种可用的方法：

- [extract-loader](https://github.com/peerigon/extract-loader) （简单，专门针对 css-loader 的输出）
- [mini-css-extract-plugin](/plugins/mini-css-extract-plugin/) (use this, when using webpack 4 configuration. Works in all use-cases)

### Source maps

要启用 CSS source map，需要将 `sourceMap` 选项作为参数，传递给 *sass-loader* 和 *css-loader*。此时`webpack.config.js` 如下：

```javascript
module.exports = {
    ...
    devtool: "source-map", // any "source-map"-like devtool is possible
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader", options: {
                    sourceMap: true
                }
            }]
        }]
    }
};
```

如果你要在 Chrome 中编辑原始的 Sass 文件，建议阅读[这篇不错的博客文章](https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0)。具体示例参考 [test/sourceMap](https://github.com/webpack-contrib/sass-loader/tree/master/test)。

### 环境变量

如果你要将 Sass 代码放在实际的入口文件(entry file)之前，可以设置 `data` 选项。此时 sass-loader 不会覆盖 `data` 选项，只会将它拼接在入口文件的内容之前。当 Sass 变量依赖于环境时，这一点尤其有用。

```javascript
{
    loader: "sass-loader",
    options: {
        data: "$env: " + process.env.NODE_ENV + ";"
    }
}
```

The `data` option supports `Function` notation:

```javascript
{
    loader: "sass-loader",
    options: {
        data: (loaderContext) => {
          // More information about avalaible options https://webpack.js.org/api/loaders/
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext,resourcePath);

          if (relativePath === "styles/foo.scss") {
             return "$value: 100px;"
          }

          return "$value: 200px;"
        }
    }
}
```

**注意：**由于代码注入, 会破坏整个入口文件的 source map。通常一个简单的解决方案是，多个 Sass 文件入口。

## 维护人员

<table>
    <tr>
      <td align="center">
        <a href="https://github.com/jhnns"><img width="150" height="150" src="https://avatars0.githubusercontent.com/u/781746?v=3"></a><br>
        <a href="https://github.com/jhnns">Johannes Ewald</a>
      </td>
      <td align="center">
        <a href="https://github.com/webpack-contrib"><img width="150" height="150" src="https://avatars1.githubusercontent.com/u/1243901?v=3&s=460"></a><br>
        <a href="https://github.com/webpack-contrib">Jorik Tangelder</a>
      </td>
      <td align="center">
        <a href="https://github.com/akiran"><img width="150" height="150" src="https://avatars1.githubusercontent.com/u/3403295?v=3"></a><br>
        <a href="https://github.com/akiran">Kiran</a>
      </td>
    <tr>
</table>


## License

[MIT](http://www.opensource.org/licenses/mit-license.php)

[npm]: https://img.shields.io/npm/v/sass-loader.svg
[npm-stats]: https://img.shields.io/npm/dm/sass-loader.svg
[npm-url]: https://npmjs.com/package/sass-loader

[node]: https://img.shields.io/node/v/sass-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/sass-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/sass-loader

[travis]: http://img.shields.io/travis/webpack-contrib/sass-loader.svg
[travis-url]: https://travis-ci.org/webpack-contrib/sass-loader

[appveyor-url]: https://ci.appveyor.com/project/webpack-contrib/sass-loader/branch/master
[appveyor]: https://ci.appveyor.com/api/projects/status/rqpy1vaovh20ttxs/branch/master?svg=true

[cover]: https://codecov.io/gh/webpack-contrib/sass-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/sass-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
