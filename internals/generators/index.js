/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const path = require('path');
const componentGenerator = require('./component/index');
const containerGenerator = require('./container/index');
const pageGenerator = require('./page/index')
const routeGenerator = require('./route/index');
const languageGenerator = require('./language/index');

module.exports = plop => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('page', pageGenerator)
  plop.setGenerator('route', routeGenerator);
  plop.setGenerator('language', languageGenerator);
  plop.addHelper('directory', comp => {
    try {
      fs.accessSync(path.join(__dirname, `../../app/containers/${comp}`), fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      return `components/${comp}`;
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
