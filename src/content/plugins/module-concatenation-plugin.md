---
title: ModuleConcatenationPlugin
contributors:
  - skipjack
  - TheLarkInn
related:
  - webpack 3: Official Release!!
---


过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些功能包使你的 Javascript 在浏览器中处理的更慢。相比之下，一些工具像闭包解析器 ( Closure Compiler ) 和 RollupJs 可以吊起 ( hoist ) 或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。


这个插件会在 webpack 中实现以上的预编译功能

``` js
new webpack.optimize.ModuleConcatenationPlugin()
```

> Scope Hoisting 是 ECMAScrip 模块语法的特性，此特性让 webpack 仅打包你用得到的模型到 bundle 中 和 [其他的情况 ](https://medium.com/webpack/webpack-freelancing-log-book-week-5-7-4764be3266f5).
