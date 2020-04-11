---
title: 配置
sort: 1
contributors:
  - sokra
  - skipjack
  - grgur
  - bondz
  - sricc
  - terinjokes
  - mattce
  - kbariotis
  - sterlingvix
  - jeremenichelli
  - dasarianudeep
  - lukasgeiter
---

webpack 开箱即用，可以无需使用任何配置文件。然而，webpack 会假定项目的入口起点为 `src/index`，然后会在 `dist/main.js` 输出结果，并且在生产环境开启压缩和优化。

通常，你的项目还需要继续扩展此能力，为此你可以在项目根目录下创建一个 `webpack.config.js` 文件，webpack 会自动使用它。

下面指定了所有可用的配置选项。

T> 刚开始学习 webpack？请查看我们提供的指南，从 webpack 一些 [核心概念](/concepts) 开始学习吧！


## Use different config file

If for some reason you want to use different config file depending on certain situations you can change this via command line by using the `--config` flag.

**package.json**

```json
"scripts": {
  "build": "webpack --config prod.config.js"
}
```


## 选项

点击下面配置代码中每个选项的名称，跳转到详细的文档。还要注意，带有箭头的项目可以展开，以显示更多示例，在某些情况下可以看到高级配置。

T> 注意整个配置中我们使用 Node 内置的 [path 模块](https://nodejs.org/api/path.html)，并在它前面加上 [__dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname)这个全局变量。可以防止不同操作系统之间的文件路径问题，并且可以使相对路径按照预期工作。更多「POSIX 和 Windows」的相关信息请查看[此章节](https://nodejs.org/api/path.html#path_windows_vs_posix)。

__webpack.config.js__

```js-with-links-details
const path = require('path');

module.exports = {
  <mode "/configuration/mode">
    <default>
      mode: "production", // "production" | "development" | "none"
    </default>
    mode: "production", // enable many optimizations for production builds
    mode: "development", // enabled useful tools for development
    mode: "none", // no defaults
  </mode>
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  <entry "/configuration/entry-context#entry">
    <default>
      entry: "./app/entry", // string | object | array
    </default>
    entry: ["./app/entry1", "./app/entry2"],
    entry: {
      a: "./app/entry-a",
      b: ["./app/entry-b1", "./app/entry-b2"]
    },
  </entry>
  // 默认为 ./src
  // 这里应用程序开始执行
  // webpack 开始打包
  <link "/configuration/output">
    <default>
      output: {
    </default>
  </link>
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    <filename "/configuration/output#output-filename">
      <default>
        filename: "bundle.js", // string
      </default>
      filename: "[name].js", // 用于多个入口起点(entry point)
      filename: "[chunkhash].js", // 用于长效缓存
    </filename>
    // 入口分块(entry chunk)的文件名模板
    <publicPath "/configuration/output#output-publicpath">
      <default>
        publicPath: "/assets/", // string
      </default>
      publicPath: "",
      publicPath: "https://cdn.example.com/",
    </publicPath>
    // 输出解析文件的目录，url 相对于 HTML 页面
    library: "MyLibrary", // string,
    // 导出库(exported library)的名称
    <libraryTarget "/configuration/output#output-librarytarget">
      <default>
        libraryTarget: "umd", // 通用模块定义
      </default>
      libraryTarget: "umd2", // 通用模块定义
      libraryTarget: "commonjs2", // 使用 module.exports 导出
      libraryTarget: "commonjs", // 作为 exports 的属性导出
      libraryTarget: "amd", // 使用 AMD 定义方法来定义
      libraryTarget: "this", // 在 this 上设置属性
      libraryTarget: "var", // 变量定义于根作用域下
      libraryTarget: "assign", // 盲分配(blind assignment)
      libraryTarget: "window", // 在 window 对象上设置属性
      libraryTarget: "global", // 在 global 对象上设置属性
      libraryTarget: "jsonp", // jsonp 包裹
    </libraryTarget>
    // 导出库(exported library)的类型
    <advancedOutput "#">
      <default>
        /* 高级输出配置（点击显示） */
      </default>
      pathinfo: true, // boolean
      // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。
      chunkFilename: "[id].js",
      chunkFilename: "[chunkhash].js", // 长效缓存
      // 附加分块(additional chunk)的文件名模板
      jsonpFunction: "myWebpackJsonp", // string
      // 用于加载分块的 JSONP 函数名
      sourceMapFilename: "[file].map", // string
      sourceMapFilename: "sourcemaps/[file].map", // string
      // source map location 的文件名模板
      devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
      // 「devtool 中模块」的文件名模板
      devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
      // 「devtool 中模块」的文件名模板（用于冲突）
      umdNamedDefine: true, // boolean
      // 在 UMD 库中使用命名的 AMD 模块
      crossOriginLoading: "use-credentials", // 枚举
      crossOriginLoading: "anonymous",
      crossOriginLoading: false,
      // 指定运行时如何发出跨域请求问题
    </advancedOutput>
    <expert "#">
      <default>
        /* 专家级输出配置（自行承担风险） */
      </default>
      devtoolLineToLine: {
        test: /\\.jsx$/
      },
      // 为这些模块使用 1:1 映射 SourceMaps（快速）
      hotUpdateMainFilename: "[hash].hot-update.json", // string
      // HMR manifest 的文件名模板
      hotUpdateChunkFilename: "[id].[hash].hot-update.js", // string
      // HMR chunks 的文件名模板
      sourcePrefix: "\\t", // string
      // bundle 内前置式模块资源具有更好可读性
    </expert>
  },
  module: {
    // 关于模块配置
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {
        test: /\\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include
        issuer: { test, include, exclude },
        // issuer 条件（导入源）
        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）
        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 [webpack 1 升级指南](/migrate/3/#automatic-loader-module-name-extension-removed)。
        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },
      {
        test: /\\.html$/,
        use: [
          // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      { oneOf: [ /* rules */ ] },
      // 只使用这些嵌套规则之一
      { rules: [ /* rules */ ] },
      // 使用所有这些嵌套规则（合并可用条件）
      { resource: { and: [ /* 条件 */ ] } },
      // 仅当所有条件都匹配时才匹配
      { resource: { or: [ /* 条件 */ ] } },
      { resource: [ /* 条件 */ ] },
      // 任意条件匹配时匹配（默认为数组）
      { resource: { not: /* 条件 */ } }
      // 条件不匹配时匹配
    ],
    <advancedModule "#">
      <default>
        /* 高级模块配置（点击展示） */
      </default>
      noParse: [
        /special-library\\.js$/
      ],
      // 不解析这里的模块
      unknownContextRequest: ".",
      unknownContextRecursive: true,
      unknownContextRegExp: /^\\.\\/.*$/,
      unknownContextCritical: true,
      exprContextRequest: ".",
      exprContextRegExp: /^\\.\\/.*$/,
      exprContextRecursive: true,
      exprContextCritical: true,
      wrappedContextRegExp: /.*/,
      wrappedContextRecursive: true,
      wrappedContextCritical: false,
      // specifies default behavior for dynamic requests
    </advancedModule>
  },
  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // 用于查找模块的目录
    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名
    alias: {
      // 模块别名列表
      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    <alias "/configuration/resolve#resolve-alias">
      <default>
        /* 可供选择的别名语法（点击展示） */
      </default>
      alias: [
        {
          name: "module",
          // 旧的请求
          alias: "new-module",
          // 新的请求
          onlyModule: true
          // 如果为 true，只有 "module" 是别名
          // 如果为 false，"module/inner/path" 也是别名
        }
      ],
    </alias>
    <advancedResolve "#">
      <default>
        /* 高级解析选项（点击展示） */
      </default>
      symlinks: true,
      // 遵循符号链接(symlinks)到新位置
      descriptionFiles: ["package.json"],
      // 从 package 描述中读取的文件
      mainFields: ["main"],
      // 从描述文件中读取的属性
      // 当请求文件夹时
      aliasFields: ["browser"],
      // 从描述文件中读取的属性
      // 以对此 package 的请求起别名
      enforceExtension: false,
      // 如果为 true，请求必不包括扩展名
      // 如果为 false，请求可以包括扩展名
      moduleExtensions: ["-module"],
      enforceModuleExtension: false,
      // 类似 extensions/enforceExtension，但是用模块名替换文件
      unsafeCache: true,
      unsafeCache: {},
      // 为解析的请求启用缓存
      // 这是不安全，因为文件夹结构可能会改动
      // 但是性能改善是很大的
      cachePredicate: (path, request) => true,
      // predicate function which selects requests for caching
      plugins: [
        // ...
      ]
      // 应用于解析器的附加插件
    </advancedResolve>
  },
  performance: {
    <hints "/configuration/performance#performance-hints">
      <default>
        hints: "warning", // 枚举
      </default>
      hints: "error", // 性能提示中抛出错误
      hints: false, // 关闭性能提示
    </hints>
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  <devtool "/configuration/devtool">
    <default>
      devtool: "source-map", // enum
    </default>
    devtool: "inline-source-map", // inlines SourceMap into original file
    devtool: "eval-source-map", // inlines SourceMap per module
    devtool: "hidden-source-map", // SourceMap without reference in original file
    devtool: "cheap-source-map", // cheap-variant of SourceMap without module mappings
    devtool: "cheap-module-source-map", // cheap-variant of SourceMap with module mappings
    devtool: "eval", // no SourceMap, but named modules. Fastest at the expense of detail.
  </devtool>
  [devtool](/configuration/devtool): "inline-source-map", // 嵌入到源文件中
  [devtool](/configuration/devtool): "eval-source-map", // 将 SourceMap 嵌入到每个模块中
  [devtool](/configuration/devtool): "hidden-source-map", // SourceMap 不在源文件中引用
  [devtool](/configuration/devtool): "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
  [devtool](/configuration/devtool): "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
  [devtool](/configuration/devtool): "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。
  </details>
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。
  [context](/configuration/entry-context#context): __dirname, // string（绝对路径！）
  // webpack 的主目录
  // [entry](/configuration/entry-context) 和 [module.rules.loader](/configuration/module#rule-loader) 选项
  // 相对于此目录解析
  <details><summary>[target](/configuration/target): "web", // 枚举</summary>
  [target](/configuration/target): "webworker", // WebWorker
  [target](/configuration/target): "node", // node.js 通过 require
  [target](/configuration/target): "async-node", // Node.js 通过 fs 和 vm
  [target](/configuration/target): "node-webkit", // nw.js
  [target](/configuration/target): "electron-main", // electron，主进程(main process)
  [target](/configuration/target): "electron-renderer", // electron，渲染进程(renderer process)
  [target](/configuration/target): (compiler) => { /* ... */ }, // 自定义
  </details>
  // bundle 应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)
  <details><summary>[externals](/configuration/externals): ["react", /^@angular\//],</summary>
  [externals](/configuration/externals): "react", // string（精确匹配）
  [externals](/configuration/externals): /^[a-z\-]+($|\/)/, // 正则
  [externals](/configuration/externals): { // 对象
    angular: "this angular", // this["angular"]
    react: { // UMD
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    }
  },
  [externals](/configuration/externals): (request) => { /* ... */ return "commonjs " + request }
  </details>
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
  [serve](https://github.com/webpack-contrib/webpack-serve#options): { //object
    port: 1337,
    content: './dist',
    // ...
  },
  // 为 webpack-serve 提供选项
  <details><summary>[stats](/configuration/stats): "errors-only",</summary>
  [stats](/configuration/stats): { //object
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    // ...
  },
  </details>
  // 精确控制要显示的 bundle 信息
  [devServer](/configuration/dev-server): {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  [plugins](plugins): [
    // ...
  ],
  // 附加插件列表
  <details><summary>/* 高级配置（点击展示） */</summary>
  [resolveLoader](/configuration/resolve#resolveloader): { /* 等同于 resolve */ }
  // 独立解析选项的 loader
  [parallelism](other-options#parallelism): 1, // number
  // 限制并行处理模块的数量
  [profile](other-options#profile): true, // boolean
  // 捕获时机信息
  [bail](other-options#bail): true, //boolean
  // 在第一个错误出错时抛出，而不是无视错误。
  [cache](other-options#cache): false, // boolean
  // 禁用/启用缓存
  [watch](watch#watch): true, // boolean
  // 启用观察
  [watchOptions](watch#watchoptions): {
    [aggregateTimeout](watch#watchoptions-aggregatetimeout): 1000, // in ms
    // 将多个更改聚合到单个重构建(rebuild)
    [poll](watch#watchoptions-poll): true,
    [poll](watch#watchoptions-poll): 500, // 间隔单位 ms
    // 启用轮询观察模式
    // 必须用在不通知更改的文件系统中
    // 即 nfs shares（译者注：[Network FileSystem](http://linux.vbird.org/linux_server/0330nfs/0330nfs.php)，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
  },
  [node](node): {
    // Polyfills and mocks to run Node.js-
    // environment code in non-Node environments.
    [console](node#node-console): false, // boolean | "mock"
    [global](node#node-global): true, // boolean | "mock"
    [process](node#node-process): true, // boolean
    [__filename](node#node-__filename): "mock", // boolean | "mock"
    [__dirname](node#node-__dirname): "mock", // boolean | "mock"
    [Buffer](node#node-buffer): true, // boolean | "mock"
    [setImmediate](node#node-setimmediate): true // boolean | "mock" | "empty"
  },
  [recordsPath](other-options#recordspath): path.resolve(__dirname, "build/records.json"),
  [recordsInputPath](other-options#recordsinputpath): path.resolve(__dirname, "build/records.json"),
  [recordsOutputPath](other-options#recordsoutputpath): path.resolve(__dirname, "build/records.json"),
  // TODO
  </details>
}
```

## Use custom configuration file

If for some reason you want to use custom configuration file depending on certain situations you can change this via command line by using the `--config` flag.

__package.json__

```json
"scripts": {
  "build": "webpack --config prod.config.js"
}
```

## Configuration file generators

Want to rapidly generate webpack configuration file for your project requirements with just a few clicks away?

[Generate Custom Webpack Configuration](https://generatewebpackconfig.netlify.com/) is an interactive portal you can play around by selecting custom webpack configuration options tailored for your frontend project. It automatically generates a minimal webpack configuration based on your selection of loaders/plugins, etc.

[Visual tool for creating webpack configs](https://webpack.jakoblind.no/) is an online configuration tool for creating webpack configuration file where you can select any combination of features you need. It also generates a full example project based on your webpack configs.
