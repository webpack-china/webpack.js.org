---
title: Loaders
sort: -1
contributors:
  - simon04
  - bajras
  - rhys-vdw
  - EugeneHlushko
  - hemal7735
  - snitin315
  - anshumanv
---

Webpack 支持使用 [加载器 (loaders)](/concepts/loaders) 来对文件进行预处理。这让你可以打包包括 JavaScript 在内的任何静态资源。你可以使用 Node.js 轻松编写自己的加载器。

通过在 `required()` 语句中使用 `loadername!` 的方式来使用加载器，或者在 Webpack 配置中配置 regex 来自动应用它们 - 请参阅 [配置](/concepts/loaders/#configuration) 。


## 文件 {#files}

- [`raw-loader`](/loaders/raw-loader) 加载文件的原始内容（utf-8）
- [`val-loader`](/loaders/val-loader) 将代码作为模块执行，并将导出的内容视为 JS 代码
- [`url-loader`](/loaders/url-loader) 与文件加载器 [](/loaders/url-loader)类似，但是如果文件大写小于一个设置的值，则可以返回 [data URL](https://tools.ietf.org/html/rfc2397)
- [`file-loader`](/loaders/file-loader) 将文件复制到输出文件夹中并返回（相对）URL
- [`ref-loader`](https://www.npmjs.com/package/ref-loader) 手动创建任何文件之间的依赖关系


## JSON {#json}

- [`json5-loader`](/loaders/json5-loader) 加载和转换 [JSON 5](https://json5.org/) 文件
- [`cson-loader`](https://github.com/awnist/cson-loader) 加载和转换 [CSON](https://github.com/bevry/cson#what-is-cson) 文件


## 语法转换 {#transpiling}

- [`babel-loader`](/loaders/babel-loader) 使用 [Babel](https://babeljs.io/) 加载 ES2015 + 代码并转换为 ES5
- [`buble-loader`](https://github.com/sairion/buble-loader) 使用 [Bublé](https://buble.surge.sh/guide/) 将 ES2015 + 代码加载并转换为 ES5
- [`traceur-loader`](https://github.com/jupl/traceur-loader) 使用 [Traceur](https://github.com/google/traceur-compiler#readme) 将 ES2015 + 代码加载并转换为 ES5
- [`ts-loader`](https://github.com/TypeStrong/ts-loader) 像加载 Javascript 那样加载 [TypeScript](https://www.typescriptlang.org/) 2.0+
- [`coffee-loader`](/loaders/coffee-loader) 像加载 Javascript 那样加载 [CoffeeScript](http://coffeescript.org/)
- [`fengari-loader`](https://github.com/fengari-lua/fengari-loader/) 使用 [fengari](https://fengari.io/) 加载 Lua 代码
- [`elm-webpack-loader`](https://github.com/elm-community/elm-webpack-loader) 像加载 Javascript 那样加载 [Elm](https://elm-lang.org/)


## 模板 {#templating}

- [`html-loader`](/loaders/html-loader) 将 HTML 导出为字符串，需要传入静态资源的引用路径
- [`pug-loader`](https://github.com/pugjs/pug-loader) 加载 Pug 和 Jade 模板并返回一个函数
- [`markdown-loader`](https://github.com/peerigon/markdown-loader) 将 Markdown 编译为 HTML
- [`react-markdown-loader`](https://github.com/javiercf/react-markdown-loader) 使用 markdown-parse 解析器将 Markdown 编译为 React 组件
- [`posthtml-loader`](https://github.com/posthtml/posthtml-loader) 使用 [PostHTML](https://github.com/posthtml/posthtml) 加载和转换 HTML 文件
- [`handlebars-loader`](https://github.com/pcardune/handlebars-loader) 将 Handlebars 文件编译为 HTML
- [`markup-inline-loader`](https://github.com/asnowwolf/markup-inline-loader) 将 SVG / MathML 文件内嵌到 HTML 中。在将图标字体或 CSS 动画应用于 SVG 时，此功能很有用。
- [`twig-loader`](https://github.com/zimmo-be/twig-loader) 编译 Twig 模板并返回一个函数
- [`remark-loader`](https://github.com/webpack-contrib/remark-loader) 通过 `remark` 加载 markdown，支持解析内容中的图片


## 样式 {#styling}

- [`style-loader`](/loaders/style-loader) 将模块的导出内容作为样式添加到 DOM
- [`css-loader`](/loaders/css-loader) 使用已解析的导入加载 CSS 文件并返回 CSS 代码
- [`less-loader`](/loaders/less-loader) 加载并编译 LESS 文件
- [`sass-loader`](/loaders/sass-loader) 加载并编译 SASS / SCSS 文件
- [`postcss-loader`](/loaders/postcss-loader) 使用 [PostCSS](http://postcss.org) 加载和转换 CSS / SSS 文件
- [`stylus-loader`](https://github.com/shama/stylus-loader) 加载并编译 Stylus 文件


## Linting 和测试 {#linting--test}

- [](https://mochajs.org/)[`mocha-loader`](/loaders/mocha-loader) 使用 [mocha](https://mochajs.org/) (Browser/NodeJS) 进行测试
- [`eslint-loader`](https://github.com/webpack-contrib/eslint-loader) 使用 [ESLint](https://eslint.org/) linting 代码

## 框架 {#frameworks}

- [`vue-loader`](https://github.com/vuejs/vue-loader) 加载和编译 [Vue 组件](https://vuejs.org/v2/guide/components.html)
- [`polymer-loader`](https://github.com/webpack-contrib/polymer-webpack-loader) 使用选择的预处理程序处理 HTML 和 CSS 以及使用 `require()` 以模块的方式处理 Web Components
- [`angular2-template-loader`](https://github.com/TheLarkInn/angular2-template-loader) 加载和编译 [Angular](https://angular.io/) 组件

## Awesome {#awesome}

有关更多第三方加载器，请参阅 [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#loaders) 中的列表。
