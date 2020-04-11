---
title: 模块(module)
sort: 6
contributors:
  - TheLarkInn
  - simon04
  - rouzbeh84
  - EugeneHlushko
  - byzyk
related:
   - title: JavaScript Module Systems Showdown
     url: https://auth0.com/blog/javascript-module-systems-showdown/
---

在 [模块化编程](https://en.wikipedia.org/wiki/Modular_programming) 中，开发者将程序分解为功能离散的 chunk(discrete chunks of functionality)，并称之为_模块_。

每个模块具有比完整程序更小的接触面，使得验证、调试、测试轻而易举。
精心编写的_模块_提供了可靠的抽象和封装界限，使得应用程序中每个模块，都具备了条理清楚的设计和明确的目的。

Node.js 从最一开始就支持模块化编程。
然而，web 的_模块化_支持正缓慢到来。
在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。
webpack 基于从这些系统获得的经验教训，并将_模块_的概念应用于项目中的任何文件。

## 什么是 webpack 模块

与 [Node.js 模块](https://nodejs.org/api/modules.html) 相比，webpack _模块_能够以各种方式表达它们的依赖关系。下面是一些示例：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()` 语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define` 和 `require` 语句
- css/sass/less 文件中的 [`@import` 语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- 样式(`url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接

T> webpack 1 需要特定的 loader 来转换 ES2015 `import`。然而在 webpack 2 中，这一切都是开箱即用的。

## 支持的模块类型

通过 _loader_，webpack 可以支持以各种语言和预处理器语法编写的模块。_loader_ 描述了 webpack __如何__处理 非 JavaScript _模块_，并且在 _bundle_ 中引入这些_依赖_。
webpack 社区已经为各种流行语言和语言处理器创建了 _loader_，包括：

- [CoffeeScript](http://coffeescript.org)
- [TypeScript](https://www.typescriptlang.org)
- [ESNext (Babel)](https://babel.docschina.org/)
- [Sass](http://sass-lang.com)
- [Less](http://lesscss.org)
- [Stylus](http://stylus-lang.com)

其实还有很多！总的来说，webpack 提供了可定制的、强大和丰富的 API，允许在__任何技术栈__中使用 webpack，同时在开发、测试和生产环境下的工作流程中做到__无侵入性__。

有关完整列表，请参考 [__loader 列表__](/loaders) 或 [__编写你自己的 loader__](/api/loaders)。
