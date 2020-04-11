---
title: IgnorePlugin
contributors:
  - simon04
  - byzyk
  - DullReferenceException
  - EugeneHlushko
---

IgnorePlugin 防止在 `import` 或 `require` 调用时，生成以下正则表达式匹配的模块：

## Using regular expressions

- `resourceRegExp`：匹配(test)资源请求路径的正则表达式。
- `contextRegExp`：（可选）匹配(test)资源上下文（目录）的正则表达式。

```javascript
new webpack.IgnorePlugin({resourceRegExp, contextRegExp});
// old way, deprecated in webpack v5
new webpack.IgnorePlugin(resourceRegExp, [contextRegExp]);
```

## Using filter functions

- `checkContext(context)` A Filter function that receives context as the argument, must return boolean.
- `checkResource(resource)` A Filter function that receives resource as the argument, must return boolean.

```javascript
new webpack.IgnorePlugin({
  checkContext (context) {
    // do something with context
    return true|false;
  },
  checkResource (resource) {
    // do something with resource
    return true|false;
  }
});
```

## 忽略 moment 本地化内容的示例

[moment](https://momentjs.com/) 2.18 会将所有本地化内容和核心功能一起打包（见[该 GitHub issue](https://github.com/moment/moment/issues/2373)）。

The `resourceRegExp` parameter passed to `IgnorePlugin` is not tested against the resolved file names or absolute module names being imported or required, but rather against the _string_ passed to `require` or `import` _within the source code where the import is taking place_. For example, if you're trying to exclude `node_modules/moment/locale/*.js`, this won't work:

```diff
-new webpack.IgnorePlugin(/moment\/locale\//);
```

Rather, because `moment` imports with this code:

```js
require('./locale/' + name);
```

...your first regexp must match that `'./locale/'` string. The second `contextRegExp` parameter is then used to select specific directories from where the import took place. The following will cause those locale files to be ignored:

```javascript
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/
});
```

...which means "any require statement matching `'./locale'` from any directories ending with `'moment'` will be ignored.
