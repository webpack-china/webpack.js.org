---
title: istanbul-instrumenter-loader
source: https://raw.githubusercontent.com/webpack-contrib/istanbul-instrumenter-loader/master/README.md
edit: https://github.com/webpack-contrib/istanbul-instrumenter-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/istanbul-instrumenter-loader
---


使用 [istanbul-lib-instrument](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-lib-instrument) 来测试 `JS` 文件，以生成后续代码覆盖率报告

## 安装 {#install}

```bash
npm i -D istanbul-instrumenter-loader
```

## <a href="https://webpack.js.org/concepts/loaders">用法</a> {#a-hrefhttpswebpackjsorgconceptsloadersusagea}

### `参考` {#references}

* [karma-webpack](https://github.com/webpack/karma-webpack)
* [karma-coverage-istanbul-reporter](https://github.com/mattlewis92/karma-coverage-istanbul-reporter)

### `结构` {#structure}

```
├─ src
│ |– components
│ | |– bar
│ | │ |─ index.js
│ | |– foo/
│     |– index.js
|– test
| |– src
| | |– components
| | | |– foo
| | | | |– index.js
```

为生成所有组件（包括您没写测试的那些）的代码覆盖率报告，你需要 require 所有业务和测试的代码。相关内容在 [karma-webpack 其它用法](https://github.com/webpack/karma-webpack#alternative-usage) 有涉及。 

**test/index.js**
```js
// requires all tests in `project/test/src/components/**/index.js`
const tests = require.context('./src/components/', true, /index\.js$/);

tests.keys().forEach(tests);

// requires all components in `project/src/components/**/index.js`
const components = require.context('../src/components/', true, /index\.js$/);

components.keys().forEach(components);
```

> ℹ️   以下为  `karma`  的唯一入口起点文件 

**karma.conf.js**
```js
config.set({
  ...
  files: [
    'test/index.js'
  ],
  preprocessors: {
    'test/index.js': 'webpack'
  },
  webpack: {
    ...
    module: {
      rules: [
        // instrument only testing sources with Istanbul
        {
          test: /\.js$/,
          use: { loader: 'istanbul-instrumenter-loader' },
          include: path.resolve('src/components/')
        }
      ]
    }
    ...
  },
  reporters: [ 'progress', 'coverage-istanbul' ],
  coverageIstanbulReporter: {
    reports: [ 'text-summary' ],
    fixWebpackSourcePaths: true
  }
  ...
});
```

### 使用 `Babel` {#with-babel}

您必须将该检测作为后续步骤运行

**webpack.config.js**
```js
{
  test: /\.js$|\.jsx$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  },
  enforce: 'post',
  exclude: /node_modules|\.spec\.js$/,
}
```

## <a href="https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-lib-instrument/api.md#instrumenter">选项</a> {#a-hrefhttpsgithubcomistanbuljsistanbuljsblobmasterpackagesistanbul-lib-instrumentapimdinstrumenteroptionsa}

 此 loader 支持  `istanbul-lib-instrument`  的所有配置选项 

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`debug`**|`{Boolean}`|`false`|打开调试模式|
|**`compact`**|`{Boolean}`|`true`|生成紧凑的代码|
|**`autoWrap`**|`{Boolean}`|`false`|设置为 `true` 以允许函数外的返回语句|
|**`esModules`**|`{Boolean}`|`false`|设置为 `true` 以检测ES2015模块|
|**`coverageVariable`**|`{String}`|`__coverage__`|全局覆盖变量的名称|
|**`preserveComments`**|`{Boolean}`|`false`|保留输出中的注释|
|**`produceSourceMap`**|`{Boolean}`|`false`|设置为 `true` 以生成已检测代码的 `source map`|
|**`sourceMapUrlCallback`**|`{Function}`|`null`|在原始代码中找到源映射 `URL` 时调用的回调函数，使用源文件名和源映射 `URL` 调用此函数|

**webpack.config.js**
```js
{
  test: /\.js$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: {...options}
  }
}
```

## Maintainers {#maintainers}

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/u/266822?v=3&s=150">
        </br>
        <a href="https://github.com/deepsweet">Kir Belevich</a>
      </td>
      <td align="center">
        <a href="https://github.com/bebraw">
          <img width="150" height="150" src="https://github.com/bebraw.png?v=3&s=150">
          </br>
          Juho Vepsäläinen
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/d3viant0ne">
          <img width="150" height="150" src="https://github.com/d3viant0ne.png?v=3&s=150">
          </br>
          Joshua Wiens
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/michael-ciniawsky">
          <img width="150" height="150" src="https://github.com/michael-ciniawsky.png?v=3&s=150">
          </br>
          Michael Ciniawsky
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/mattlewis92">
          <img width="150" height="150" src="https://github.com/mattlewis92.png?v=3&s=150">
          </br>
          Matt Lewis
        </a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/istanbul-instrumenter-loader.svg
[npm-url]: https://npmjs.com/package/istanbul-instrumenter-loader

[node]: https://img.shields.io/node/v/istanbul-instrumenter-loader.svg
[node-url]: https://nodejs.org/

[deps]: https://david-dm.org/webpack-contrib/istanbul-instrumenter-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/istanbul-instrumenter-loader

[tests]: http://img.shields.io/travis/webpack-contrib/istanbul-instrumenter-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/istanbul-instrumenter-loader

[cover]: https://codecov.io/gh/webpack-contrib/istanbul-instrumenter-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/istanbul-instrumenter-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
