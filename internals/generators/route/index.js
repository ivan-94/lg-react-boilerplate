/**
 * Route Generator
 * ✅ 暂时不太实用
 */
const fs = require('fs');
const path = require('path');
const componentExists = require('../utils/componentExists');

function reducerExists (comp) {
  try {
    fs.accessSync(path.join(__dirname, `../../../app/containers/${comp}/reducer.js`), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function sagasExists (comp) {
  try {
    fs.accessSync(path.join(__dirname, `../../../app/containers/${comp}/sagas.js`), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function trimTemplateFile (template) {
  // Loads the template file and trims the whitespace and then returns the content as a string.
  return fs.readFileSync(path.join(__dirname, `./${template}`), 'utf8').replace(/\s*$/, '');
}

module.exports = {
  description: '添加一个路由',
  prompts: [{
    type: 'input',
    name: 'component',
    message: '输入路由组件',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? true : `组件"${value}" 不存在.`;
      }

      return 'The path is required';
    },
  }, {
    type: 'input',
    name: 'path',
    message: '输入路由路径.',
    default: '/about',
    validate: value => {
      if ((/.+/).test(value)) {
        return true;
      }

      return 'path is required';
    },
  }],

  // Add the route to the routes.js file above the error route
  // TODO smarter route adding
  actions: data => {
    const actions = [];
    if (reducerExists(data.component)) {
      data.useSagas = sagasExists(data.component); // eslint-disable-line no-param-reassign
      actions.push({
        type: 'modify',
        path: '../../app/routes.js',
        // 插入到*路径之前
        pattern: /(\s{\n\s{0,}path: '\*',)/g,
        template: trimTemplateFile('routeWithReducer.hbs'),
      });
    } else {
      actions.push({
        type: 'modify',
        path: '../../app/routes.js',
        pattern: /(\s{\n\s{0,}path: '\*',)/g,
        template: trimTemplateFile('route.hbs'),
      });
    }

    return actions;
  },
};
