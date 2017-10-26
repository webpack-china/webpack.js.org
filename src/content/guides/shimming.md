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
T> 译者注：shim是一个库，它将一个新的API引入到一个旧的环境中，而且仅靠旧环境中已有的手段实现。
       polyfill就是一个用在浏览器API上的shim。我们通常的做法是先检查当前浏览器是否支持某个API，如果不支持的话就加载对应的polyfill。然后新旧浏览器就都可以使用这个API了。

`webpack`编译器能理解使用ES2015模块化， CommonJS 或 AMD 格式编写的模块。无论如何，一些第三方的库可能期待全局依赖（例如`jQuery`中的`$`）。这些库也可能创建一些需要被导出的全局变量。这些‘奇葩模块’就是 _shimming_ 起作用的地方。

W> __我们不推荐使用全局的东西!__ 在webpack背后的整个概念是让更多的前端开发模块化。也就是说鼓励去写独立的模块以及不要依靠那些看不见的依赖(e.g. globals)。请在你必须的时候才使用本文这些特性。
 

另外一个 _shimming_ 有用的地方就是当你希望 [polyfill](https://en.wikipedia.org/wiki/Polyfill)  浏览器功能性以支持更多用户时。 在这种情况下，你可能只想要传送这些增强功能给到这些需要打补丁的浏览器。

下面的文章将展示给我们这二者的用例。

T> 本指南继续延伸[起步](https://doc.webpack-china.org/guides/getting-started/)中的代码示例。


## 全局 Shimming 

让我们开始第一个 shimming 全局变量的用例。在此之前，我们先看看我们的项目。

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

还记得我们之前用过的 `lodash`吗？ 出于演示的目的，让我们把这个做为一个全局变量在我们的应用中。要这样做，我们使用`ProvidePlugin`

[`ProvidePlugin`](/plugins/provide-plugin) 使得一个包能做为可用的变量在每一个模块被webpack编译时。如果webpack知道这个变量在其中某一个模块中被使用了，那么它会将此包包含在最终的bundle中。让我们先除去`lodash`的`import`声明，然后在plugin中提供声明。

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

我们所做的最基本的就是告诉webpack...

> 如果你遇到了至少一处 `lodash` 变量的实例, 将 `lodash` 囊括进来，并提供给需要他的模块。

如果我们run build，将会看到同样的输出：

``` bash
TODO: Include output
```

我们同样能使用 `ProvidePlugin` 去暴露一个模块其中单独的export，通过配置一个“数组路径”(e.g. `[module, child,...children?]`). 所以，我们只需要从`lodash`库中提供`join`方法，到需要使用的地方。

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
这样就能很好的与[Tree Shaking](/guides/tree-shaking)配合将`lodash`库中的其他没用到的方法去除。

## 细粒度 Shimming

一些传统的模块依赖的`this`指向的是`window`对象。在接下来的用例中，让我们升级我们的`index.js`：

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

当模块运行在CommonJS环境下这将会变成一个问题，也就是说此时的`this`指向的是`module.exports`。在这个例子中你可以覆写`this`通过使用
[`imports-loader`](/loaders/imports-loader/):

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


## 全局 Exports

让我们使用一个库，并创建一个全局变量以供人使用。为此我们新建一个小模块到我们的步骤中用来说明这些：

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

现在，你可能从来没有在你的源代码中做过这些，你或许见到过上面的代码，在你想要使用一个老旧的库的时候。在这个用例中，我们使用
[`exports-loader`](/loaders/exports-loader/)，去把一个全局变量作为一个普通的模块来导出。例如，为了将`file`导出为`file`以及将`helpers.parse`导出为`parse`：

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

现在从我们的entry入口文件中(i.e. `src/index.js`)，我们能 `import { file, parse } from './globals.js';` ，然后一切将顺利进行。


## 加载 Polyfills

目前为止我们所讨论的所有内容都是处理那些遗留的packages，让我们进入到下一个话题：__polyfills__。

有很多方法来使用polyfills。例如，要加入[`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/)我们只需要如下操作：

``` bash
npm i --save babel-polyfill
```

然后使用`import`让其添加到我们的主文件：

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

T> Note that we aren't binding the `import` to a variable. This is because polyfills simply run on their own, prior to the rest of the code base, allowing us to then assume certain native functionality exists.

__把polyfills放入主文件并不是最佳选择__ 因为这条语句使得那些现代浏览器下载了一个很大的文件，然而他们并不需要。

让我们把`import`放入一个新文件，并加入[`whatwg-fetch`](https://github.com/github/fetch) polyfill：


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

如此之后，我们给我们新的`polyfills.bundle.js`文件加入了一些条件性读取的逻辑。你该如何决定依赖于那些需要你支持的技术以及浏览器们。我们将做一些简单的测试来看看是否需要这些polyfills：

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
现在我们能`fetch`一些数据在我们的入口文件中了：

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

当我们开始构建时，`polyfills.bundle.js`文件将会被加载，然后所有东西将正确无误的加载在浏览器中。要注意到以上的这些操作并不是最完善的，我们只是提供给你一个很棒的想法给你，关于如何使用polyfills给那些需要它的用户。


## Further Optimizations

The `babel-preset-env` package uses [browserslist](https://github.com/ai/browserslist) to transpile only what is not supported in your browsers matrix. This preset comes with the `useBuiltIns` option, `false` by default, which converts your global `babel-polyfill` import to a more granular feature by feature `import` pattern:

``` js
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```

See [the repository](https://github.com/babel/babel-preset-env) for more information.


## Node Built-Ins

Node built-ins, like `process`, can be polyfilled right directly from your configuration file without the use of any special loaders or plugins. See the [node configuration page](/configuration/node) for more information and examples.


## Other Utilities

There are a few other tools that can help when dealing with legacy modules.

The [`script-loader`](/loaders/script-loader/) evaluates code in the global context, similar to inclusion via a `script` tag. In this mode, every normal library should work. `require`, `module`, etc. are undefined.

W> When using the `script-loader`, the module is added as a string to the bundle. It is not minimized by `webpack`, so use a minimized version. There is also no `devtool` support for libraries added by this loader.

When there is no AMD/CommonJS version of the module and you want to include the `dist`, you can flag this module in [`noParse`](/configuration/module/#module-noparse). This will cause webpack to include the module without parsing it or resolving `require()` and `import` statements. This practice is also used to improve the build performance.

W> Any feature requiring the AST, like the `ProvidePlugin`, will not work.

Lastly, there are some modules that support different [module styles](/concepts/modules) like AMD, CommonJS and legacy. In most of these cases, they first check for `define` and then use some quirky code to export properties. In these cases, it could help to force the CommonJS path by setting `define=>false` via the [`imports-loader`](/loaders/imports-loader/).

***

> 原文：https://webpack.js.org/guides/shimming/
