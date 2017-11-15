---
title: 集成(Integrations)
sort: 25
contributors:
  - pksjce
  - bebraw
  - tashian
  - skipjack
---

首先我们要消除一个常见的误解。webpack 是一个模块打包器(module bundler)（例如，[Browserify](http://browserify.org/) 或 [Brunch](http://brunch.io/)）。它不是一个任务执行器(task runner)（例如，[Make](https://www.gnu.org/software/make/), [Grunt](https://gruntjs.com/) 或者 [Gulp](https://gulpjs.com/) ）。任务执行器就是用来自动化处理常见的开发任务，例如项目的检查(lint)、构建(build)、测试(test)。相对于*打包器(bundler)*，任务执行器则聚焦在偏重上层的问题上面。你可以得益于，使用上层的工具，而将打包部分的问题留给 webpack。

打包器(bundler)帮助您取得准备用于部署的 JavaScript 和样式表，将它们转换为适合浏览器的可用格式。例如，JavaScript 可以[压缩](/plugins/uglifyjs-webpack-plugin)、[拆分 chunk](/guides/code-splitting) 和[懒加载](/guides/lazy-loading)，以提高性能。打包是 web 开发中最重要的挑战之一，解决此问题可以消除开发过程中的大部分痛点。

好消息是，虽然有一些功能重复，但如果以正确的方式处理，任务运行器和模块打包器能够一起协同工作。本指南提供了关于如何将 webpack 与一些流行的任务运行器集成在一起的高度概述。


## NPM Scripts

通常 webpack 用户使用 npm [`scripts`](https://docs.npmjs.com/misc/scripts) 来作为任务执行器。这是比较好的开始。然而跨平台支持是一个问题，为此有一些解决方案。许多用户，但不是大多数用户，直接使用 npm `scripts` 和各种级别的 webpack 配置和工具，来应对构建任务。

因此，当 webpack 的核心焦点专注于打包时，有多种扩展可以供你使用，可以将其用于任务运行者常见的工作。集成一个单独的工具会增加复杂度，所以一定要权衡集成前后的利弊。


## Grunt

对于那些使用Grunt的人，我们推荐使用 [`grunt-webpack`](https://www.npmjs.com/package/grunt-webpack) 软件包。使用 `grunt-webpack` 你可以运行 webpack或 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 作为一项任务，访问[模板标签](https://gruntjs.com/api/grunt.template)中的统计信息，拆分开发和生产配置等等。如果您尚未安装 `grunt-webpack` 以及 `webpack` 本身，请首先安装：

``` bash
npm i --save-dev grunt-webpack webpack
```

然后注册一个配置并加载任务：

__Gruntfile.js__

``` js
const webpackConfig = require('./webpack.config.js');

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      },
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig)
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
};
```

获取更多信息，请查看[知识库](https://github.com/webpack-contrib/grunt-webpack)。


## Gulp

在 [`webpack-stream`](https://github.com/shama/webpack-stream)包（a.k.a. `gulp-webpack`） 的帮助下，Gulp也可以很方便的完成集成。在这种情况下，不需要单独安装 `webpack` ，因为它是`webpack-stream`的直接依赖：

``` bash
npm i --save-dev webpack-stream
```

只需要把 `webpack`（'webpack-stream'）替换为 `require('webpack-stream')`，并传递一个配置文件就可以了：

__gulpfile.js__

``` js
var gulp = require('gulp');
var webpack = require('webpack-stream');
gulp.task('default', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack({
      // 一些配置选项……
    }))
    .pipe(gulp.dest('dist/'));
});
```

获取更多信息，请查看[知识库](https://github.com/shama/webpack-stream)。

## Mocha

[`mocha-webpack`](https://github.com/zinserjan/mocha-webpack) 可以用来与 Mocha 整合。
知识库提供了很多关于工具优缺点的细节，但 `mocha-webpack` 还算一个简单的封装，提供与 Mocha 几乎相同的CLI，并提供各种 webpack 功能，如改进了 watch 模式和优化了路径的分析。这里是一个如何安装并使用它来运行测试套件的小例子（在./test中找到）：

``` bash
npm i --save-dev webpack mocha mocha-webpack
mocha-webpack 'test/**/*.js'
```

获取更多信息，请查看[知识库](https://github.com/zinserjan/mocha-webpack)。


## Karma

[`karma-webpack`](https://github.com/webpack-contrib/karma-webpack) 软件包允许您使用webpack预处理 [Karma](http://karma-runner.github.io/1.0/index.html) 中的文件。它也可以使用[`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware)，并允许传递两者的配置。下面是一个简单的例子：

``` bash
npm i --save-dev webpack karma karma-webpack
```

__karma.conf.js__

``` js
module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/*_test.js', watched: false },
      { pattern: 'test/**/*_test.js', watched: false }
    ],
    preprocessors: {
      'test/*_test.js': [ 'webpack' ],
      'test/**/*_test.js': [ 'webpack' ]
    },
    webpack: {
      // 一些自定义的webpack配置……
    },
    webpackMiddleware: {
      // 一些定制的webpack-dev-middleware配置……
    }
  });
};
```

获取更多信息，请访问[源码库](https://github.com/webpack-contrib/karma-webpack)。
