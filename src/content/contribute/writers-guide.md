---
title: 作者指引
sort: 2
---

以下部分包含有关编辑和格式化本网站内容的所有必需知识。 确保在开始编辑或添加之前进行一些研究。 有时最难的部分是找到内容应该存在的位置，并确定它是否已经存在。


## 步骤

1. 查看相关的引用文件。
2. 点击`编辑`并展开结构。
3. 修改PR。


## YAML 格式（Frontmatter）

每篇文章在[YAML Frontmatter]（https://jekyllrb.com/docs/frontmatter/ ）的顶部包含的内容：

``` yaml
---
title: My Article
sort: 3
contributors:
  - [github username]
related:
  - title: Title of Related Article
    url: [url of related article]
---
```

让我们来分解这些：

- `标题`：文章的名称。
- `排序`：该部分中文章的顺序。
- `贡献者`：贡献于本文的GitHub用户名列表。
- `相关`：任何相关的阅读或有用的例子。

请注意，`相关内容`将在页面底部生成__深入阅读__部分，`贡献者`将在其下方看到`贡献者`部分。 如果您编辑一篇文章并希望获得认可，请不要犹豫，将您的GitHub用户名添加到`贡献者`列表中。


## 文档结构


1. 简介 - 一个或两个段落，以便您了解关于什么和为什么的基本想法。
2. 概述剩余内容 - 将如何呈现内容。
3. 主要内容 - 告诉你答应说的话。
4. 结论 - 告诉你所讲的并重述要点。


## 规范

- webpack应该总是用小写字母书写。 即使在一句话的开头。（[源（https://github.com/webpack/media#name））
- loaders包含反引号和[kebab-cased]（https://en.wikipedia.org/w/index.php?title=Kebab_case）：`css-loader`，`ts-loader`，...
- plugins包含反引号和[camel-cased]（https://en.wikipedia.org/wiki/Camel_case）：`BannerPlugin`，`NpmInstallWebpackPlugin`，...
- 使用“webpack 2”来引用特定的webpack版本（~~“webpack v2”~~）
- 使用ES5; ES2015，ES2016 ......参照ECMAScript标准（~~ ES6 ~~，~~ ES7 ~~）


## 格式化

### 代码

__语法: \`\`\`javascript … \`\`\`__

```javascript
function foo () {
  return 'bar';
}

foo();
```

### 列表

- Boo
- Foo
- Zoo

列表应按字母顺序排列。

### 表格

参数        | 说明                                              | 类型       | 默认值
----------- | ------------------------------------------------ | ---------- |--------------
--debug     | 切换loaders到调试模式                             | boolean    | false
--devtool   | 定义绑定资源的源映射类型                           | string     | -
--progress  | 百分比打印编译进度                                 | boolean    | false

表格也一样.

### 配置属性

这个[配置](/configuration) 属性也需要按字母顺序排列:

- `devServer.compress`
- `devServer.contentBase`
- `devServer.hot`

### 引用

#### 块引用

**语法: \>**

> 这是一个块引用.

#### 提示

**语法: T\>**

T> 这是一个提示.

**语法: W\>**

W> 这是一个警告.

**语法: ?\>**

?> 这个一个问题.
