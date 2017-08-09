---
title: 模块热替换
sort: 6
contributors:
  - jmreidy
  - jhnns
  - sararubin
  - aiduryagin
  - rohannair
  - joshsantos
  - drpicox
  - skipjack
  - sbaidon
  - gdi2290
related:
  - title: 概念 - 模块热替换(Hot Module Replacement)
    url: /concepts/hot-module-replacement
  - title: API - 模块热替换(Hot Module Replacement)
    url: /api/hot-module-replacement
---

T> This guide extends on code examples found in the [Development](/guides/development) guide.

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。本页面重点介绍__实现__，而[概念页面](/concepts/hot-module-replacement)提供了更多关于它的工作原理以及为什么它有用的细节。

W> __HMR__ 不适用于生产环境，这意味着它应当只在开发环境使用。更多详细信息，请查看[生产环境构建指南](/guides/production)。


## 启用 HMR

启用此功能实际上相当简单。所要做的只是修改下[webpack-dev-server](https://doc.webpack-china.org/configuration/dev-server)的设置，并启用webpack内置的HMR插件。之后把入口从`print.js`替换成`index.js`就可以了

__webpack.config.js__

``` diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const webpack = require('webpack');

  module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

你还可以命令行(`webpack-dev-server --hotOnly`)的方式来直接更改[webpack-dev-server](https://doc.webpack-china.org/configuration/dev-server)的设置

修改完之后，用`npm start`来启用更新后的设定吧。

好了，现在来更改下`index.js`的内容，这样当检测到`print.js`内的内容发生改变的时候，webpack就知道要去更新一下模块了。

__index.js__

``` diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
+
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

改一下`pint.js`内`console.log`的内容后，就可以看到浏览器内会出现以下的输出了。

__print.js__

``` diff
  export default function printMe() {
-   console.log('I get called from print.js!');
+   console.log('Updating print.js...')
  }
```

__console__

``` diff
[HMR] Waiting for update signal from WDS...
main.js:4395 [WDS] Hot Module Replacement enabled.
+ 2main.js:4395 [WDS] App updated. Recompiling...
+ main.js:4395 [WDS] App hot update...
+ main.js:4330 [HMR] Checking for updates on the server...
+ main.js:10024 Accepting the updated printMe module!
+ 0.4b8ee77….hot-update.js:10 Updating print.js...
+ main.js:4330 [HMR] Updated modules:
+ main.js:4330 [HMR]  - 20
+ main.js:4330 [HMR] Consider using the NamedModulesPlugin for module names.
```


## 问题

热更新模块在具体的使用当中有时候会比较棘手。拿之前的例子来说，如果你按下了样例网页的按钮后，你会发现console记录的是更新前的`printMe`函数。
这个问题是由于按钮的`onclick`事件绑定的仍然是旧的`printMe`函数。
为了让这个按钮能按照我们期望的那样运行，我们还需要用`module.hot.accept`来让这个按钮绑定到新的`printMe`上去：

__index.js__

``` diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick事件绑定的是原来的printMe函数

    element.appendChild(btn);

    return element;
  }

- document.body.appendChild(component());
+ let element = component(); // 保存element来重新渲染print.js的变化
+ document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
-     printMe();
+     document.body.removeChild(element);
+     element = component(); // 重新渲染组件，之后onclick就会绑定到新的printMe函数上
+     document.body.appendChild(element);
    })
  }
```

这只是一个例子，但还有很多其他人可以轻松地让人犯错的地方。幸运的是，存在很多 loader（其中一些在下面提到），使得模块热替换的过程变得更容易。


## HMR 修改样式表

借助于 `style-loader` 的帮助，CSS 的模块热替换实际上是相当简单的。当更新 CSS 依赖模块时，此 loader 在后台使用 `module.hot.accept` 来修补(patch) `<style>` 标签。

首先用以下的指令加载这两个loader吧

```bash
npm install --save-dev style-loader css-loader
```

之后修改下配置文件来使用这两个loader

__webpack.config.js__

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const webpack = require('webpack');

  module.exports = {
    entry: {
      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: ['style-loader', 'css-loader']
+       }
+     ]
+   },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

热加载样式表，与将其导入模块一样简单：

__project__

``` diff
  webpack-demo
  | - package.json
  | - webpack.config.js
  | - /dist
    | - bundle.js
  | - /src
    | - index.js
    | - print.js
+   | - styles.css
```

__styles.css__

``` css
body {
  background: blue;
}
```

__index.js__

``` diff
  import _ from 'lodash';
  import printMe from './print.js';
+ import './styles.css';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick事件绑定的是原来的printMe函数

    element.appendChild(btn);

    return element;
  }

  let element = component();
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element);
      element = component(); // 重新渲染组件，之后onclick就会绑定到新的printMe函数上
      document.body.appendChild(element);
    })
  }

```

将 `body` 上的样式修改为 `background: red;`，您应该可以立即看到页面的背景颜色随之更改，而无需完全刷新。

__styles.css__

``` diff
  body {
-   background: blue;
+   background: red;
  }
```


## 其他代码和框架

社区还有许多其他 loader 和示例，可以使 HMR 与各种框架和库(library)平滑地进行交互……

- [React Hot Loader](https://github.com/gaearon/react-hot-loader)：实时调整 react 组件。
- [Vue Loader](https://github.com/vuejs/vue-loader)：此 loader 支持用于 vue 组件的 HMR，提供开箱即用体验。
- [Elm Hot Loader](https://github.com/fluxxu/elm-hot-loader)：支持用于 Elm 程序语言的 HMR。
- [Redux HMR](https://survivejs.com/webpack/appendices/hmr-with-react/#configuring-hmr-with-redux)：无需 loader 或插件！只需对 main store 文件进行简单的修改。
- [Angular HMR](https://github.com/AngularClass/angular-hmr)：No loader necessary! A simple change to your main NgModule file is all that's required to have full control over the HMR APIs.没有必要使用 loader！只需对主要的 NgModule 文件进行简单的修改，由 HMR API 完全控制。

T> 如果你知道任何其他 loader 或插件，能够有助于或增强模块热替换(Hot Module Replacement)，请提交一个 pull request 以添加到此列表中！

***

> 原文：https://webpack.js.org/guides/hot-module-replacement/
