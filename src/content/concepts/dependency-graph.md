---
title: 依赖图(dependency graph)
sort: 8
contributors:
  - TheLarkInn
  - EugeneHlushko
related:
  - title: HTTP2 Aggressive Splitting Example
    url: https://github.com/webpack/webpack/tree/master/examples/http2-aggressive-splitting
  - title: webpack & HTTP/2
    url: https://medium.com/webpack/webpack-http-2-7083ec3f3ce6
---

任何时候，一个文件依赖于另一个文件，webpack 就把此视为文件之间有 _依赖关系_。这使得 webpack 可以接收非代码资源(non-code asset)（例如 images 或 web fonts），并且可以把它们作为 _依赖_ 提供给你的应用程序。

webpack 从命令行或配置文件中定义的一个模块列表开始，处理你的应用程序。
从这些 [_入口起点_](/concepts/entry-points/) 开始，webpack 递归地构建一个_依赖图_，这个依赖图包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的 _bundle_ - 通常只有一个 - 可由浏览器加载。

T> 对于 _HTTP/1.1_ 客户端，由 webpack 打包你的应用程序会极其强大，这是因为在浏览器发起一个新请求时，它能够减少应用程序必须等待的时间。对于 _HTTP/2_，你还可以使用 [代码分离](/guides/code-splitting/) 来实现最佳构建结果。
