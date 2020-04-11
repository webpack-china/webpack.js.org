---
title: multi-loader
source: https://raw.githubusercontent.com/webpack-contrib/multi-loader/master/README.md
edit: https://github.com/webpack-contrib/multi-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/multi-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![chat][chat]][chat-url]



用于分离模块和组合使用多个 loader 的 `webpack` loader。
这个 loader 会多次引用一个模块，每次不同的 loader 加载这个模块，
就像下面配置中定义的那样。

_注意：在多入口，最后一项的 exports 会被导出。_

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `multi-loader`：

```console
$ npm install multi-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

```js
// webpack.config.js
const multi = require('multi-loader');
{
	module: {
		loaders: [
			{
				test: /\.css$/,
				// 向 DOM 中添加 CSS，然后返回原始内容
				loader: multi(
					'style-loader!css-loader!autoprefixer-loader',
					'raw-loader'
				)
			}
		]
	}
}
```

然后，通过你偏爱的方式去运行 `webpack`。

## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/multi-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/multi-loader.svg
[npm-url]: https://npmjs.com/package/multi-loader

[node]: https://img.shields.io/node/v/multi-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/multi-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/multi-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/multi-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/multi-loader

[cover]: https://codecov.io/gh/webpack-contrib/multi-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/multi-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
