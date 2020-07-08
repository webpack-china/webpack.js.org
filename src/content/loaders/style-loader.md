---
title: style-loader
source: https://raw.githubusercontent.com/webpack-contrib/style-loader/master/README.md
edit: https://github.com/webpack-contrib/style-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/style-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]



把 CSS 插入到 DOM 中。

## 起步

首先， 你需要安装 `style-loader`:

```console
npm install --save-dev style-loader
```

推荐将 `style-loader` 与 [`css-loader`](/loaders/css-loader/) 一起使用

然后把 loader 添加到你的 `webpack` 配置中。 比如：

**style.css**

```css
body {
  background: green;
}
```

**component.js**

```js
import './style.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

## Options

|              名称               |         类型         |  默认值   | 描述                                              |
| :-----------------------------: | :------------------: | :--------: | :------------------------------------------------------- |
| [**`injectType`**](#injecttype) |      `{String}`      | `styleTag` | 配置把 styles 插入到 DOM 中的方式 |
| [**`attributes`**](#attributes) |      `{Object}`      |    `{}`    | 添加自定义属性到插入的标签中              |
|     [**`insert`**](#insert)     | `{String\|Function}` |   `head`   | 在指定的位置插入标签 |
|       [**`base`**](#base)       |      `{Number}`      |   `true`   | 基于 (DLLPlugin) 设置 module ID |
|   [**`esModule`**](#esmodule)   |     `{Boolean}`      |  `false`   | 使用 ES modules 语法                    |

### `injectType`

Type: `String`
Default: `styleTag`

配置把 styles 插入到 DOM 中的方式。

可以使用的值：

- `styleTag`
- `singletonStyleTag`
- `lazyStyleTag`
- `lazySingletonStyleTag`
- `linkTag`

#### `styleTag`

通过使用多个 `<style></style>` 自动把 styles 插入到 DOM 中。该方式是默认行为。

**component.js**

```js
import './styles.css';
```

使用 Locals (CSS Modules) 的例子：

**component-with-css-modules.js**

```js
import styles from './styles.css';

const divElement = document.createElement('div');
divElement.className = styles['my-class'];
```

导入的对象保存着所有的 locals (class names)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // 由于是默认行为，`injectType` 选项可以省略
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
        ],
      },
    ],
  },
};
```

通过 `style-loader` 插入的 styles 如下：

```html
<style>
  .foo {
    color: red;
  }
</style>
<style>
  .bar {
    color: blue;
  }
</style>
```

#### `singletonStyleTag`

通过使用一个 `<style></style>` 来自动把 styles 插入到 DOM 中。

> ⚠ Source maps 不起作用

**component.js**

```js
import './styles.css';
```

**component-with-css-modules.js**

```js
import styles from './styles.css';

const divElement = document.createElement('div');
divElement.className = styles['my-class'];
```

导入的对象保存着所有的 locals  (class names)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'singletonStyleTag' },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

loader 插入的 styles 如下：

```html
<style>
  .foo {
    color: red;
  }
  .bar {
    color: blue;
  }
</style>
```

#### `lazyStyleTag`

在需要时使用多个 `<style></style>` 把 styles 插入到 DOM 中。
推荐 lazy styles 遵循 使用 `.lazy.css` 后缀命名约定， `style-loader` 基本用法使用 `.css` 作为文件后缀 (其他文件也一样，比如：`.lazy.less ` 和 `.less`)。
当使用 `lazyStyleTag` 时， `style-loader` 将惰性插入 styles，在需要使用 styles 时可以通过 `style.use() / style.unuse() ` 使 styles 可用。

> ⚠️ 调用 `unuse` 多于 `use` 的行为是不确定的。请不要这么做。

**component.js**

```js
import styles from './styles.lazy.css';

styles.use();
// 要移除 styles 时你可以调用
// styles.unuse();
```

**component-with-css-modules.js**

```js
import styles from './styles.lazy.css';

styles.use();

const divElement = document.createElement('div');
divElement.className = styles.locals['my-class'];
```

导入的对象的 `locals` 属性保存着所有的 locals (class names)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.lazy\.css$/i,
        use: [
          { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
          'css-loader',
        ],
      },
    ],
  },
};
```

style-loaders 插入的 styles 如下：

```html
<style>
  .foo {
    color: red;
  }
</style>
<style>
  .bar {
    color: blue;
  }
</style>
```

#### `lazySingletonStyleTag`

在需要时使用一个 `<style></style>` 把 styles 插入的 DOM 中。
推荐 lazy styles 遵循 使用 `.lazy.css` 后缀命名约定， `style-loader` 基本用法使用 `.css` 作为文件后缀 (其他文件也一样，比如：`.lazy.less ` 和 `.less`)。
当使用 `lazySingletonStyleTag` 时， `style-loader` 将惰性插入 styles，在需要使用 styles 时可以通过 `style.use() / style.unuse() ` 使 styles 可用。

> ⚠️ Source maps 不起作用

> ⚠️ 调用 `unuse` 多于 `use` 的行为是不确定的。请不要这么做。

**component.js**

```js
import styles from './styles.css';

styles.use();
// 要移除 styles 时你可以调用
// styles.unuse();
```

**component-with-css-modules.js**

```js
import styles from './styles.lazy.css';

styles.use();

const divElement = document.createElement('div');
divElement.className = styles.locals['my-class'];
```

导入的对象的 `locals` 属性保存着所有的 locals (class names)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.lazy\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'lazySingletonStyleTag' },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

style-loader 生成如下代码：

```html
<style>
  .foo {
    color: red;
  }
  .bar {
    color: blue;
  }
</style>
```

#### `linkTag`

使用多个 `<link rel="stylesheet" href="path/to/file.css">` 将 styles 插入到 DOM 中。

> ℹ️ style-loader 会在运行时使用 JavaScript 动态地插入 `<link href="path/to/file.css" rel="stylesheet">`。要插入 static `<link href="path/to/file.css" rel="stylesheet">`时请使用[MiniCssExtractPlugin](/plugins/mini-css-extract-plugin/)。

```js
import './styles.css';
import './other-styles.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.link\.css$/i,
        use: [
          { loader: 'style-loader', options: { injectType: 'linkTag' } },
          { loader: 'file-loader' },
        ],
      },
    ],
  },
};
```

style-loader 将生成如下代码：

```html
<link rel="stylesheet" href="path/to/style.css" />
<link rel="stylesheet" href="path/to/other-styles.css" />
```

### `attributes`

Type: `Object`
Default: `{}`

如果配置了 `attributes`，`style-loader`将会在 `<style> / <link>`上绑定指定的 `attributes`和它们的值。

**component.js**

```js
import style from './file.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader', options: { attributes: { id: 'id' } } },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
};
```

```html
<style id="id"></style>
```

### `insert`

Type: `String|Function`
Default: `head`

默认情况下，除非指定 `insert`,否则 `style-loader`会把 `<style> / <link>`添加到 页面的 `<head>` 标签尾部。
这会使得 `style-loader` 创建的 CSS 比 `<head>` 标签内已经存在的 CSS 拥有更高的优先级。
当默认行为不能满足你的需求时，你可以使用其他值，但我们不推荐这么做。
如果你指定 [iframe](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement) 作为 插入的目标时，请确保你有足够的访问权限，styles 将会被插入到 content document 的 head 标签中。

#### `String`

配置 styles 插入 DOM 的自定义 [query selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'body',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

`<style> / <link>` 元素将会被插入到 `body` 标签底部。

#### `Function`

允许覆盖默认行为并把 styles 插入到任意位置。

> ⚠ 不要忘了这个函数会在浏览器中调用，由于不是所有浏览器都支持最新的 ECMA 特性，如：`let`，`const`，`allow function expression`等，我们推荐只使用 ECMA 5  特性，但这取决于你想要支持的浏览器版本。
> ⚠ 不要忘了版本较旧的浏览器中某些 DOM 方法并不可用，所以我们推荐只使用 [DOM core level 2 properties](https://caniuse.com/#search=dom%20core)，但这取决于想要支持的浏览器版本。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: function insertAtTop(element) {
                var parent = document.querySelector('head');
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

在 `head` 标签顶部插入styles。

### `base`

这个配置主要是作为使用一个或多个[DllPlugin](https://robertknight.github.io/posts/webpack-dll-plugins/)时出现的 [css clashes](https://github.com/webpack-contrib/style-loader/issues/163)问题的解决方案。`base`允许你通过指定一个 比 DllPlugin1 使用的 css module id base 范围大的 css module id base 来避免 app's css (或者 DllPlugin2's css) 被 DllPlugin1's css 覆盖。比如：

**webpack.dll1.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

**webpack.dll2.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader', options: { base: 1000 } },
          'css-loader',
        ],
      },
    ],
  },
};
```

**webpack.app.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader', options: { base: 2000 } },
          'css-loader',
        ],
      },
    ],
  },
};
```

### `esModule`

Type: `Boolean`
Default: `false`

默认情况下，`style-loader` 生成使用 Common JS modules 语法的 JS modules。
某些情况下使用 ES modules 更好，比如： [module concatenation](/plugins/module-concatenation-plugin/) 和 [tree shaking](/guides/tree-shaking/)。

你可以使用下面的配置启用 ES module 语法：

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          esModule: true,
        },
      },
    ],
  },
};
```

## 例子

### Source maps

当前面的 loader 生成 source maps 时，style-loader 会自动注入。

因此，想要生成 source maps 则把在 style-loader 前面执行的 loader 的  `sourceMap` 选项设置为`true`。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
};
```

### Nonce

有两种方式使用 `nonce`：

- 使用 `attributes` 选项
- 使用 `__webpack_nonce__` 变量

> ⚠ `attributes` 拥有比 `__webpack_nonce__`更高的优先级

#### `attributes`

**component.js**

```js
import './style.css';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              attributes: {
                nonce: '12345678',
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

style-loader 生成如下代码:

```html
<style nonce="12345678">
  .foo {
    color: red;
  }
</style>
```

#### `__webpack_nonce__`

**create-nonce.js**

```js
__webpack_nonce__ = '12345678';
```

**component.js**

```js
import './create-nonce.js';
import './style.css';
```

使用 `require`的例子：

**component.js**

```js
__webpack_nonce__ = '12345678';

require('./style.css');
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

style-loader 生成如下代码：

```html
<style nonce="12345678">
  .foo {
    color: red;
  }
</style>
```

#### Insert styles at top

在 `head` 标签顶部插入styles。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: function insertAtTop(element) {
                var parent = document.querySelector('head');
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

#### 在目标元素前面插入styles

在 `#id`元素前面插入styles。

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: function insertBeforeAt(element) {
                const parent = document.querySelector('head');
                const target = document.querySelector('#id');

                const lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, target);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](https://github.com/webpack-contrib/style-loader/blob/master/.github/CONTRIBUTING.md)

## License

[MIT](https://github.com/webpack-contrib/style-loader/blob/master/LICENSE)

[npm]: https://img.shields.io/npm/v/style-loader.svg
[npm-url]: https://npmjs.com/package/style-loader
[node]: https://img.shields.io/node/v/style-loader.svg
[node-url]: https://nodejs.org/
[deps]: https://david-dm.org/webpack-contrib/style-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/style-loader
[tests]: https://github.com/webpack-contrib/style-loader/workflows/style-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/style-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/style-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/style-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=style-loader
[size-url]: https://packagephobia.now.sh/result?p=style-loader
