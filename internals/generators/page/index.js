/**
 * Page Generator
 */
const fs = require('fs')
const path = require('path')
const containerExists = require('../utils/componentExists')

function pageExists (contName, name) {
  try {
    fs.accessSync(path.join(__dirname, `../../../app/containers/${contName}/${name}.js`), fs.F_OK)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  description: '添加一个页面',
  prompts: [{
    type: 'input',
    name: 'containerName',
    message: '容器名',
    default: 'Form',
    validate: value => {
      if ((/.+/).test(value)) {
        return containerExists(value) ? true : '容器不存在，请先创建容器';
      }
      return '必须输入容器名'
    },
  }, {
    type: 'input',
    name: 'name',
    message: '页面名',
    default: 'Foo',
    validate: (value, answer) => {
      const containerName = answer.containerName
      if ((/.+/).test(value)) {
        return pageExists(containerName, value) ? `页面已存在: "${containerName}/${value}.js"` : true
      }
      return '必须输入页面名'
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
  // Actions
  actions: [{
    type: 'add',
    path: '../../app/containers/{{ properCase containerName }}/{{ properCase name }}.js',
    templateFile: './container/index.js.hbs',
    abortOnFail: true,
  }, {
    type: 'add',
    path: '../../app/containers/{{properCase containerName}}/inject{{properCase name}}.js',
    templateFile: './container/injector.js.hbs',
    abortOnFail: true,
  }],
}
