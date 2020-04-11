---
title: react-proxy-loader
source: https://raw.githubusercontent.com/webpack-contrib/react-proxy-loader/master/README.md
edit: https://github.com/webpack-contrib/react-proxy-loader/edit/master/README.md
repo: https://github.com/webpack-contrib/react-proxy-loader
---


[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]

[![chat][chat]][chat-url]



通过将 react 组件包裹在一个代理组件中，来启用代码分离(code splitting)功能，
可以按需加载 react 组件和它的依赖。

## 要求

此模块需要 Node v6.9.0+ 和 webpack v4.0.0+。

## 起步

你需要预先安装 `react-proxy-loader`：

```console
$ npm install react-proxy-loader --save-dev
```

然后，在 `webpack` 配置中添加 loader。例如：

``` js
// 返回代理组件，并按需加载
// webpack 会为此组件和它的依赖创建一个额外的 chunk
const Component = require('react-proxy-loader!./Component');

// 返回代理组件的 mixin
// 可以在这里设置代理组件的加载中状态
const ComponentProxyMixin = require('react-proxy-loader!./Component').Mixin;

const ComponentProxy = React.createClass({
	mixins: [ComponentProxyMixin],
	renderUnavailable: function() {
		return <p>Loading...</p>;
	}
});
```

或者，在配置中指定需要代理的组件：

``` js
// webpack.config.js
module.exports = {
	module: {
		loaders: [
			/* ... */
			{
				test: [
					/component\.jsx$/, // 通过正则表达式(RegExp)匹配选择组件
					/\.async\.jsx$/, // 通过扩展名(extension)匹配选择组件
					"/abs/path/to/component.jsx" // 通过绝对路径(absolute path)匹配选择组件
				],
				loader: "react-proxy-loader"
			}
		]
	}
};
```

或者，在 `name` 查询参数中提供一个 chunk 名称：

``` js
var Component = require("react-proxy-loader?name=chunkName!./Component");
```

然后，通过你偏爱的方式去运行 `webpack`。


## License

#### [MIT](https://raw.githubusercontent.com/webpack-contrib/react-proxy-loader/master/LICENSE)

[npm]: https://img.shields.io/npm/v/react-proxy-loader.svg
[npm-url]: https://npmjs.com/package/react-proxy-loader

[node]: https://img.shields.io/node/v/react-proxy-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/react-proxy-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/react-proxy-loader

[tests]: 	https://img.shields.io/circleci/project/github/webpack-contrib/react-proxy-loader.svg
[tests-url]: https://circleci.com/gh/webpack-contrib/react-proxy-loader

[cover]: https://codecov.io/gh/webpack-contrib/react-proxy-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/react-proxy-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
