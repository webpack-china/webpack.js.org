---
title: 部署目标(target)
sort: 9
contributors:
  - TheLarkInn
  - rouzbeh84
  - johnstew
  - srilman
  - byzyk
  - EugeneHlushko
---

因为服务器和浏览器代码都可以用 JavaScript 编写，所以 webpack 提供了多种部署 _target(目标)_，你可以在你的 webpack [配置对象](/configuration) 中进行设置。

W> webpack 的 `target` 属性，不要和 `output.libraryTarget` 属性混淆。有关 `output` 属性的更多信息，请查看我们的 [指南](/concepts/output/)。

## 用法

想要设置 `target` 属性，只需要在你的 webpack 配置中设置 target 的值。

__webpack.config.js__

```javascript
module.exports = {
  target: 'node'
};
```

在上面例子中，使用 `node`，webpack 会编译为用于类 Node.js 环境（使用 Node.js 的 `require` ，而不是使用任意内置模块（如 `fs` 或 `path`）来加载 chunk）。

每个 _target_ 都有各种部署(deployment)/环境(environment)特定的附加项，以支持满足其需求。查看 [target 可用值](/configuration/target/)。

?> Further expansion for other popular target values

## 多个 target

虽然 webpack __不支持__向 `target` 传入多个字符串，还是可以通过打包两个单独配置，来创建出一个同构的 library：

__webpack.config.js__

```javascript
const path = require('path');
const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

const clientConfig = {
  target: 'web', // <=== 默认是 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

上面的例子将在 `dist` 文件夹下创建 `lib.js` 和 `lib.node.js` 文件。

## 资源

从上面的选项能够看出，可以选择多种不同的部署 _target_。下面是一个示例列表，以及可以参考的资源。

-  __[compare-webpack-target-bundles](https://github.com/TheLarkInn/compare-webpack-target-bundles)__：有关「测试和查看」不同的 webpack _target_ 的大量资源。也有大量 bug 报告。
- __[Boilerplate of Electron-React Application](https://github.com/chentsulin/electron-react-boilerplate)__：一个 electron 主进程和渲染进程构建过程的很好的例子。

?> Need to find up to date examples of these webpack targets being used in live code or boilerplates.
