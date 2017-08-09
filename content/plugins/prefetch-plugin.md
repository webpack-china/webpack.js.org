---
title: PrefetchPlugin
contributors:
  - skipjack
---

预取插件(PrefetchPlugin)
对一些模块的预取请求，可以让这些模块在他们被`import`或者是`require`之前就解析并且编译。使用这个预取插件可以提升性能。可以多试试在编译前记录时间(profile)来决定最佳的预取的节点。
``` javascript
new webpack.PrefetchPlugin([context], request)
```


## Options

选项
- `上下文(context)`: 文件夹的绝对地址
- `请求(request)`: 对普通模块的请求字符串
