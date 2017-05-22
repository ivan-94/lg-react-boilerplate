/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: '添加一个未链接的组件',
  prompts: [{
    type: 'list',
    name: 'type',
    message: '选择组件类型',
    default: 'Stateless Function',
    choices: () => ['Stateless Function', 'ES6 Class (Pure)', 'ES6 Class'],
  }, {
    type: 'input',
    name: 'name',
    message: '请输入组件名',
    default: 'Button',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? '这个组件已存在' : true;
      }

      return '必须输入组建名';
    },
  }, {
    type: 'confirm',
    name: 'wantMessages',
    default: true,
    message: '是否需要包含 i18n message (i.e. will this component use text)?',
  }],
  actions: data => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'ES6 Class': {
        componentTemplate = './component/es6.js.hbs';
        break;
      }
      case 'ES6 Class (Pure)': {
        componentTemplate = './component/es6.pure.js.hbs';
        break;
      }
      case 'Stateless Function': {
        componentTemplate = './component/stateless.js.hbs';
        break;
      }
      default: {
        componentTemplate = './component/es6.js.hbs';
      }
    }

    const actions = [{
      type: 'add',
      path: '../../app/components/{{properCase name}}/index.js',
      templateFile: componentTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/components/{{properCase name}}/__tests__/index.js',
      templateFile: './component/test.js.hbs',
      abortOnFail: true,
    }];

    // If they want a i18n messages file
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/messages.js',
        templateFile: './component/messages.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
