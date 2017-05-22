# large React boilerplate
这个模板项目是基于[react-boiler](https://github.com/react-boilerplate/react-boilerplate)扩展的. 包含的技术栈：
+ React
+ ReactRouter v3
+ Redux
+ Redux-saga
+ Reselect
+ react-intl
+ styled-components

开发环境技术栈
+ flow
+ webpack
+ eslint
+ jest
+ plop

> 建议配合`Atom` + `Nuclide`开发工具， 实现更好的开发体验

## 1. 开始项目
1. git clone 本项目
2. `yarn setup` 安装依赖和清理git版本库
3. `yarn clean` 清除example
4. `yarn start` 开始你的开发旅行✈️

## 2. 命令
```shell
yarn start  # 开启开发服务器
yarn build  # 编译生产环境输出
yarn generate # 代码生产器，可以快速生成代码模板
yarn flowinstall # 安装flow声明文件，如果你添加了新的依赖，需要执行这个命令
yarn test   # 运行Jest 单元测试

# lint
yarn flow   # flow 静态类型检测(建议在Atom中实时检查)
yarn lint   # eslint (建议在Atom中实时检查)
```

## 3. 代码文件结构
```
app
├── __tests__
├── componnents                     # 可复用的展示组件
├── containers                      # 容器
│   ├── App                         # 根组件
│   │   ├── __tests__
│   │   ├── constants.js
│   │   ├── index.js
│   │   └── selectors.js
│   ├── HomePage
│   │   ├── __tests__
│   │   ├── actions.js              # Redux Action
│   │   ├── constants.js            # 常量
│   │   ├── index.js                # 入口文件
│   │   ├── injectHomePage.js       # 容器注入器
│   │   ├── messages.js             # i18n message
│   │   ├── reducer.js              # Redux Reducer
│   │   ├── saga.js                 # Redux Saga
│   │   ├── selectors.js            # Redux state 选择器
│   │   └── types.js                # 可共享的flow类型声明
│   ├── LanguageProvider
│   └── NotFoundPage
├── app.js                          # 应用入口
├── favicon.ico
├── global-styles.js                # 全局样式
├── history.js
├── i18n.js                         # i18n 配置
├── index.html
├── manifest.json
├── reducers.js                     # 根reducer
├── routes.js                       # 路由配置
├── saga.js                         # 根saga
├── store.js                        # Redux Store 配置
├── theme.js                        # 主题设置
├── translations                    # 翻译文件
│   └── en.json
└── utils                           # 帮助方法
```

## 4. 设置接口代理
设置`package.json`的`proxy`字段, 如
```json
"proxy": {
  "path": "^/large.*",
  "config": {
    "host": "www.zhlarge.com",
    "protocol": "http",
    "port": 80
  }
},
```

> + path: API前缀，正则表达式
> + config: 代理配置

## 5. 特定平台代码
不同平台业务逻辑是共享的，为了不同平台之间可以共享业务逻辑(比如redux部分, 国际化，部分组件), 我们的策略是使用不同的文件
后缀来区分不同的平台，比如index.mb.js表示的是移动端的，index.native.js 表示的是原生平台的特定代码, 我们使用环境变量`PLATFORM`来指示平台环境的切换

### 6. 配置环境变量和后缀的管理
```javascript
// internals/config.js
platformToExtension: {
  mobile: ['mb', 'web'],
}
```
那么加入目录结构为：
```
app
  app.mb.js
  app.js
```
在环境变量PLATFORM为‘mobile’的时，会优先加载app.mb.js 文件

### 7. 配置启动和编译script
配置package的scripts对象，如

```json
"start:mb": "cross-env NODE_ENV=development PLATFORM=mobile node server",
"build:mb": "cross-env NODE_ENV=production PLATFORM=mobile webpack --config internals/webpack/webpack.prod.babel.js --color -p --progress",
```
这里使用`<操作名>:<平台缩写>`来命名一个脚本
