---
title: 编写一个 loader
sort: 3
contributors:
  - asulaiman
  - michael-ciniawsky
---

A loader is a node module that exports a function. This function is called when a resource should be transformed by this loader. The given function will have access to the [Loader API](/api/loaders/) using the `this` context provided to it.
插件是导出一个函数的node模块。该函数在loader转换翻译资源的时候调用。给定的函数经通过this上下文访问[Loader API](/api/loaders/)

## Setup

Before we dig into the different types of loaders, their usage, and examples, let's take a look at the three ways you can develop and test a loader locally.

To test a single loader, you can simply use `path` to `resolve` a local file within a rule object:
在深入研究不同loader以及他们的用法和例子之前，我们先看三种本地开发测试的方法。

测试一个单独loader,你可以简单通过在rule对象设置`path.resolve`指向这个本地文件
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

To test multiple, you can utilize the `resolveLoader.modules` configuration to update where webpack will search for loaders. For example, if you had a local `/loaders` directory in your project:
测试多个loaders的使用，你可以利用`resolveLoader.modules`的配置来更新webpack将会搜索寻找的loaders。举例：如果你本地工程有`/loaders` 文件

__webpack.config.js__

``` js
resolveLoader: {
  modules: [
    'node_modules',
    path.resolve(__dirname, 'loaders')
  ]
}
```

Last but not least, if you've already created a separate repository and package for your loader, you could [`npm link`](https://docs.npmjs.com/cli/link) it to the project in which you'd like to test it out.
最后，如果你已经为loader创建了独立的库或者包，你可以使用 [`npm link`](https://docs.npmjs.com/cli/link)，来关联你要测试的项目

## Simple Usage简单使用

When a single loader is applied to the resource, the loader is called with only one parameter -- a string containing the content of the resource file.
当一个loader在资源中使用，这个loader只能传入一个参数————包含资源文件内容的字符串

Synchronous loaders can simply `return` a single value representing the transformed module. In more complex cases, the loader can return any number of values by using the `this.callback(err, values...)` function. Errors are either passed to the `this.callback` function or thrown in a sync loader.
同步loader可以简单的返回一个代表模块的转化后的值。在更复杂的情况下，loader也可以通过使用`this.callback(err, values...)`函数，返回任意数量的值。错误要么传递给这个`this.callback`函数，要么扔进同步loader中。

The loader is expected to give back one or two values. The first value is a resulting JavaScript code as string or buffer. The second optional value is a SourceMap as JavaScript object.
loader会返回一个或者两个值。第一个值类型是JavaScript代码的字符串或者buffer。第二个参数值是SourceMap，他是个JavaScript对象。


## Complex Usage 复杂使用

When multiple loaders are chained, it is important to remember that they are executed in reverse order -- either right to left or bottom to top depending on array format.
当链式调用多个loader的时候，他们会反向执行。根据数组格式，从右向左或者从下向上执行。
- The last loader, called first, will be passed the contents of the raw resource.
- 最后的loader最早调用，将会传入原始资源内容。
- The first loader, called last, is expected to return JavaScript and an optional source map.
- 第一个loader，最后调用，将会传出JavaScript和source map（可选）
- The loaders in between will be executed with the result(s) of the previous loader in the chain.
- 中间的loader执行时被传入之前loader传出的结果

So, in the following example, the `foo-loader` would be passed the raw resource and the `bar-loader` would receive the output of the `foo-loader` and return the final transformed module and a source map if necessary.
所以，在接下来的例子，`foo-loader`被传入原始资源，`bar-loader`将接收`foo-loader`的产出，返回最终转化后的模块和一个source map（可选）
__webpack.config.js__sourp

``` js
{
  test: /\.js/,
  use: [
    'bar-loader',
    'foo-loader'
  ]
}
```


## Guidelines 引导

The following guidelines should be followed when writing a loader. They are ordered in terms of importance and some only apply in certain scenarios, read the detailed sections that follow for more information.
编写loader时应该遵循以下准则。它们按重要性排序，有些仅适用于某些场景，请阅读下面详细的章节以获得更多信息。
- Keep them __simple__.
- Utilize __chaining__.
- Emit __modular__ output.
- Make sure they're __stateless__.
- Employ __loader utilities__.
- Mark __loader dependencies__.
- Resolve __module dependencies__.
- Extract __common code__.
- Avoid __absolute paths__.
- Use __peer dependencies__.
- 简单易用
- 支持链式传递。
- 模块化到的输出
- 确保他们无状态
- 使用__loader utilities__
- 记录loader的依赖
- 解决模块依赖关系
- 提取公共代码。
- 避免绝对路径
- 使用相同依赖

### Simple 简单

Loaders should do only a single task. This not only makes the job of maintaining each loader easier, but also allows them to be chained for usage in more scenarios.
Loaders应该只做单一任务。这不仅使每个loader易维护，也可以在更多场景链式调用。

### Chaining 链式

Take advantage of the fact that loaders can be chained together. Instead of writing a single loader that tackles five tasks, write five simpler loaders that divide this effort. Isolating them not only keeps each individual loader simple, but may allow for them to be used for something you hadn't though of originally.
利用loader可以链式调用的优势。写五个简单的loader实现五项任务，而不是一个loader实现五项任务。功能隔离不仅是loader更简单，也让loader可以使用自己本身不具备的功能。

Take the case of rendering a template file with data specified via loader options or query parameters. It could be written as a single loader that compiles the template from source, executes it and returns a module that exports a string containing the HTML code. However, in accordance with guidelines, a simple `apply-loader` exists that can be chained with other open source loaders:
以通过loader选项或者查询参数得到的数据渲染模板为例。可以把源代码编译为模板，执行并输出包含HTML代码的字符串写到一个loader中。但是根据指南，一个简单的`apply-loader`可以被其它开源loader链式调用。

- `jade-loader`: Convert template to a module that exports a function.
- `apply-loader`: Executes the function with loader options and returns raw HTML.
- `html-loader`: Accepts HTML and outputs a valid JavaScript module.

- `jade-loader`: 导出一个函数，把模板转换为模块 
- `apply-loader`: 根据loader选项执行函数，返回原生HTMl
- `html-loader`: 接收HTMl产出一个有效的模块
T> The fact that loaders can be chained also means they don't necessarily have to output JavaScript. As long as the next loader in the chain can handle its output, the loader can return any type of module.
T>loader可以被链式调用意味着不一定要产出JavaScript。只要下一个loader可以处理这个产出，这个loader就可以返回任意类型的模块。

### Modular 模块化

Keep the output modular. Loader generated modules should respect the same design principles as normal modules.
保证输出模块化。loader生成的模块与普通模块遵循相同的原则。

### Stateless 无状态

Make sure the loader does not retain state between module transformations. Each run should always be independent of other compiled modules as well as previous compilations of the same module.
确保laoder在模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果。

### Loader Utilities loader工具库

Take advantage of the [`loader-utils`](https://github.com/webpack/loader-utils) package. It provides a variety of useful tools but one of the most common is retrieving the options passed to the loader. Along with `loader-utils`, the [`schema-utils`](https://github.com/webpack-contrib/schema-utils) package should be used for consistent JSON Schema based validation of loader options. Here's a brief example that utilizes both:
充分利用[`loader-utils`](https://github.com/webpack/loader-utils)包。它提供了许多有用的工具，但最常用的一种方法是获取传递给loader的选项。
[`schema-utils`](https://github.com/webpack-contrib/schema-utils)包配合`loader-utils`，基于对loader选项的验证，用于JSON Schema一致性。这有一个简单使用两者的例子：
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

### Loader Dependencies loader依赖

If a loader uses external resources (i.e. by reading from filesystem), they __must__ indicate it. This information is used to invalidate cacheable loaders and recompile in watch mode. Here's a brief example of how to accomplish this using the `addDependency` method:
如果一个loader使用拓展资源（例如 从文件系统读取），必须声明它。这些信息在观察模式用于无效缓存loaders和重编译。这有一个关于如何使用`addDependency`方法的例子；
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

### Module Dependencies 模块依赖

Depending the type of module, there may be a different schema used to specify dependencies. In CSS for example, the `@import` and `url(...)` statements are used. These dependencies should be resolved by the module system.

This can be done in one of two ways:

- By transforming them to `require` statements.
- Using the `this.resolve` function to resolve the path.

The `css-loader` is a good example of the first approach. It transforms dependencies to `require`s, by replacing `@import` statements with a `require` to the other stylesheet and `url(...)` with a `require` to the referenced file.

In the case of the `less-loader`, it cannot transform each `@import` to a `require` because all `.less` files must be compiled in one pass for variables and mixin tracking. Therefore, the `less-loader` extends the less compiler with custom path resolving logic. It then takes advantage of the second approach, `this.resolve`, to resolve the dependency through webpack.

T> If the language only accepts relative urls (e.g. `url(file)` always refers to `./file`), you can use the `~` convention to specify references to installed modules (e.g. those in `node_modules`). So, in the case of `url`, that would look something like `url('~some-library/image.jpg')`.

### Common Code通用代码

Avoid generating common code in every module the loader processes. Instead, create a runtime file in the loader and generate a `require` to that shared module.

### Absolute Paths 绝对路径

Don't insert absolute paths into the module code as they break hashing when the root for the project is moved. There's a [`stringifyRequest`](https://github.com/webpack/loader-utils#stringifyrequest) method in `loader-utils` which can be used to convert an absolute path to a relative one.

### Peer Dependencies

If the loader you're working on is a simple wrapper around another package, then you should include the package as a `peerDependency`. This approach allows the application's developer to specify the exact version in the `package.json` if desired.

For instance, the `sass-loader` [specifies `node-sass`](https://github.com/webpack-contrib/sass-loader/blob/master/package.json) as peer dependency like so:

``` js
"peerDependencies": {
  "node-sass": "^4.0.0"
}
```


## Testing

So you've written a loader, followed the guidelines above, and have it set up to run locally. What's next? Let's go through a simple unit testing example to ensure our loader is working the way we expect. We'll be using the [Jest](https://facebook.github.io/jest/) framework to do this. We'll also install `babel-jest` and some presets that will allow us to use the `import` / `export` and `async` / `await`. Let's start by installing and saving these as a `devDependencies`:

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

Our loader will process `.txt` files and simply replace any instance of `[name]` with the `name` option given to the loader. Then it will output a valid JavaScript module containing the text as it's default export:

__src/loader.js__

``` js
import { getOptions } from 'loader-utils';

export default source => {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);

  return `export default ${ JSON.stringify(source) }`;
};
```

We'll use this loader to process the following file:

__test/example.txt__

``` text
Hey [name]!
```

Pay close attention to this next step as we'll be using the [Node.js API](/api/node) and [`memory-fs`](https://github.com/webpack/memory-fs) to execute webpack. This lets us avoid emitting `output` to disk and will give us access to the `stats` data which we can use to grab our transformed module:

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

T> In this case, we've inlined our webpack configuration but you can also accept a configuration as a parameter to the exported function. This would allow you to test multiple setups using the same compiler module.

And now, finally, we can write our test and add an npm script to run it:

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

With everything in place, we can run it and see if our new loader passes the test:

``` bash
 PASS  test/loader.test.js
  ✓ Inserts name and outputs JavaScript (229ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.853s, estimated 2s
Ran all test suites.
```

It worked! At this point you should be ready to start developing, testing, and deploying your own loaders. We hope that you'll share your creations with the rest of the community!

***

> 原文：https://webpack.js.org/contribute/how-to-write-a-loader/
