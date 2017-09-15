---
title: 概念术语
contributors:
  - rouzbeh84
  - bebraw
  - skipjack
---

该索引列出了在整个 Webpack 生态系统中共同使用的术语。


## A

- [**资源(Asset)**](/guides/asset-management/): 这是一个普遍的术语，用于图片、字体、媒体，还有一些其他类型的文件，常用在网站和其他应用程序。这些文件通常最终在[输出(output )](/glossary#o) 中成为单个文件，但也可以通过一些东西内联，像 [style-loader](/loaders/style-loader) 或者 [url-loader](/loaders/url-loader) .

## B

- [**包(Bundle)**](/guides/getting-started/#creating-a-bundle): 由多个不同的模块生成，bundles 包含了早已经过加载和编译的最终源文件版本。
- [**包分离(Bundle Splitting)**](/guides/code-splitting): 这个流程提供一个优化build的方法，允许 webpack 为应用程序生成多个包( bundles )。结果是，
每个包( bundles )可以从依赖中分离，减少需要重新发布的代码量，因此由客户端重新下载并利用浏览器缓存。

## C

- **块( Chunk )**: 这是 webpack 特有的术语被用在内部来管理 building 过程。包文件(Bundles)由块组成，其中有几种类型（比如入口和子后代(child)）。通常块(chunks)会直接对应包文件(bundles)，但是有一些配置并不会产生一对一的关系。
- [**代码分割(Code Splitting)**](/guides/code-splitting/): 指分割你的代码到每个包文件/块(bundles/chunks)里面，你可以按需加载，而不是加载一个包含全部的打包文件。
- [**配置(Configuration)**](/concepts/configuration/): webpack 的配置文件是一个普通的 JavaScript 文件，它输出一个对象。该对象然后由 webpack 根据其定义的属性进行处理。

## D

- [**依赖关系图(Dependency Graph)**](/concepts/dependency-graph): 有时候一个文件依赖于其他文件，webpack 将其视为*依赖关系*(*dependency*)。从一个或多个入口点开始，webpack 递归构建一个依赖关系图，里面包含了你的应用程序需要的所有模块/资源(mudule/asset)。


## E

- [**入口点(Entry Point)**](/concepts/entry-points): 入口点可以告诉 webpack 从哪里启动以及遵循依赖关系图，以此知道要打包什么东西。你可以考虑将待打包文件的根目录作为你应用程序的入口点。


## F

## G

## H

- [**热模块替换(Hot Module Replacement(HMR))**](/concepts/hot-module-replacement): 一个改变，添加或删除模块(`modules`)的过程中，正在运行的应用程序不需要重载整个页面。


## I

## J

## K

## L

- [**加载器(Loaders)**](/concepts/loaders): 应用于模块源代码的转换。它们允许你预处理 `require()` 或“加载”的文件。就像“任务启动者(task-runner)”

## M

- [**模块(Module)**](/concepts/modules): 提供比完整程序接触面(surface area)更小的离散功能块。精心编写的模块提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。
- [**模块解析(Module Resolution)**](/concepts/module-resolution/): 一个模块可以作为另一个模块的依赖模块，resolver 是一个库( library )用于帮助找到模块的绝对路径... 模块将在 `resolve.modules` 中指定的所有目录内搜索。


## N

## O

- [**输出(Output)**](/concepts/output): 该选项确定在磁盘哪里输出编译后的文件。
    > _注意, 虽然可以有多个入口点, 但规定只能配置一个输出(output)._


## P

- [**插件(Plugin)**](/concepts/plugins): 一个含有 `apply` 属性的 JavaScript 对象。该 `apply` 属性会在 webpack 编译时被调用，并能在整个编译生命周期访问。这些插件包通常以某种方式扩展编译功能。


## Q

## R

## S

## T

- [**目标(Target)**](/configuration/target/): [这里列出](/configuration/target/) 了用户配置的部署目标，针对特定的环境（如浏览器，NodeJS或Electron）进行编译。
- [**Tree Shaking**](/guides/tree-shaking/): 删除未使用/过多的代码，更准确地说是动态代码导入。例如webpack的编译器将通过分析各种“import”语句和导入代码的使用来实现这一点，确定哪些部分的依赖关系实际上被利用，删除不是“树”的部分。


## U

## V

- [**第三方库入口点(Vendor Entry Point)**](/concepts/entry-points/#separate-app-and-vendor-entries):  从 app.js 和 vendors.js 开始创建依赖图(dependency graph)。这些依赖图是彼此完全分离、互相独立的，允许你使用 CommonsChunkPlugin 从「应用程序 bundle」中提取 vendor 引用(vendor reference) 到 vendor bundle。如果应用程序 bundle 中没有 vendor 代码，那么你可以在 webpack 中实现被称为长效缓存的通用模式。


## W

- [**webpack**](/): 一个可高度配置的现代 JavaScript 应用程序[模块](/concepts/modules)([module](/concepts/modules))打包器。


## X

## Y

## Z
