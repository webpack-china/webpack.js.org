---
title: Module Federation
sort: 8
contributors:
  - sokra
  - chenxsan
  - EugeneHlushko
  - jamesgeorge007
  - ScriptedAlchemy
related:
  - title: 'Webpack 5 Module Federation: A game-changer in JavaScript architecture'
    url: https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669
  - title: 'Explanations and Examples'
    url: https://github.com/module-federation/module-federation-examples
  - title: 'Module Federation YouTube Playlist'
    url: https://www.youtube.com/playlist?list=PLWSiF9YHHK-DqsFHGYbeAMwbd9xcZbEWJ
---

## 动机

多个独立的构建可以组成一个应用程序，这些独立的构建之间不应该存在依赖关系，因此可以单独开发和部署它们。

这通常被称作微前端，但并不仅限于此。

## 底层概念

我们区分本地模块和远程模块。本地模块是常规模块，是当前构建的一部分。远程模块不属于当前构建，并在运行时从所谓的容器(指 remoteEntry.js )加载。

加载远程模块被认为是异步操作。当使用远程模块时，这些异步操作将被放置在远程模块和入口点之间的下一个代码块的加载中。如果没有代码块加载操作，就不可能使用远程模块。

一个代码块加载操作通常是通过 `import()` 调用，也支持像 `require.ensure` 或 `require([...])` 这样的旧语法。

容器是通过一个容器入口创建的，该入口暴露对特定模块的异步访问。暴露的访问分为两个步骤:

1. 加载模块（异步的）
1. 执行模块（同步的）

步骤 1 将在代码块加载期间完成。步骤 2 将在与其他（本地和远程）的模块交错的执行期间完成。这样，执行顺序不受模块从本地转换为远程或反过来转换的影响。

容器可以嵌套使用，容器可以使用来自其他容器的模块。容器之间也可以循环依赖。

### 重写(**Overriding**)

容器能够将选定的本地模块标记为“可重写”。容器的使用者能够提供“重写”，即替换容器的一个“可重写模块”的模块。当使用者提供重写模块时，容器的所有模块将使用替换模块而不是本地模块。当使用者不提供替换模块时，容器的所有模块将使用本地模块。

容器将以一种方式管理可重写的模块：当它们被使用者重写时，不需要下载它们。这通常是通过将它们放在单独的代码块中来实现的。

另一方面，替换模块的提供者，将只提供异步加载函数。它允许容器仅在需要替换模块时才去加载。提供者将以一种方式管理替换模块，当容器不请求替换模块时，它们根本不需要下载。这通常是通过将它们放在单独的代码块中来实现的。

"name" 用于标识容器中可重写的模块。

重写(Overrides)的提供和容器暴露模块类似，它分为两个步骤:

1. 加载（异步）
1. 执行（同步）

W> 当使用嵌套时，为一个容器提供重写将自动覆盖嵌套容器中具有相同 "name" 的模块。

必须在容器的模块加载之前提供重写。在初始块中使用的重写只能被不使用 Promise 的同步模块重写。一旦执行，就不可再次被重写。

## 高级概念

每个构建都充当一个容器，也使用其他构建作为容器。通过这种方式，每个构建都能够通过从对应容器中加载其他暴露出来的模块来访问它。

共享模块是可重写并作为对嵌套容器的重写提供的模块。它们通常指向每个构建中的相同模块，例如相同的库。

packageName 选项允许通过设置包名来查找所需的版本。默认情况下，它会自动推断模块请求，当想禁用自动推断时，请将 requiredVersion 设置为 false 。

## 构建块

### `OverridablesPlugin` (底层 API)

这个插件使得特定模块“可重写”。一个本地 API ( `__webpack_override__` ) 允许提供重写。

__webpack.config.js__

```javascript
const OverridablesPlugin = require('webpack/lib/container/OverridablesPlugin');
module.exports = {
  plugins: [
    new OverridablesPlugin([
      {
        // 通过 OverridablesPlugin 定义一个可重写的模块
        test1: './src/test1.js',
      },
    ]),
  ],
};
```

__src/index.js__

```javascript
__webpack_override__({
  // 这里我们重写 test1 模块
  test1: () => 'I will override test1 module under src',
});
```

### `ContainerPlugin` (底层 API)

这个插件使用指定的公开模块创建一个额外的容器入口。它还在内部使用 OverridablesPlugin，并向容器的使用者暴露 `override`  API。

### `ContainerReferencePlugin` (底层 API)

这个插件将特定的引用添加到外部容器中，并允许从这些容器中导入远程模块。它还调用这些容器的 `override` API 来为它们提供重写。本地的重写(通过 `__webpack_override__` 或 `override` API 时，构建也是一个容器)和指定的重写被提供给所有引用的容器。

### `ModuleFederationPlugin` （高级 API）

这个插件组合了 `ContainerPlugin` 和 `ContainerReferencePlugin` 。覆盖(overrides)和覆盖(overridables)合并到指定共享模块的单个列表中。

## 概念目标

- 它应该可以暴露和使用 webpack 支持的任何模块类型
- 代码块加载应该并行加载所需的所有内容(web:到服务器的单次往返)
- 从使用者到容器的控制
   - 重写模块是一种单向操作
   - 同级容器不能重写彼此的模块。
- 概念应该是独立于环境的
   - 可用于 web、Node.js 等
- 共享中的相对和绝对请求
   - 会一直提供，即使不使用
   - 会将相对路径解析到 `config.context` 
   - 默认不会使用 `requiredVersion` 
- 共享中的模块请求
   - 只在使用时提供
   - 会匹配构建中所有使用的相等模块请求
   - 将提供所有匹配模块
   - 将从图中这个位置的 package.json 提取 `requiredVersion` 
   - 当你有嵌套的 node_modules 时，可以提供和使用多个不同的版本
- 共享中尾部带有 `/` 的模块请求将匹配所有具有这个前缀的模块请求

## 用例

### 每个页面单独构建

单页应用的每个页面都是在单独的构建中从容器暴露出来的。主体应用程序(application shell)也是独立构建，会将所有页面作为远程模块来引用。通过这种方式，可以单独部署每个页面。在更新路由或添加新路由时部署主体应用程序。主体应用程序将常用库定义为共享模块，以避免在页面构建中出现重复。

### 将组件库作为容器

许多应用程序共享一个通用的组件库，可以将其构建成暴露所有组件的容器。每个应用程序使用来自组件库容器的组件。可以单独部署对组件库的更改，而不需要重新部署所有应用程序。应用程序自动使用组件库的最新版本。

### 动态远程容器

该容器接口支持 `get` 和 `init` 方法。
`init` 是一个异步兼容的方法，调用它时只有一个参数：共享作用域对象(shared scope object)。此对象在远程容器中用作共享作用域，并由主机提供的模块填充。
可以利用它在运行时动态地将远程容器连接到主机容器。

__init.js__

```javascript
(async () => {
  // 初始化共享作用域（shared scope）用提供的已知此构建和所有远程的模块填充它
  await __webpack_init_sharing__('default');
  const container = window.someContainer; // 或从其他地方获取容器
  // 初始化容器 它可能提供共享模块
  await container.init(__webpack_share_scopes__.default);
  const module = await container.get('./module');
})();
```

容器尝试提供共享模块，但是如果共享模块已经被使用，警告和提供的共享模块将被忽略。容器可能仍然使用它作为回退。

通过这种方式，您可以动态加载提供共享模块的不同版本的 A/B 测试。

T> 在尝试动态连接远程容器之前，确保已加载容器。

例子：

__init.js__

```javascript
function loadComponent(scope, module) {
  return async () => {
    // 初始化共享作用域（shared scope）用提供的已知此构建和所有远程的模块填充它
    await __webpack_init_sharing__('default');
    const container = window[scope]; // 或从其他地方获取容器
    // 初始化容器 它可能提供共享模块
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

loadComponent('abtests', 'test123');
```

[查看完整实现](https://github.com/module-federation/module-federation-examples/tree/master/advanced-api/dynamic-remotes)

## 故障排除

__`Uncaught Error: Shared module is not available for eager consumption`__

应用程序正在急切地执行一个作为全向主机运行的应用程序。有选项可供选择:

您可以在模块联合的高级 API 中将依赖设置为即时依赖，该API不会将模块放在异步块中，而是同步地提供它们。这允许我们在初始块中使用这些共享模块。但是要小心，因为所有提供的和后备模块总是要下载的。建议只在应用程序的某个地方提供它，例如 shell。

我们强烈建议使用异步边界(asynchronous boundary)。它将把初始化代码分割成更大的块，以避免任何额外的往返，并在总体上提高性能。

例如，你的入口看起来是这样的：

__index.js__

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
```

让我们创建 bootstrap.js 文件，并将入口文件的内容放到里面，然后将 bootstrap 引入到入口文件中:

__index.js__

```diff
+ import('./bootstrap');
- import React from 'react';
- import ReactDOM from 'react-dom';
- import App from './App';
- ReactDOM.render(<App />, document.getElementById('root'));
```

__bootstrap.js__

```diff
+ import React from 'react';
+ import ReactDOM from 'react-dom';
+ import App from './App';
+ ReactDOM.render(<App />, document.getElementById('root'));
```

这种方法有效，但可能会有局限性或缺点。

通过 `ModuleFederationPlugin` 将依赖的 `eager` 属性设置为 `true` 

__webpack.config.js__

```javascript
// ...
new ModuleFederationPlugin({
  shared: {
    ...deps,
    react: {
      eager: true,
    }
  }
});
```

__`Uncaught Error: Module "./Button" does not exist in container.`__

报错可能不会显示 `"./Button"` ，但是错误信息看起来差不多。这个问题通常会出现在将 webpack beta.16 升级到 webpack beta.17 中。

在 ModuleFederationPlugin 里，更改 exposes:

```diff
new ModuleFederationPlugin({
  exposes: {
-   'Button': './src/Button'
+   './Button':'./src/Button'
  }
});
```

__`Uncaught TypeError: fn is not a function`__

你可能丢失了远程容器，请确保添加了它。
如果已为试图使用的远程服务器加载了容器，但仍然看到此错误，则将主机容器的远程容器文件也添加到 HTML 中。
