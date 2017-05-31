const resolve = require('path').resolve;
const pullAll = require('lodash/pullAll');
const uniq = require('lodash/uniq');

const ReactBoilerplate = {
  // This refers to the react-boilerplate version this project is based on.
  version: '3.4.0',
  // webpack output path
  outputPath: resolve(process.cwd(), 'build/public/assets'),
  // 不同平台业务逻辑是共享的，为了不同平台之间可以共享业务逻辑(特指redux部分), 我们使用不同的文件
  // 后缀来区分不同的平台，比如index.mb.js表示的是移动端的，index.native.js 表示的是原生平台的特定代码
  // 我们使用环境变量`PLATFORM`来指示平台环境的切换
  platformToExtension: {
    mobile: ['mb', 'web'], // 可以是数组形式, 表示.mb.js, .web.js 优先级高于其他
    // native: 'nt',
  },

  /**
   * The DLL Plugin provides a dramatic speed increase to webpack build and hot module reloading
   * by caching the module metadata for all of our npm dependencies. We enable it by default
   * in development.
   *
   *
   * To disable the DLL Plugin, set this value to false.
   */
  dllPlugin: {
    defaults: {
      /**
       * we need to exclude dependencies which are not intended for the browser
       * by listing them here.
       */
      exclude: [
        'chalk',
        'compression',
        'cross-env',
        'express',
        'ip',
        'minimist',
        'sanitize.css',
        'source-map-support',
        'inquirer',
        'morgan',
        'svg-sprite-loader',
      ],

      /**
       * Specify any additional dependencies here. We include core-js and lodash
       * since a lot of our dependencies depend on them and they get picked up by webpack.
       */
      include: ['core-js', 'eventsource-polyfill', 'babel-polyfill', 'lodash'],

      // The path where the DLL manifest and bundle will get built
      path: resolve('../node_modules/react-boilerplate-dlls'),
    },

    entry (pkg) {
      const dependencyNames = Object.keys(pkg.dependencies);
      const exclude = pkg.dllPlugin.exclude || ReactBoilerplate.dllPlugin.defaults.exclude;
      const include = pkg.dllPlugin.include || ReactBoilerplate.dllPlugin.defaults.include;
      const includeDependencies = uniq(dependencyNames.concat(include));

      return {
        reactBoilerplateDeps: pullAll(includeDependencies, exclude),
      };
    },
  },
};

module.exports = ReactBoilerplate;
