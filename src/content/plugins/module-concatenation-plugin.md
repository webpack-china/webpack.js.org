---
title: ModuleConcatenationPlugin
contributors:
  - skipjack
  - TheLarkInn
related:
  - webpack 3: Official Release!!
---

过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。

这个插件会在 webpack 中实现以上的预编译功能。

``` js
new webpack.optimize.ModuleConcatenationPlugin()
```

> 由于实现 ECMAScript 模块语法，作用域提升(Scope Hoisting)这个特定于此语法的功能才成为可能。`webpack` 可能会根据你正在使用的模块类型和[其他的情况](https://medium.com/webpack/webpack-freelancing-log-book-week-5-7-4764be3266f5)，回退到普通打包。


## 捆绑失败的优化[Optimization Bailouts]

像文章中解释的， webpack 试图达到分批范围提升(scope hoisting)。它会将一些模型捆绑到一个范围内，但并不是任何情况下都会这么做。如果 webpack 不能捆绑模型，将会有两个选择 `Prevent` 和 `Root`，`Prevent` 意思是模型必须在自己的范围内。 `Root` 意思是一个新的模型组将被创建。以下情况决定了输出选择。

Condition                                     | Outcome
--------------------------------------------- | --------
Non ES6 Module                                | Prevent
Imported By Non Import                        | Root
Imported From Other Chunk                     | Root
Imported By Multiple Other Module Groups      | Root
Imported With `import()`                      | Root
Affected By `ProvidePlugin` Or Using `module` | Prevent
HMR Accepted                                  | Root
Using `eval()`                                | Prevent
In Multiple Chunks                            | Prevent
`export * from "cjs-module"`                  | Prevent


### 模型组算法[Module Grouping Algorithm]

下面的 JS 解释了算法：

```js
modules.forEach(module => {
  const group = new ModuleGroup({
    root: module
  });
  module.dependencies.forEach(dependency => {
    tryToAdd(group, dependency);
  });
  if (group.modules.length > 1) {
    orderedModules = topologicalSort(group.modules);
    concatenatedModule = new ConcatenatedModule(orderedModules);
    chunk.add(concatenatedModule);
    orderedModules.forEach(groupModule => {
      chunk.remove(groupModule);
    });
  }
});

function tryToAdd(group, module) {
  if (group.has(module)) {
    return true;
  }
  if (!hasPreconditions(module)) {
    return false;
  }
  const nextGroup = group;
  const result = module.dependents.reduce((check, dependent) => {
    return check && tryToAdd(nextGroup, dependent);
  }, true);
  if (!result) {
    return false;
  }
  module.dependencies.forEach(depenency => {
    tryToAdd(group, depenency);
  });
  group.merge(nextGroup);
  return true;
}
```

### 优化捆绑失败的调试[Debugging Optimization Bailouts]

当我们使用 webpack CLI 时，参数 `--display-optimization-bailout` 将显示捆绑失败的原因。在 webpack 配置里，加上下面的 `stats` 对象:

```js
{
  ...stats,
  // Examine all modules
  maxModules: Infinity,
  // Display bailout reasons
  optimizationBailout: true
}
```
