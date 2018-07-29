const path = require('path');
const combineContexts = require('./src/utilities/combine-contexts');

module.exports = () => ({
  maximumWorkers: process.env.TRAVIS && 1,
  template: {
    file: path.join(__dirname, 'template.ejs')
  },
  output: 'build',
  title: 'webpack 中文文档',
  keywords: ['webpack', 'javascript', 'web development', 'programming'],
  layout: () => require('./src/components/Site/Site.jsx').default,
  paths: {
    '/': {
      title: '首页',
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content', false, /^\.\/.*\.md$/),
      index: () => require('./src/components/Splash/Splash.jsx').default
    },
    concepts: {
      title: '概念',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/concepts', false, /^\.\/.*\.md$/)
    },
    configuration: {
      title: '配置',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/configuration', false, /^\.\/.*\.md$/)
    },
    api: {
      title: 'API',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/api', false, /^\.\/.*\.md$/)
    },
    guides: {
      title: '指南',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/guides', false, /^\.\/.*\.md$/)
    },
    plugins: {
      title: '插件',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => {
        return combineContexts(
          require.context('./loaders/page-loader!./src/content/plugins', false, /^\.\/.*\.md$/),
          require.context('./loaders/page-loader!./generated/plugins', false, /^\.\/.*\.md$/)
        );
      }
    },
    loaders: {
      title: 'loaders',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => {
        return combineContexts(
          require.context('./loaders/page-loader!./src/content/loaders', false, /^\.\/.*\.md$/),
          require.context('./loaders/page-loader!./generated/loaders', false, /^\.\/.*\.md$/)
        );
      }
    },
    contribute: {
      title: '贡献',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/contribute', false, /^\.\/.*\.md$/)
    },
    migrate: {
      title: '迁移',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/migrate', false, /^\.\/.*\.md$/)
    },
    vote: () => require('./src/components/Vote/Vote.jsx').default,
    organization: () => require('./src/components/Organization/Organization.jsx').default,
    'starter-kits': () => require('./src/components/StarterKits/StarterKits.jsx').default
  }
});
