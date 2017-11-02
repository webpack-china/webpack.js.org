---
title: Shimming
sort: 13
contributors:
  - pksjce
  - jhnns
  - simon04
  - jeremenichelli
related:
  - title: Reward modern browser users script
    url: https://hackernoon.com/10-things-i-learned-making-the-fastest-site-in-the-world-18a0e1cdf4a7#c665
  - title: useBuiltIns in babel-preset-env
    url: https://github.com/babel/babel-preset-env#usebuiltins
---

webpack编译器可以理解写入的ES2015模块，CommonJS或AMD的模块。然而，一些第三方库可能会期望全局依赖（例如jQuery的$）。这些库可能还会创建需要导出的全局变量。这些“broken modules”使得shimming发挥了作用。

W> __我们不建议使用全局变量！__ Webpack真正的概念是更多的模块化前端开发。这意味着编写完整包含的隔离模块，而不依赖于隐藏的依赖关系（例如全局变量）。所以请仅在必要时去主要做。

_shimming_ 的另一个使用场景就是，如果您希望使用浏览器的[polyfill](https://en.wikipedia.org/wiki/Polyfill)功能来支持更多的用户。在这种情况下，您可能只想将这些Polyfill提供给需要修补的浏览器（即按需加载）。

以下文章将介绍这两种用例。

T>为了简单起见，本指南源于“[Getting Started](/guides/getting-started)”中的示例。请确保您在移动之前熟悉该设置。


## 垫片全局变量

我们从第一个使用shimming的全局变量的用例开始。在我们做任何事情之前，我们再来看看我们的项目：

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
|- /node_modules
```

记得我们在使用 `lodash` ？为了演示目的，我们假设希望在整个应用程序中lodash要作为全局变量。为此我们可以使用`ProvidePlugin`插件。

[`ProvidePlugin`](/plugins/provide-plugin) 使用WebPACK变量的形式使包可以在每个模块编译通过。 如果WebPACK看到变量被使用，它将在最后一个bundle中引入指定的包。下面我们取消 `import` 改用插件的方式来提供 `lodash`:

__src/index.js__

``` diff
- import _ from 'lodash';
-
  function component() {
    var element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       lodash: 'lodash'
+     })
+   ]
  };
```

以上就是对webpack的配置...

> 一旦你引用了一次 `lodash`的实例变量，引入`lodash` 包并且提供给需要他的模块。

如果我们运行 build ，我们将看到同样的输出：

``` bash
TODO: Include output
```
我们还可以使用 `ProvidePlugin` 通过使用路径数组（路径数组机构如下：`[module, child, ...children?]`）来配置模块的单个导出。所以让我们想想一下，如果 `lodash` 的 `join` 被调用的时候，我们只需要输出这一个方法：
 So let's imagine we only wanted to provide the `join` method from `lodash` wherever it's invoked:

__src/index.js__

``` diff
  function component() {
    var element = document.createElement('div');

-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.ProvidePlugin({
-       lodash: 'lodash'
+       join: ['lodash', 'join']
      })
    ]
  };
```

通过 [Tree Shaking](/guides/tree-shaking) `lodash`库的其他部分将被优雅的舍去。


## 局部垫片

一些传统模块依赖于 `window` 对象。更新我们的`index.js`，作为事例：

``` diff
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
+
+   // Assume we are in the context of `window`
+   this.alert('Hmmm, this probably isn\'t a great idea...')

    return element;
  }

  document.body.appendChild(component());
```
现在有一个问题，当模块在CommonJS上下文中执行时，`this` 等于 `module.exports`。在这个事例中我们将使用 [`imports-loader`](/loaders/imports-loader/) 来替换 `this` ：

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window'
+       }
+     ]
+   },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```


## 全局变量的导出

我们通常会创建一个充满了全局变量的库。我们可以在我们的设置中添加一个小模块来演示这个：

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- globals.js
  |- /node_modules
```

__src/globals.js__

``` js
var file = 'blah.txt';
var helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); }
}
```

现在，你可能永远不会在自己的代码中如此操作，但是你可能会遇到要使用一下已过时的库，其中包含与上述相似的代码。在这种情况下，我们可以使用 [`exports-loader`](/loaders/exports-loader/) 将该全局变量像一般模块那样导出。例如，将 `file` 导出为 `file`，`helpers.parse` 导出为 `parse`：

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
-       }
+       },
+       {
+         test: require.resolve('globals.js'),
+         use: 'exports-loader?file,parse=helpers.parse'
+       }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```
现在从我们的入口脚本（即 `src/index.js`）中，`import { file, parse } from './globals.js';` 都应该顺利进行。

## 加载腻子

到目前为止，我们讨论的几乎所有内容都与处理传统包有关。我们继续谈谈我们的第二个话题： __腻子__。

有很多方法来加载腻子. 例如，要包括 [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/)，我们可以简单地：

``` bash
npm i --save babel-polyfill
```
并`import`它，以便将其包含在我们的主包中：

__src/index.js__

``` diff
+ import 'babel-polyfill';
+
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

T>请注意，我们没有将`import`绑定到变量。这是因为腻子只能在其他代码前自行运行。才能允许我们假设某些本机功能存在。

__但是把腻子包括到主包中这种做法并不推荐__，因为这样会让现代浏览器用户下载过多不必要的脚本，降低用户体验。

现在我们删除 `import` 并且添加一个新的腻子 [`whatwg-fetch`](https://github.com/github/fetch) ：

``` bash
npm i --save whatwg-fetch
```

__src/index.js__

``` diff
- import 'babel-polyfill';
-
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- globals.js
+   |- polyfills.js
  |- /node_modules
```

__src/polyfills.js__

```javascript
import 'babel-polyfill';
import 'whatwg-fetch';
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     polyfills: './src/polyfills.js',
+     index: './src/index.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
        },
        {
          test: require.resolve('globals.js'),
          use: 'exports-loader?file,parse=helpers.parse'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```
有了这个，我们可以添加逻辑来有条件地加载我们的新的 `polyfills.bundle.js` 文件。您如何做出这一决定取决于您需要支持的技术和浏览器。我们将做一些简单的测试来确定我们的腻子是否需要：

__dist/index.html__

``` diff
  <html>
    <head>
      <title>Getting Started</title>
+     <script>
+       var modernBrowser = (
+         'fetch' in window &&
+         'assign' in Object
+       );
+
+       if ( !modernBrowser ) {
+         var scriptElement = document.createElement('script');
+
+         scriptElement.async = false;
+         scriptElement.src = '/polyfills.bundle.js';
+         document.head.appendChild(scriptElement);
+       }
+     </script>
    </head>
    <body>
      <script src="index.bundle.js"></script>
    </body>
  </html>
```

Now we can `fetch` some data within our entry script:

__src/index.js__

``` diff
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
+
+ fetch('https://jsonplaceholder.typicode.com/users')
+   .then(response => response.json())
+   .then(json => {
+     console.log('We retrieved some data! AND we\'re confident it will work on a variety of browser distributions.')
+     console.log(json)
+   })
+   .catch(error => console.error('Something went wrong when fetching this data: ', error))
```

如果我们运行build，将会生成一个 `polyfills.bundle.js` 文件，并且浏览器中的所有内容都应该顺利运行。请注意，这种设置可能会得到改善，因为这只是解决如何把腻子只提供给真正需要它们的用户的一种方法。

## 进一步的优化

`babel-preset-env` 包则是通过一个 [browserslist](https://github.com/ai/browserslist)来匹配你浏览器，并且转码你浏览器所不支持的的代码。通过`useBuiltIns` 选项进行预设，默认为 `false`，通过 `import` 的方法导入更细粒度的功能来覆盖你的全局 `babel-polyfill`配置：

``` js
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```
有关详细信息，请参阅[知识库](https://github.com/babel/babel-preset-env)。


## Node的内部插件

Node的内部插件，比如 `process` 能够根据您的配置文件直接打腻子，而无需使用任何特殊的loaders或插件。 查看[node配置页面](/configuration/node)，那里有过多的信息和事例。


## 其它

在处理传统模块时，还有一些其他工具可以帮助您。

[`script-loader`](/loaders/script-loader/)能够评估你的全局上下文的代码。作用类似于一个 `script` 的标签容器。在这种模式下，每个正常的库都应该工作。`require`、`module` 等等未被定义。

W>当使用 `script-loader` 时，将该模块作为字符串添加到捆绑包中。它不会被 `webpack` 最小化，所以请使用最小化的版本。对于这个加载器添加的库，也么有 `devtool` 支持。

当没有AMD/CommonJS版本的模块，并且您想要包括到 `dist` 中去，你可以在 [`noParse`](/configuration/module/#module-noparse) 中标记这个模块。他将告诉webpack引用这个模块不需要匹配或分析 `require()` 和  `import` 语法。这种做法也用于提高构建性能。

W> 任何需要AST的功能， 例如 `ProvidePlugin`，将不再工作。

最后，有一些模块支持不同的 [模块风格](/concepts/modules)，如AMD，CommonJS和传统。在大多数情况下，他们首先检查 `define`，然后使用一些古怪的代码来导出属性。在这种情况下，可以通过 [`imports-loader`](/loaders/imports-loader/) 设置 `define=>false` 来强制导入CommonJS路径。

***

> 原文：https://webpack.js.org/guides/shimming/
