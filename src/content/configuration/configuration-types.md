---
title: Configuration Types
sort: 3
contributors:
  - sokra
  - skipjack
  - kbariotis
  - simon04
  - fadysamirsadek
  - byzyk
  - EugeneHlushko
  - dhurlburtusa
  - anshumanv
---

除了作为单独的配置对象导出，也有其他为了满足更多需求的使用方式。


## 导出函数 {#exporting-a-function}

你最终可能会遇到需要区分[开发](/guides/development)和[生产](/guides/production)环境差异的情况。你可能有至少两种选择：

有一种选择是由webpack配置导出一个函数而不是对象，这个函数包含两个参数：

- 第一个是环境(environment)。在[环境选项文档](/api/cli/#environment-options)查看更多示例。
- 第二个是用于描述webpack配置项的参数map，比如[`output-filename`](/api/cli/#output-options) 和 [`optimize-minimize`](/api/cli/#optimize-options)等。

```diff
-module.exports = {
+module.exports = function(env, argv) {
+  return {
+    mode: env.production ? 'production' : 'development',
+    devtool: env.production ? 'source-map' : 'eval',
     plugins: [
       new TerserPlugin({
         terserOptions: {
+          compress: argv['optimize-minimize'] // only if -p or --optimize-minimize were passed
         }
       })
     ]
+  };
};
```


## 导出Promise {#exporting-a-promise}

webpack将执行配置文件导出的函数，同时等待Promise返回。便于异步加载配置变量。

T> 支持通过包裹`Promise.all([/* Your promises */]).`导出多个Promise。

```js
module.exports = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        entry: './app.js',
        /* ... */
      });
    }, 5000);
  });
};
```

W> 只有通过webpack命令行工具返回 `Promise` 才生效。[`webpack()`](/api/node/#webpack)只接受对象。


## 导出多种配置 {#exporting-multiple-configurations}


除了导出单个配置对象/函数，你可能也会需要导出多种配置（webpack 3.1.0起支持）。当运行webpack时，所有配置项都会构建。比如，对于多种[targets](/configuration/output/#outputlibrarytarget)（比如AMD and CommonJS）[打包library](/guides/author-libraries)会非常有用。

```js
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  name: 'amd',
  entry: './app.js',
  mode: 'production',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  name: 'commonjs',
  entry: './app.js',
  mode: 'production',
}];
```

T> 如果你只传了一个[`--config-name`](/api/cli/#configuration-options)名字标识，webpack将只会构建指定的配置项。
