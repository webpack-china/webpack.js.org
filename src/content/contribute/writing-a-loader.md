---
title: 编写一个 loader
sort: 3
contributors:
  - asulaiman
  - michael-ciniawsky
---

插件是导出一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数通过 `this` 上下文访问 [loader API](/api/loaders/)。


## 设置

在深入研究不同 loader 以及他们的用法和例子之前，我们先看三种本地开发测试的方法。

测试一个单独 loader，你可以简单通过在 rule 对象设置 `path.resolve` 指向这个本地文件

__webpack.config.js__

``` js
{
  test: /\.js$/
  use: [
    {
      loader: path.resolve('path/to/loader.js'),
      options: {/* ... */}
    }
  ]
}
```

测试多个 loaders 的使用，你可以利用 `resolveLoader.modules` 的配置来更新 webpack 将会搜索寻找的 loaders。举例：如果你本地工程有 `/loaders` 文件

__webpack.config.js__

``` js
resolveLoader: {
  modules: [
    'node_modules',
    path.resolve(__dirname, 'loaders')
  ]
}
```

最后，如果你已经为 loader 创建了独立的库或者包，你可以使用 [`npm link`](https://docs.npmjs.com/cli/link)，来关联你要测试的项目


## 简单使用

当一个 loader 在资源中使用，这个 loader 只能传入一个参数————包含资源文件内容的字符串

同步 loader 可以简单的返回一个代表模块的转化后的值。在更复杂的情况下，loader 也可以通过使用 `this.callback(err, values...)` 函数，返回任意数量的值。错误要么传递给这个 `this.callback` 函数，要么扔进同步 loader 中。

loader 会返回一个或者两个值。第一个值类型是 JavaScript 代码的字符串或者 buffer。第二个参数值是 SourceMap，它是个 JavaScript 对象。


## 复杂使用

当链式调用多个 loader 的时候，他们会反向执行。根据数组格式，从右向左或者从下向上执行。

- 最后的 loader 最早调用，将会传入原始资源内容。.
- 第一个 loader，最后调用，将会传出 JavaScript 和 source map（可选）
- 中间的 loader 执行时被传入之前 loader 传出的结果

所以，在接下来的例子，`foo-loader` 被传入原始资源，`bar-loader` 将接收 `foo-loader` 的产出，返回最终转化后的模块和一个 source map（可选）

__webpack.config.js__

``` js
{
  test: /\.js/,
  use: [
    'bar-loader',
    'foo-loader'
  ]
}
```


## 引导

编写 loader 时应该遵循以下准则。它们按重要性排序，有些仅适用于某些场景，请阅读下面详细的章节以获得更多信息。

- 简单易用。
- 支持链式传递。
- 模块化到的输出。
- 确保他们无状态。
- 使用 __loader utilities__。
- 记录 loader 的依赖。
- 解决模块依赖关系。
- 提取公共代码。
- 避免绝对路径。
- 使用 peer dependencie。

### 简单

Loaders 应该只做单一任务。这不仅使每个 loader 易维护，也可以在更多场景链式调用。

### 链式

利用 loader 可以链式调用的优势。写五个简单的 loader 实现五项任务，而不是一个 loader 实现五项任务。功能隔离不仅是 loader 更简单，也让 loader 可以使用自己本身不具备的功能。

以通过 loader 选项或者查询参数得到的数据渲染模板为例。可以把源代码编译为模板，执行并输出包含 HTML 代码的字符串写到一个 loader 中。但是根据指南，一个简单的 `apply-loader` 可以被其它开源 loader 链式调用。

- `jade-loader`：导出一个函数，把模板转换为模块
- `apply-loader`：根据 loader 选项执行函数，返回原生 HTMl
- `html-loader`：接收 HTMl，输出一个合法的 JS 模块

T>loader 可以被链式调用意味着不一定要产出 JavaScript。只要下一个 loader 可以处理这个产出，这个 loader 就可以返回任意类型的模块。

### 模块化

保证输出模块化。loader 生成的模块与普通模块遵循相同的原则。

### 无状态

确保 laoder 在模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果。

### loader 工具库

充分利用 [`loader-utils`](https://github.com/webpack/loader-utils) 包。它提供了许多有用的工具，但最常用的一种方法是获取传递给 loader 的选项。
[`schema-utils`](https://github.com/webpack-contrib/schema-utils)包配合 `loader-utils`，基于对 loader 选项的验证，用于 JSON Schema 一致性。这有一个简单使用两者的例子：
__loader.js__

``` js
import { getOptions } from 'loader-utils';
import { validateOptions } from 'schema-utils';

const schema = {
  type: object,
  properties: {
    test: {
      type: string
    }
  }
}

export default function(source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  return `export default ${ JSON.stringify(source) }`;
};
```

### loader 依赖

如果一个 loader 使用外部资源（例如 从文件系统读取），必须声明它。这些信息在观察模式用于无效缓存 loaders 和重编译。这有一个关于如何使用 `addDependency` 方法的例子；

__loader.js__

``` js
import path from 'path';

export default function(source) {
  var callback = this.async();
  var headerPath = path.resolve('header.js');

  this.addDependency(headerPath);

  fs.readFile(headerPath, 'utf-8', function(err, header) {
    if(err) return callback(err);
    callback(null, header + "\n" + source);
  });
};
```

### 模块依赖

根据模块类型，可能有不同的模式指定依赖项。例如在 css 中，使用 `@import` 和 `url(...)` 来声明依赖。这些依赖关系应该由模块系统解决。

这个有两种方式实现：

- 通过把它们转化成 `require` 声明依赖
- 使用 `this.resolve` 函数解析路径

`css-loader` 是第一种方式的一个例子。它替换 `@import` 为 `require` 来声明对其他样式文件的依赖，替换 `url(...)` 为 `require` 引用文件，从而实现转化为 `require` 声明依赖

对于 `less-loader`，他可以转化每个 `@import` 为 `require`，因为所有 `.less` 的文件变量和混合跟踪必须被一次编译。因此 `less-loader` 扩展性低于解析路径函数的方法。利用第二种方式通过 webpack 的 `this.resolve` 解析依赖。

T> 如果语言只接受相对路径（例如 `url(file)` 总是指 `./file`），通过使用 `~` 来指定已安装模块。所以对于 `url`，相当于 `url('~some-library/image.jpg')`

### Common Code 通用代码

避免在每个 loader 中包含通用代码，相反，创建一个运行时文件用 `require` 在 loader 中共享使用。

### Absolute Paths 绝对路径

不要在模块代码中插入绝对路径，因为当项目跟路径变化时，文件绝对路径也会变化。`loader-utils` 中的[`stringifyRequest`]   (https://github.com/webpack/loader-utils#stringifyrequest）方法可以转化绝对路径为相对路径。

### Peer Dependencies 同等依赖

如果你的 loader 简单包裹另外一个包，你应该把这个包作为一个 `peerDependency` 引入。这种方式允许应用开发者在必要情况下，在 `package.json` 中指定特定的包版本。

例如 `sass-loader` [specifies `node-sass`](https://github.com/webpack-contrib/sass-loader/blob/master/package.json)，作为同等依赖引用如下：

``` js
"peerDependencies": {
  "node-sass": "^4.0.0"
}
```


## 测试

当你按照以上规则写了一个 loader，并且可以在本地运行。下一步该做什么呢？让我们用一个简单的单元测试来保证 loader 的正确运行。我们建议使用 [Jest](https://facebook.github.io/jest/) 框架。让我们安装并且保存为 `devDependencies`。

``` bash
npm i --save-dev jest babel-jest babel-preset-env
```

__.babelrc__

``` json
{
  "presets": [[
    "env",
    {
      "targets": {
        "node": "4"
      }
    }
  ]]
}
```

我们的 loader 将会处理 `.txt` 文件，并且简单替换任何实例中的 `[name]` 为 loader 选项中设置的 `name`。然后返回包含默认导出文本的 JavaScript 模块。

__src/loader.js__

``` js
import { getOptions } from 'loader-utils';

export default function loader(source) {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);

  return `export default ${ JSON.stringify(source) }`;
};
```

我们将会使用这个 loader 处理一下文件：

__test/example.txt__

``` text
Hey [name]!
```

关注下一步，我们将会使用 [Node.js API](/api/node)和 [`memory-fs`](https://github.com/webpack/memory-fs) 去执行 webpack。这让我们避免像磁盘写入写出，并允许我们访问获取转换模块的统计数据 `stats`

``` bash
npm i --save-dev webpack memory-fs
```

__test/compiler.js__

``` js
import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.txt$/,
        use: {
          loader: path.resolve(__dirname, '../src/loader.js'),
          options: {
            name: 'Alice'
          }
        }
      }]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
}
```

T> 这种情况下，我们可以内联 webpack 配置，也可以把配置作为参数传给导出的函数。这允许我们使用相同的编译模块测试多个设置。

最后我们我们写测试并且添加 npm script 来运行它。

__test/loader.test.js__

``` js
import compiler from './compiler.js';

test('Inserts name and outputs JavaScript', async () => {
  const stats = await compiler('example.txt');
  const output = stats.toJson().modules[0].source;

  expect(output).toBe(`export default "Hey Alice!\\n"`);
});
```

__package.json__

``` js
"scripts": {
  "test": "jest"
}
```

一切准备好了，我们可以运行它来看新的 loader 是否能通过测试：

``` bash
 PASS  test/loader.test.js
  ✓ Inserts name and outputs JavaScript (229ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.853s, estimated 2s
Ran all test suites.
```

生效了！现在你应该准备好开始开发、测试、部署你的 loaders 了。我们希望你可以在社区分享你的 loader！

***

> 原文：https://webpack.js.org/contribute/how-to-write-a-loader/
