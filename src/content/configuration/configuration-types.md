---
title: 配置类型
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

除了导出一个配置对象之外，还有其他一些方法可以满足其他需求。


## 导出函数

最终你会发现你的 `webpack.config.js` 在 [开发(development)](/guides/development) 和 [生产构建(production builds)](/guides/production)之间. 你至少有两个选择：

一个选项是从webpack配置中导出函数，而不是导出对象。函数将使用两个参数调用：

- 作为第一个参数的环境。有关语法示例，请参阅[环境选项CLI文档](/api/cli/#environment-options) .
- 选项映射（`argv`）作为第二个参数。它描述了传递给webpack的选项, 其中包含诸如[`输出文件名`(`output filename`)](/api/cli/#output-options) and [`优化最小化`(`output filename`)](/api/cli/#optimize-options).

```diff
-module.exports = {
+module.exports = function(env, argv) {
+  return {
+    mode: env.production ? 'production' : 'development',
+    devtool: env.production ? 'source-maps' : 'eval',
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


## 导出Promise

webpack将运行配置文件导出的函数，并等待返回承诺。在需要异步加载配置变量时非常方便。

T> 也可以将多个promise通过promise.all的方法来包装 `Promise.all([/* Your promises */]).`

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

W> 返回一个 `Promise` 仅在通过CLI使用webpack时有效。 [`webpack()`](/api/node/#webpack) 接收一个对象.


## 导出多个配置

您可以导出多个配置，而不是导出单个配置对象/函数(webpack 3.1.0以后支持多个函数)。运行webpack时，将生成所有配置。例如，对于AMD和CommonJS等多个[目标](/configuration/output/#outputlibrarytarget)这对于[捆绑库](/guides/author-libraries)很有用：


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

T> 如果将名称传递给[`--config name`](/api/cli/#configuration-options)标志，webpack将只生成该特定配置。
