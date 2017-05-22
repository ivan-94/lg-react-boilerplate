/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: '添加一个容器组件',
  prompts: [{
    type: 'input',
    name: 'name',
    message: '组件名',
    default: 'Form',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? '组件名已存在' : true;
      }

      return '必须输入组件名';
    },
  }, {
    type: 'list',
    name: 'component',
    message: '选择组件类型:',
    default: 'PureComponent',
    choices: () => ['PureComponent', 'Component'],
  }, {
    type: 'confirm',
    name: 'wantHeaders',
    default: false,
    message: '是否需要添加helmet?',
  }, {
    type: 'confirm',
    name: 'wantMessages',
    default: true,
    message: '是否需要添加i18n message(i.e. will this component use text)?',
  }],
  actions: data => {
    // Generate index.js and index.test.js and inject<Name>.js
    const actions = [{
      type: 'add',
      path: '../../app/containers/{{properCase name}}/inject{{properCase name}}.js',
      templateFile: './container/injector.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/index.js',
      templateFile: './container/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/__tests__/index.js',
      templateFile: './container/test.js.hbs',
      abortOnFail: true,
    }, {
      // Actions
      type: 'add',
      path: '../../app/containers/{{properCase name}}/actions.js',
      templateFile: './container/actions.js.hbs',
      abortOnFail: true,
    }, {
      // Constants
      type: 'add',
      path: '../../app/containers/{{properCase name}}/constants.js',
      templateFile: './container/constants.js.hbs',
      abortOnFail: true,
    }, {
      // Selectors
      type: 'add',
      path: '../../app/containers/{{properCase name}}/selectors.js',
      templateFile: './container/selectors.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/__tests__/selectors.js',
      templateFile: './container/selectors.test.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/reducer.js',
      templateFile: './container/reducer.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/__tests__/reducer.js',
      templateFile: './container/reducer.test.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/sagas.js',
      templateFile: './container/sagas.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/containers/{{properCase name}}/__tests__/sagas.js',
      templateFile: './container/sagas.test.js.hbs',
      abortOnFail: true,
    }]

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase name}}/messages.js',
        templateFile: './container/messages.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
