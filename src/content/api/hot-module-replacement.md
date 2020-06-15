---
title: Hot Module Replacement
sort: 4
contributors:
  - sokra
  - skipjack
  - tbroadley
  - byzyk
  - wizardofhogwarts
  - snitin315
related:
  - title: Concepts - Hot Module Replacement
    url: /concepts/hot-module-replacement
  - title: Guides - Hot Module Replacement
    url: /guides/hot-module-replacement
---

如果已经通过 [Hot Module Replacement](/concepts/hot-module-replacement) 启用了 [`HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin), 则它的接口将被暴露在 [`module.hot` 属性](/api/module-variables/#modulehot-webpack-specific)下面。 通常，用户先要检查这个接口是否可访问, 然后再开始使用它。举个例子，你可以这样 `accept` 一个更新的模块：

``` js
if (module.hot) {
  module.hot.accept('./library.js', function() {
    // 使用更新过的 library 模块执行某些操作...
  });
}
```

支持以下方法……

## 模块 API

### `accept`

接受(accept)给定`依赖模块(dependencies)`的更新，并触发一个 `回调函数` 来对这些更新做出响应。

``` js
module.hot.accept(
  dependencies, // 可以是一个字符串或字符串数组
  callback // 用于在模块更新后触发的函数
);
```

当使用 ESM `import` 时，所有引用`依赖模块(dependencies)`的导入符号都会被自动更新。注意：依赖模块字符串必须和 `import` 中的 `from` 字符串相匹配。在一些情况中 `callback` 可以省略。在 `callback` 中使用的 `require()` 在这里没有任何意义。

在使用 CommonJS 时，你应该通过 `callback` 中的 `require()` 手动更新依赖模块。这时省略 `callback` 在这里没有任何意义。

### `accept` (自身)

接受自身更新。

``` js
module.hot.accept(
  errorHandler // 在计算新版本时处理错误的函数
);
```

在此模块或依赖模块更新时，在不通知父母的情况下，可以对此模块处理和重新取值。 如果此模块没有导出（或以其他方式更新的导出），这是有意义的。

当对此模块（或依赖模块）进行取值而引发异常时，会触发 `errorHandler`。

### `decline`

拒绝给定`依赖模块`的更新，使用 `'decline'` 方法强制更新失败。

``` js
module.hot.decline(
  dependencies // 可以是一个字符串或字符串数组
);
```

将依赖模块标记为不可更新(not-update-able)。在处理「依赖的导出正在更新」或「尚未实现处理」时，这是有意义的。取决于你的 HMR 管理代码，此依赖模块（或其未接受的依赖模块）更新，通常会导致页面被完全重新加载。

### `decline` (自身)

拒绝自身更新。

``` js
module.hot.decline();
```

将依赖模块标记为不可更新(not-update-able)。当此模块具有无法避免的外部作用(side-effect)，或者尚未对此模块进行 HMR 处理时，这是有意义的。取决于你的 HMR 管理代码，此依赖模块（或其未接受的依赖模块）更新，通常会导致页面被完全重新加载。

### `dispose` (or `addDisposeHandler`)

添加一个处理函数，在当前模块代码被替换时执行。此函数应该用于移除你声明或创建的任何持久资源。如果要将状态传入到更新过的模块，请添加给定 `data` 参数。更新后，此对象在更新之后可通过 `module.hot.data` 调用。

``` js
module.hot.dispose(data => {
  // 清理并将 data 传递到更新后的模块……
});
```


### `invalidate`

调用此方法将使当前模块无效，而当前模块将在应用 HMR 更新时进行部署并重新创建。这个模块的更新像冒泡一样，拒绝自身更新。

在 `idle` 状态下调用时，将创建一个包含此模块的新 HMR 更新。HMR 将进入 `ready` 状态。

在 `ready` 或 `prepare` 状态下调用时，此模块将添加到当前 HMR 的更新中。

在 `check` 状态期间被调用时，如果有可用更新，则此模块将添加到更新中。如果没有可用的更新，它将创建一个新更新。HMR 将进入 `ready` 状态。

在 `dispose` 或 `apply` 状态下调用时，HMR 将在退出这些状态后将其拾取。


### 用例

__Conditional Accepting__

一个模块可以接受一个依赖，但是当依赖的改变无法处理时，可以调用 `invalidate`：

```js
import { x, y } from './dep';
import { processX, processY } from 'anotherDep';

const oldY = y;

processX(x);
export default processY(y);

module.hot.accept('./dep', () => {
  if(y !== oldY) {
    // 无法处理，冒泡给父级
    module.hot.invalidate();
    return;
  }
  // 可以处理
  processX(x);
});
```

__Conditional self accept__

模块可以自我接受，但是当更改无法处理时可以使自身失效：

```javascript
const VALUE = 'constant';

export default VALUE;

if(module.hot.data && module.hot.data.value && module.hot.data.value !== VALUE) {
  module.hot.invalidate();
} else {
  module.hot.dispose(data => {
    data.value = VALUE;
  });
  module.hot.accept();
}
```

__Triggering custom HMR updates__

```javascript
const moduleId = chooseAModule();
const code = __webpack_modules__[moduleId].toString();
__webpack_modules__[moduleId] = eval(`(${makeChanges(code)})`);
if(require.cache[moduleId]) {
  require.cache[moduleId].hot.invalidate();
  module.hot.apply();
}
```

T> When `invalidate` is called, the [`dispose`](#dispose-or-adddisposehandler) handler will be eventually called and fill `module.hot.data`. If [`dispose`](#dispose-or-adddisposehandler) handler is not registered, an empty object will be supplied to `module.hot.data`.

W> Do not get caught in an `invalidate` loop, by calling `invalidate` again and again. This will result in stack overflow and HMR entering the `fail` state.

### `removeDisposeHandler`

删除由 `dispose` 或 `addDisposeHandler` 添加的回调函数。

``` js
module.hot.removeDisposeHandler(callback);
```

## 管理 API

### `status`

取得模块热替换进程的当前状态。

``` js
module.hot.status(); // 返回以下字符串之一……
```

| Status      | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| idle        | 该进程正在等待调用 `check`（见下文） |
| check       | 该进程正在检查以更新 |
| prepare     | 该进程正在准备更新（例如，下载已更新的模块） |
| ready       | 此更新已准备并可用 |
| dispose     | 该进程正在调用将被替换模块的 `dispose` 处理函数 |
| apply       | 该进程正在调用 `accept` 处理函数，并重新执行自我接受(self-accepted)的模块 |
| abort       | 更新已中止，但系统仍处于之前的状态 |
| fail        | 更新已抛出异常，系统状态已被破坏 |


### `check`

测试所有加载的模块以进行更新，如果有更新，则应用它们。

``` js
module.hot.check(autoApply).then(outdatedModules => {
  // 超时的模块……
}).catch(error => {
  // 捕获错误
});
```

`autoApply` 参数可以是布尔值，也可以是 `options`，当被调用时可以传递给 `apply` 方法。


### `apply`

继续更新进程（只要 `module.hot.status() === 'ready'`）。

``` js
module.hot.apply(options).then(outdatedModules => {
  // 超时的模块……
}).catch(error => {
  // 捕获错误
});
```

可选的 `options` 对象可以包含以下属性：

- `ignoreUnaccepted` (boolean): Ignore changes made to unaccepted modules.
- `ignoreDeclined` (boolean): Ignore changes made to declined modules.
- `ignoreErrored` (boolean): Ignore errors thrown in accept handlers, error handlers and while reevaluating module.
- `onDeclined` (function(info)): Notifier for declined modules
- `onUnaccepted` (function(info)): Notifier for unaccepted modules
- `onAccepted` (function(info)): Notifier for accepted modules
- `onDisposed` (function(info)): Notifier for disposed modules
- `onErrored` (function(info)): Notifier for errors

`info` 参数将是一个包含以下某些值的对象：

<!-- eslint-skip -->

```js
{
  type: 'self-declined' | 'declined' |
        'unaccepted' | 'accepted' |
        'disposed' | 'accept-errored' |
        'self-accept-errored' | 'self-accept-error-handler-errored',
  moduleId: 4, // The module in question.
  dependencyId: 3, // For errors: the module id owning the accept handler.
  chain: [1, 2, 3, 4], // For declined/accepted/unaccepted: the chain from where the update was propagated.
  parentId: 5, // For declined: the module id of the declining parent
  outdatedModules: [1, 2, 3, 4], // For accepted: the modules that are outdated and will be disposed
  outdatedDependencies: { // For accepted: The location of accept handlers that will handle the update
    5: [4]
  },
  error: new Error(...), // For errors: the thrown error
  originalError: new Error(...) // For self-accept-error-handler-errored:
                                // the error thrown by the module before the error handler tried to handle it.
}
```


### `addStatusHandler`

注册一个函数来监听 `status`的变化。

``` js
module.hot.addStatusHandler(status => {
  // 响应当前状态……
});
```


### `removeStatusHandler`

移除一个注册的状态处理函数。

``` js
module.hot.removeStatusHandler(callback);
```
