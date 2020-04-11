---
title: 开发中 server(devServer)
sort: 9
contributors:
  - sokra
  - skipjack
  - spacek33z
  - charlespwd
  - orteth01
  - byzyk
  - EugeneHlushko
  - Yiidiir
---

[webpack-dev-server](https://github.com/webpack/webpack-dev-server) 能够用于快速开发应用程序。起步请查看 [开发](/guides/development/) 指南。

此页面描述影响 webpack-dev-server(简写为：dev-server) 行为的选项。

T> 与 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 兼容的选项旁边有 🔑。


## `devServer`

`object`

通过来自 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 的这些选项，能够用多种方式改变其行为。这里有一个简单的例子，会 gzip(压缩) 和 serve(服务) 所有来自项目根路径下 `dist/` 目录的文件：

__webpack.config.js__

```javascript
var path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
```

当服务器启动时，在解析模块列表之前会有一条消息：

```bash
http://localhost:9000/
webpack 的服务路径是 /build/
非 webpack 的内容的服务路径是 /path/to/dist/
```

这将给出一些背景知识，就能知道服务器的访问位置，并且知道服务已启动。

如果你通过 Node.js API 来使用 dev-server， `devServer` 中的选项将被忽略。将选项作为第二个参数传入： `new WebpackDevServer(compiler, {...})`。关于如何通过 Node.js API 使用 webpack-dev-server 的示例，请 [查看此处](https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple)。

W> 请注意，在 [导出多个配置](/configuration/configuration-types/#exporting-multiple-configurations) 时，只会使用第一个配置中的 devServer 选项，并将其用于数组中的其他所有配置。

T> 如果遇到问题，导航到 `/webpack-dev-server` 路径，可以显示出文件的服务位置。 例如，`http://localhost:9000/webpack-dev-server`。

## `devServer.after`

`function (app, server)`

在服务内部的所有其他中间件之后，
提供执行自定义中间件的功能。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    after: function(app, server) {
      // 做些有趣的事
    }
  }
};
```

## `devServer.allowedHosts`

`array`

此选项允许你添加白名单服务，允许一些开发服务器访问。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    allowedHosts: [
      'host.com',
      'subdomain.host.com',
      'subdomain2.host.com',
      'host2.com'
    ]
  }
};
```

模仿 django 的 `ALLOWED_HOSTS`，以 `.` 开头的值可以用作子域通配符。`.host.com` 将会匹配 `host.com`, `www.host.com` 和 `host.com` 的任何其他子域名。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    // 这实现了与第一个示例相同的效果，
    // 如果新的子域名需要访问 dev server，
    // 则无需更新您的配置
    allowedHosts: [
      '.host.com',
      'host2.com'
    ]
  }
};
```

想要在 CLI 中使用这个选项，请向 `--allowed-hosts` 选项传入一个以逗号分隔的字符串。

```bash
webpack-dev-server --entry /entry/file --output-path /output/path --allowed-hosts .host.com,host2.com
```

## `devServer.before`

`function (app, server)`

在服务内部的所有其他中间件之前，
提供执行自定义中间件的功能。
这可以用来配置自定义处理程序，例如：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    before: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```

## `devServer.bonjour`

此选项在启动时，通过 [ZeroConf](http://www.zeroconf.org/) 网络广播服务

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    bonjour: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --bonjour
```


## `devServer.clientLogLevel`

`string: 'none' | 'info' | 'error' | 'warning'`

当使用*内联模式(inline mode)*时，会在开发工具(DevTools)的控制台(console)显示消息，例如：在重新加载之前，在一个错误之前，或者 [模块热替换(Hot Module Replacement)](/concepts/hot-module-replacement/) 启用时。默认值是 `info`。

`devServer.clientLogLevel` 可能会显得很繁琐，你可以通过将其设置为  `'none'` 来关闭 log。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    clientLogLevel: 'none'
  }
};
```

CLI 用法

```bash
webpack-dev-server --client-log-level none
```

## `devServer.color` - 只用于命令行工具(CLI)

`boolean`

启用/禁用控制台的彩色输出。

```bash
webpack-dev-server --color
```


## `devServer.compress`

`boolean`

一切服务都启用 [gzip 压缩](https://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/)：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    compress: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --compress
```


## `devServer.contentBase`

`boolean: false` `string` `[string]` `number`

告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。[`devServer.publicPath`](#devserver-publicpath-) 将用于确定应该从哪里提供 bundle，并且此选项优先。

T> 推荐使用一个绝对路径。

默认情况下，将使用当前工作目录作为提供内容的目录。将其设置为 `false` 以禁用 `contentBase`。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};
```

也可以从多个目录提供内容：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
  }
};
```

CLI 用法

```bash
webpack-dev-server --content-base /path/to/content/dir
```


## `devServer.disableHostCheck`

`boolean`

设置为 `true` 时，此选项绕过主机检查。__不建议这样做__，因为不检查主机的应用程序容易受到 DNS 重新连接攻击。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    disableHostCheck: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --disable-host-check
```


## `devServer.filename` 🔑

`string`

在 [lazy mode(惰性模式)](#devserver-lazy-) 中，此选项可减少编译。
默认在 [lazy mode(惰性模式)](#devserver-lazy-)，每个请求结果都会产生全新的编译。使用 `filename`，可以只在某个文件被请求时编译。

如果 [`output.filename`](/configuration/output/#output-filename) 设置为 `'bundle.js'` ，`devServer.filename` 用法如下：

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    lazy: true,
    filename: 'bundle.js'
  }
};
```

现在只有在请求 `/bundle.js` 时候，才会编译 bundle。

T> `filename` 在不使用 [lazy mode(惰性模式)](#devserver-lazy-) 时没有效果。


## `devServer.headers` 🔑

`object`

在所有响应中添加首部内容：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    headers: {
      'X-Custom-Foo': 'bar'
    }
  }
};
```


## `devServer.historyApiFallback`

`boolean` `object`

当使用 [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 时，任意的 `404` 响应都可能需要被替代为 `index.html`。`devServer.historyApiFallback` 默认禁用。通过传入以下启用：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: true
  }
};
```

通过传入一个对象，比如使用 `rewrites` 这个选项，此行为可进一步地控制：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    }
  }
};
```

当路径中使用点(dot)（常见于 Angular），你可能需要使用 `disableDotRule`：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      disableDotRule: true
    }
  }
};
```

CLI 用法

```bash
webpack-dev-server --history-api-fallback
```

更多选项和信息，查看 [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) 文档。


## `devServer.host`

`string`

指定使用一个 host。默认是 `localhost`。如果你希望服务器外部可访问，指定如下：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    host: '0.0.0.0'
  }
};
```

CLI 用法

```bash
webpack-dev-server --host 0.0.0.0
```


## `devServer.hot`

`boolean`

启用 webpack 的 [模块热替换](/concepts/hot-module-replacement/) 功能：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    hot: true
  }
};
```

T> 注意，必须有 [`webpack.HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin/) 才能完全启用 HMR。如果 `webpack` 或 `webpack-dev-server` 是通过 `--hot` 选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到 `webpack.config.js` 中。关于更多信息，请查看 [HMR 概念](/concepts/hot-module-replacement/) 页面。


## `devServer.hotOnly`

`boolean`

Enables Hot Module Replacement (see [`devServer.hot`](#devserver-hot)) without page refresh as fallback in case of build failures.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    hotOnly: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --hot-only
```


## `devServer.https`

`boolean` `object`

默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    https: true
  }
};
```

以上设置使用了自签名证书，但是你可以提供自己的：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

此对象直接传递到 Node.js HTTPS 模块，所以更多信息请查看 [HTTPS 文档](https://nodejs.org/api/https.html)。

CLI 用法

```bash
webpack-dev-server --https
```

想要向 CLI 传入你自己的证书，请使用以下选项

```bash
webpack-dev-server --https --key /path/to/server.key --cert /path/to/server.crt --cacert /path/to/ca.pem
```

## `devServer.index`

`string`

被作为索引文件的文件名。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    index: 'index.html'
  }
};
```


## `devServer.info` - 只用于命令行工具(CLI)

`boolean`

输出 cli 信息。默认启用。

```bash
webpack-dev-server --info=false
```


## `devServer.inline`

`boolean`

在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用_内联模式(inline mode)_。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。

也可以使用 __iframe 模式__，它在通知栏下面使用 `<iframe>` 标签，包含了关于构建的消息。切换到 __iframe 模式__：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    inline: false
  }
};
```

CLI 用法

```bash
webpack-dev-server --inline=false
```

T> 推荐使用 [模块热替换](/plugins/hot-module-replacement-plugin/) 的内联模式，因为它包含来自 websocket 的 HMR 触发器。轮询模式可以作为替代方案，但需要一个额外的入口点：`'webpack/hot/poll?1000'`。


## `devServer.lazy` 🔑

`boolean`

当启用 `devServer.lazy` 时，dev-server 只有在请求时才编译包(bundle)。这意味着 webpack 不会监视任何文件改动。我们称之为__惰性模式__。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    lazy: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --lazy
```

T> [`watchOptions`](#devserver-watchoptions-) 在使用__惰性模式__时无效。

T> 如果使用命令行工具(CLI)，请确保__内联模式(inline mode)__被禁用。


## `devServer.noInfo` 🔑

`boolean`

告诉 dev-server 隐藏 webpack bundle 信息之类的消息。`devServer.noInfo` 默认禁用。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    noInfo: true
  }
};
```


## `devServer.open`

`boolean` `string`

告诉 dev-server 在 server 启动后打开浏览器。默认禁用。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    open: true
  }
};
```

If no browser is provided (as shown above), your default browser will be used. To specify a different browser, just pass its name instead of boolean:

```javascript
module.exports = {
  //...
  devServer: {
    open: 'Google Chrome'
  }
};
```

CLI 用法

```bash
webpack-dev-server --open
```

Or with specified browser:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    open: 'Chrome'
  }
};
```

And via the CLI

```bash
webpack-dev-server --open 'Chrome'
```

T> The browser application name is platform dependent. Don't hard code it in reusable modules. For example, `'Chrome'` is Google Chrome on macOS, `'google-chrome'` on Linux and `'chrome'` on Windows.


## `devServer.openPage`

`string`

指定打开浏览器时的导航页面。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    openPage: '/different/page'
  }
};
```

CLI 用法

```bash
webpack-dev-server --open-page "/different/page"
```


## `devServer.overlay`

`boolean` `object: { boolean errors, boolean warnings }`

当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。如果你想要只显示编译器错误：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    overlay: true
  }
};
```

如果想要显示警告和错误：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
```


## `devServer.pfx`

`string`

当CLI 用法时，路径是一个 .pfx 后缀的 SSL 文件。如果用在选项中，它应该是 .pfx 文件的字节流(bytestream)。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    pfx: '/path/to/file.pfx'
  }
};
```

CLI 用法

```bash
webpack-dev-server --pfx /path/to/file.pfx
```


## `devServer.pfxPassphrase`

`string`

SSL PFX文件的密码。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    pfxPassphrase: 'passphrase'
  }
};
```

CLI 用法

```bash
webpack-dev-server --pfx-passphrase passphrase
```


## `devServer.port`

`number`

指定要监听请求的端口号：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    port: 8080
  }
};
```

CLI 用法

```bash
webpack-dev-server --port 8080
```


## `devServer.proxy`

`object` `[object, function]`

如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。

dev-server 使用了非常强大的 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 包。更多高级用法，请查阅其 [文档](https://github.com/chimurai/http-proxy-middleware#options)。Note that some of `http-proxy-middleware`'s features do not require a `target` key, e.g. its `router` feature, but you will still need to include a `target` key in your config here, otherwise `webpack-dev-server` won't pass it along to `http-proxy-middleware`).

在 `localhost:3000` 上有后端服务的话，你可以这样启用代理：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```

请求到 `/api/users` 现在会被代理到请求 `http://localhost:3000/api/users`。

如果你不想始终传递 `/api` ，则需要重写路径：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
```

默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，修改配置如下：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false
      }
    }
  }
};
```

有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。

在函数中你可以访问请求体、响应体和代理选项。必须返回 `false` 或路径，来跳过代理请求。

例如：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。你可以这样做：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
};
```

如果你想要代理多个路径特定到同一个 target 下，你可以使用由一个或多个「具有 `context` 属性的对象」构成的数组：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: [{
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }]
  }
};
```

注意，默认情况下，根请求不会被代理。要启用根代理，应该将 `devServer.index` 选项指定为 false 值：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    index: '', // specify to enable root proxying
    host: '...',
    contentBase: '...',
    proxy: {
      context: () => true,
      target: 'http://localhost:1234'
    }
  }
};
```

The origin of the host header is kept when proxying by default, you can set `changeOrigin` to `true` to override this behaviour. It is useful in some cases like using [name-based virtual hosted sites](https://en.wikipedia.org/wiki/Virtual_hosting#Name-based).

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

## `devServer.progress` - 只用于命令行工具(CLI)

`boolean`

将运行进度输出到控制台。

```bash
webpack-dev-server --progress
```


## `devServer.public`

`string`

当使用_内联模式(inline mode)_并代理 dev-server 时，内联的客户端脚本并不总是知道要连接到什么地方。它会尝试根据 `window.location` 来猜测服务器的 URL，但是如果失败，你需要使用这个配置。

例如，dev-server 被代理到 nginx，并且在 `myapp.test` 上可用：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    public: 'myapp.test:80'
  }
};
```

CLI 用法

```bash
webpack-dev-server --public myapp.test:80
```


## `devServer.publicPath` 🔑

`string`

此路径下的打包文件可在浏览器中访问。

假设服务器运行在 `http://localhost:8080` 并且 [`output.filename`](/configuration/output/#output-filename) 被设置为 `bundle.js`。默认 `devServer.publicPath` 是 `'/'`，所以你的包(bundle)可以通过 `http://localhost:8080/bundle.js` 访问。

修改 `devServer.publicPath`，将 bundle 放在指定目录下：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: '/assets/'
  }
};
```

现在可以通过 `http://localhost:8080/assets/bundle.js` 访问 bundle。

T> 确保 `devServer.publicPath` 总是以斜杠(/)开头和结尾。

也可以使用一个完整的 URL。这是 [模块热替换](/concepts/hot-module-replacement/) 所必需的。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: 'http://localhost:8080/assets/'
  }
};
```

可以通过 `http://localhost:8080/assets/bundle.js` 访问 bundle。

T> `devServer.publicPath` 和 [`output.publicPath`](/configuration/output/#output-publicpath) 一样被推荐。


## `devServer.quiet` 🔑

`boolean`

启用 `devServer.quiet` 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    quiet: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --quiet
```


## `devServer.setup`

`function (app, server)`

W> 此选项__已废弃_，并将在 v3.0.0 中被删除。应当使用 [`devServer.before`](#devserver-before)。

这里你可以访问 Express 应用程序对象，并且添加你的自定义中间件。
例如，想要为一些路径定义自定义处理函数：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    setup: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```


## `devServer.socket`

`string`

用于监听的 Unix socket（而不是 host）。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    socket: 'socket'
  }
};
```

CLI 用法

```bash
webpack-dev-server --socket socket
```


## `devServer.staticOptions`

可以用于对 `contentBase` 路径下提供的静态文件，进行高级选项配置。有关可能的选项，请查看 [Express文档](http://expressjs.com/en/4x/api.html#express.static)。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    staticOptions: {
      redirect: false
    }
  }
};
```

T> 这只有在使用 [`devServer.contentBase`](#devserver-contentbase) 是一个 `string` 时才有效。


## `devServer.stats` 🔑

`string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose'` `object`

通过此选项，可以精确控制要显示的 bundle 信息。如果你想要显示一些打包信息，但又不是显示全部，这可能是一个不错的妥协。

想要在 bundle 中只显示错误：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    stats: 'errors-only'
  }
};
```

关于更多信息，请查看 [__stats 文档__](/configuration/stats)。

T> 此选项在配置 `quiet` 或 `noInfo` 时无效。


## `devServer.stdin` - 只用于命令行工具(CLI)

`boolean`

此选项在 stdin 结束时关闭服务。

```bash
webpack-dev-server --stdin
```


## `devServer.useLocalIp`

`boolean`

此选项允许浏览器使用本地 IP 打开。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    useLocalIp: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --useLocalIp
```


## `devServer.watchContentBase`

`boolean`

告知 dev-server，serve(服务) [`devServer.contentBase`](#devserver-contentbase) 选项下的文件。开启此选项后，在文件修改之后，会触发一次完整的页面重载。

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    watchContentBase: true
  }
};
```

CLI 用法

```bash
webpack-dev-server --watch-content-base
```


## `devServer.watchOptions` 🔑

`object`

与监视文件相关的控制选项。

webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。[Vagrant](https://www.vagrantup.com/) 也有很多问题。在这些情况下，请使用轮询：

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    watchOptions: {
      poll: true
    }
  }
};
```

如果这对文件系统来说太重了的话，你可以修改间隔时间（以毫秒为单位），将其设置为一个整数。

更多选项请查看 [WatchOptions](/configuration/watch)。


## `devServer.writeToDisk` 🔑

`boolean: false` `function (filePath)`

Tells `devServer` to write generated assets to the disk.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: true
  }
};
```

Providing a `Function` to `devServer.writeToDisk` can be used for filtering. The function follows the same premise as [`Array#filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) in which a boolean return value tells if the file should be written to disk.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: (filePath) => {
      return /superman\.css$/.test(filePath);
    }
  }
};
```
