---
title: 配置(configuration)
sort: 5
contributors:
  - TheLarkInn
  - simon04
  - EugeneHlushko
  - byzyk
---

你可能已经注意到，很少有 webpack 配置看起来完全相同。这是因为 __webpack 的配置文件，是一个导出 webpack [配置对象](/configuration/) 的 JavaScript 文件。__然后 webpack 会根据此配置对象上定义的属性进行处理。

因为 webpack 配置是标准的 Node.js CommonJS 模块，你__可以做到以下事情__：

- 通过 `require(...)` 导入其他文件
- 通过 `require(...)` 使用 npm 的工具函数
- 使用 JavaScript 控制流表达式，例如 `?:` 操作符
- 对常用值使用常量或变量
- 编写和执行函数，来生成部分配置

请在合适的场景下使用这些功能。

虽然技术上可行，__但应避免以下做法__：

- 在使用 webpack 命令行接口(CLI)时，访问命令行接口(CLI)参数（应该编写自己的命令行接口(CLI)，或 [使用 `--env`](/configuration/configuration-types/)）
- 导出不确定的值（调用 webpack 两次应该产生同样的输出文件）
- 编写很长的配置（应该将配置拆分为多个文件）

T> 这份文档中得出的最重要的收获是，你的 webpack 配置可以有许多不同的格式和风格。关键在于，为了便于你和你的团队易于理解和维护这些配置，需要保证一致性。

接下来的例子展示了 webpack 配置(webpack configuration)如何即具有表现力，又具有可配置性，这是因为_配置即是代码_：

## 基本配置

__webpack.config.js__

```javascript
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```

_See_: [Configuration section](/configuration/) for all supported configuration options

## 多个 target

除了可以将单个配置导出为 object, [function](/configuration/configuration-types/#exporting-a-function) 或 [Promise](/configuration/configuration-types/#exporting-a-promise)，还可以将其导出为多个配置。

查看：[导出多个配置](/configuration/configuration-types/#exporting-multiple-configurations)

## 使用其他配置语言

webpack 接受以多种编程和数据语言编写的配置文件。

查看：[配置语言](/configuration/configuration-languages/)
