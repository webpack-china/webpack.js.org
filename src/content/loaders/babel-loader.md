---
title: babel-loader
source: https://raw.githubusercontent.com/babel/babel-loader/master/README.md
edit: https://github.com/babel/babel-loader/edit/master/README.md
repo: https://github.com/babel/babel-loader
---


这个包允许你使用 [Babel](https://github.com/babel/babel) 和 [webpack](https://github.com/webpack/webpack) 转换 `JavaScript` 文件。

__注意:__ 若有问题请上报至 Babel [issue tracker](https://github.com/babel/babel/issues).

## 中文文档

<a href="https://babel.docschina.org" target="_blank" style="font-size: 24px;">Babel 中文文档</a>

## 安装

> webpack 4.x | babel-loader 8.x | babel 7.x

```bash
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

## 用法

[文档：使用 loader](https://webpack.js.org/loaders/)

在 webpack 配置对象中，需要添加 babel-loader 到 module 的 loaders 列表中，像下面这样：

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```

## 配置

参考 `babel` [配置/选项](https://babeljs.io/docs/usage/api/#options)。


你可以使用 [options 属性](https://webpack.js.org/configuration/module/#rule-options-rule-query) 来给 loader 传递选项：

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }
  ]
}
```

此 loader 也支持下面这些 loader 特定(loader-specific)的配置选项：

* `cacheDirectory`：默认值为 `false`。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (`loader: 'babel-loader?cacheDirectory`) 或者 `true` (`loader: babel-loader?cacheDirectory=true`)，loader 将使用默认的缓存目录 `node_modules/.cache/babel-loader`，如果在任何根目录下都没有找到 `node_modules` 目录，将会降级回退到操作系统默认的临时文件目录。
* `cacheIdentifier`：默认是一个由 `@babel/core` 的版本号，`babel-loader` 的版本号，`.babelrc` 文件内容（存在的情况下），环境变量 `BABEL_ENV` 的值（没有时降级到 `NODE_ENV`）组成的字符串。可以设置为一个自定义的值，在 identifier 改变后，强制缓存失效。
* `cacheCompression`：默认值为 `true`。当有设置时，每个Babel转换输出将使用Gzip压缩。如果你想要退出缓存压缩，将它设置为 `false` -- 如果您的项目转换成数千个文件，您的项目可能会从中得到好处。
* `customize`: 默认为 `null`。导出 `custom` 回调的文件路径，[就像(下文中)传递`.custom()`那样](#customized-loader)(相关内容见下文[自定义 loader])。由于你必须创建一个新文件才能使用它，建议你使用 `.custom` 来创建一个包装loader. 只有在你必须继续直接使用`babel-loader`但又想自定义的情况下才使用这项配置。

## 疑难解答

### babel-loader 很慢！

确保转译尽可能少的文件。你可能使用 `/\.js$/` 来匹配，这样也许会去转译 `node_modules` 目录或者其他不需要的源代码。

要排除 `node_modules`，参考文档中的 `loaders` 配置的 `exclude` 选项。

你也可以通过使用 `cacheDirectory` 选项，将 babel-loader 提速至少两倍。
这会将转译的结果缓存到文件系统中。

### babel 在每个文件都插入了辅助代码，使代码体积过大！

babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`。
默认情况下会被添加到每一个需要它的文件中

你可以引入 babel runtime 作为一个独立模块，来避免重复引入。

下面的配置禁用了 babel 自动对每个文件的 runtime 注入，而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。

更多信息请参考[文档](http://babeljs.io/docs/plugins/transform-runtime/)。

**注意：** 你必须执行 `npm install -D @babel/plugin-transform-runtime` 来把它包含到你的项目中，也要使用 `npm install @babel/runtime` 把 `@babel/runtime` 安装为一个依赖。

```javascript
rules: [
  // 'transform-runtime' 插件告诉 babel 要引用 runtime 来代替注入。
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  }
]
```

#### **注意：** transform-runtime 和自定义 polyfills (比如 Promise library)

由于 [@babel/plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime) 包含了一个 polyfill，含有自定义的 [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) 和 [core.js](https://github.com/zloirock/core-js), 下面使用 `webpack.ProvidePlugin` 来配置 shimming 的常用方法将没有作用：

```javascript
// ...
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        }),
// ...
```

下面这样的写法也没有作用：

```javascript
require('@babel/runtime/core-js/promise').default = require('bluebird');

var promise = new Promise;
```

它其实会生成下面这样 (使用了 `runtime` 后)：

```javascript
'use strict';

var _Promise = require('@babel/runtime/core-js/promise')['default'];

require('@babel/runtime/core-js/promise')['default'] = require('bluebird');

var promise = new _Promise();
```

前面的 `Promise` 库在被覆盖前已经被引用和使用了。

一种可行的办法是，在你的应用中加入一个“启动器(bootstrap)”步骤，在应用开始前先覆盖默认的全局变量。

```javascript
// bootstrap.js

require('@babel/runtime/core-js/promise').default = require('bluebird');

// ...

require('./app');
```

### `babel` 的 node API 已经被移到 `babel-core` 中。

(原文：The Node.js API for `babel` has been moved to `babel-core`.)

如果你收到这个信息，这说明你有一个已经安装的 `babel` 包，并且在 webpack 配置中使用它来作为 loader 的简写 (这样的方式在 webpack 2.x 版本中将不再被支持)。

```js
  {
    test: /\.js$/,
    loader: 'babel',
  }
```

webpack 将尝试读取 `babel` 包而不是 `babel-loader`。

要修复这个问题，你需要删除 `babel` npm 包，因为它在 babel v6 中已经被废除。(安装 `@babel/cli` 或者 `@babel/core` 来替代它)。

如果你的依赖中有对 `babel` 包的依赖使你无法删除它，可以在 webpack 配置中使用完整的 loader 名称来解决：
```js
  {
    test: /\.js$/,
    loader: 'babel-loader',
  }
```

## 自定义 loader

`babel-loader` 提供了一个loader-builder实用程序，允许用户对"Babel处理的每个文件"添加自定义处理配置项。

`.custom` 接收一个回调，它将被 `babel` 实例本身的loader调用，因此，工具能够完全确保它使用和`@babel/core` 完全相同的实例作为它自己的loader。

如果你想自定义而不是调用一个名叫 `.custom` 的文件，你也可以使用某个导出了你的`custom`回调函数的文件，给 `customize` 配置传一个字符串类型的文件名称。

### 示例

```js
// 从"./my-custom-loader.js"或者任何你想要的文件名导出
module.exports = require("babel-loader").custom(babel => {
  function myPlugin() {
    return {
      visitor: {},
    };
  }

  return {
    // 提供这个loader的配置.
    customOptions({ opt1, opt2, ...loader }) {
      return {
        // loader可能具有的任何自定义配置
        custom: { opt1, opt2 },

        // "移除了两个自定义配置"的配置
        loader,
      };
    },

    // 提供Babel的'PartialConfig'对象
    config(cfg) {
      if (cfg.hasFilesystemConfig()) {
        // 使用正常的配置
        return cfg.options;
      }

      return {
        ...cfg.options,
        plugins: [
          ...(cfg.options.plugins || []),

          // 在配置中包含自定义plugin
          myPlugin,
        ],
      };
    },

    result(result) {
      return {
        ...result,
        code: result.code + "\n// Generated by some custom loader",
      };
    },
  };
});
```

```js
// 然后在你的Webpack config文件中
module.exports = {
  // ..
  module: {
    rules: [{
      // ...
      loader: path.join(__dirname, 'my-custom-loader.js'),
      // ...
    }]
  }
};
```

### `customOptions(options: Object): { custom: Object, loader: Object }`

指定的loader的配置选项，从`babel-loader`中分离出自定义选项。

### `config(cfg: PartialConfig): Object`

指定的Babel `PartialConfig` 对象，返回应该被传递给 `babel.transform` 的 `option` 对象。

### `result(result: Result): Result`

指定的Babel结果对象，允许loaders对它进行额外的调整。

## License

[MIT](https://couto.mit-license.org/)