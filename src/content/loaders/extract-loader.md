---
title: extract-loader
source: https://raw.githubusercontent.com/peerigon/extract-loader/master/README.md
edit: https://github.com/peerigon/extract-loader/edit/master/README.md
repo: https://github.com/peerigon/extract-loader
---
**用于从 bundle 中提取 HTML 和 CSS**

[![](https://img.shields.io/npm/v/extract-loader.svg)](https://www.npmjs.com/package/extract-loader)
[![](https://img.shields.io/npm/dm/extract-loader.svg)](https://www.npmjs.com/package/extract-loader)
[![Dependency Status](https://david-dm.org/peerigon/extract-loader.svg)](https://david-dm.org/peerigon/extract-loader)
[![Build Status](https://travis-ci.org/peerigon/extract-loader.svg?branch=master)](https://travis-ci.org/peerigon/extract-loader)
[![Coverage Status](https://img.shields.io/coveralls/peerigon/extract-loader.svg)](https://coveralls.io/r/peerigon/extract-loader?branch=master)

extract-loader 可以动态地评估给定的源代码，并以字符串形式返回结果。主要作用是解析 HTML 和 CSS 中来自各自 loader 的 urls.  使用 [file-loader](/loaders/file-loader/) 将 extract-loader 的结果以单独文件发出。
```javascript
import stylesheetUrl from "file-loader!extract-loader!css-loader!main.css";
// stylesheetUrl will now be the hashed url to the final stylesheet
```
extract-loader 的工作原理与 [extract-text-webpack-plugin](/plugins/extract-text-webpack-plugin/) 类似，然而 extract-loader 更加简洁。在评估源代码时，它提供了一个伪造的上下文，该上下文专门用于处理由 [html-loader](/loaders/html-loader/) 或 [css-loader](/loaders/css-loader/) 生成的代码。因此，其他情况下可能不起作用。

<br>

安装
------------------------------------------------------------------------

`npm install extract-loader`

<br>

示例
------------------------------------------------------------------------


将 CSS 与 webpack 捆绑在一起好处多多，如在开发环境中使用哈希 url 或 [hot module replacement](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html) 引用图像和字体。另一方面，在生产环境中，根据 JS 的执行情况应用样式表并非最佳选择。因为渲染可能会延迟，甚至导致 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) -- Flash of unstyled content (文档样式短暂失效)。因此，在最终的生产构建中，最好将它们作为单独的文件保存。

使用 extract-loader,  可以将 `main.css` 作为常规的 `entry` 引用。下面的 `webpack.config.js` 演示了在开发环境中如何使用 [style-loader](/loaders/style-loader/) 加载样式，以及在生产环境中如何使用单独的文件加载样式。

```javascript
const live = process.env.NODE_ENV === "production";
const mainCss = ["css-loader", path.join(__dirname, "app", "main.css")];

if (live) {
    mainCss.unshift("file-loader?name=[name].[ext]", "extract-loader");
} else {
    mainCss.unshift("style-loader");
}

module.exports = {
    entry: [
        path.join(__dirname, "app", "main.js"),
        mainCss.join("!")
    ],
    ...
};
```

### [提取 index.html](https://github.com/peerigon/extract-loader/tree/master/examples/index-html)

也可以将 `index.html` 添加为 `entry`,  并从中引用样式表。只需为 html-loader 添加选项配置 `link:href`:

```javascript
const indexHtml = path.join(__dirname, "app", "index.html");

module.exports = {
    entry: [
        path.join(__dirname, "app", "main.js"),
        indexHtml
    ],
    ...
    module: {
        rules: [
            {
                test: indexHtml,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name]-dist.[ext]",
                        },
                    },
                    {
                        loader: "extract-loader",
                    },
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ["img:src", "link:href"],
                            interpolate: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                loaders: [
                    {
                        loader: "file-loader",
                    },
                    {
                        loader: "extract-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.jpg$/,
                loaders: [
                    {
                        loader: "file-loader"
                    },
                ],
            },
        ]
    }
};
```

这样操作，可以将如下代码

```html
<html>
<head>
    <link href="main.css" type="text/css" rel="stylesheet">
</head>
<body>
    <img src="hi.jpg">
</body>
</html>
```

转换为：

```html
<html>
<head>
    <link href="7c57758b88216530ef48069c2a4c685a.css" type="text/css" rel="stylesheet">
</head>
<body>
    <img src="6ac05174ae9b62257ff3aa8be43cf828.jpg">
</body>
</html>
```

<br>

选项
------------------------------------------------------------------------
选项目前只有一个: `publicPath`.  如果在 webpack 的 [output options](http://webpack.github.io/docs/configuration.html#output-publicpath) 中使用的是相对 `publicPath`,  并且是使用 `file-loader` 提取到文件，则可能需要使用该选项来说明提取文件的位置。

Example:

```js
module.exports = {
    output: {
        path: path.resolve("./dist"),
        publicPath: "dist/"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/[name].[ext]",
                        },
                    },
                    {
                        loader: "extract-loader",
                        options: {
                            publicPath: "../",
                        }
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            }
        ]
    }
};
```

对于选项，如果您有其他好的想法，请按如下操作：

<br>

贡献投稿
------------------------------------------------------------------------

提交 bug 报告，创建一个 pr 请求，无论以何种形式，我们都**无任欢迎并感谢所有贡献投稿**。如果您计划实现新功能或更改 API，请先创建一个问题，以便我们确认你的宝贵工作不会白费。

请确保所有的 pr 请求有 100% 的测试覆盖率（包含明显异常），并且需要通过所有测试。

- Call `npm test` to run the unit tests
- Call `npm run coverage` to check the test coverage (using [istanbul](https://github.com/gotwarlost/istanbul))

<br>

License
------------------------------------------------------------------------

Unlicense

赞助者
------------------------------------------------------------------------

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com)
