const path = require('path');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;
const context = TestUtils.mock('app');

test.before(() => {
  process.chdir(path.resolve(__dirname, '../../'));
});

test('Test transforms() if framework is angular2', t => {
  context.options = {js: 'js', framework: 'angular2'};
  context.copyTemplate('../../../test/assets/src/index.js', 'test/assets/src/index.js');
  context.destinationPath = path => path;
  const transforms = require('../../generators/app/transforms');
  transforms.apply(context);
  const result = context.copyTemplate['test/assets/src/index.js'];
  t.true(result.indexOf(`import {Router, Route, browserHistory} from 'react-router';`) > -1);
  t.is(result.indexOf(`'require('react-router')'`), -1);
  t.is(result.indexOf(`import './index.styl'`), -1);
  t.is(result.indexOf(`require('./index.styl')`), -1);
  t.true(result.indexOf(`import {Test} from 'lib'`) > -1);
  t.true(result.indexOf(`import angular from 'angular'`) > -1);
  t.true(result.indexOf(`import 'es6-shim'`) > -1);
  t.true(result.indexOf(`import {App} from './app.js'`) > -1);
  t.true(result.indexOf(`import file from '../file.js';`) > -1);
  t.true(result.indexOf(`export default 1`) > -1);
  t.true(result.indexOf(`.get('src/app/techs/techs.json')`) > -1);
  t.true(result.indexOf(`templateUrl: 'src/app/footer.html'`) > -1);
  t.true(result.indexOf('moduleId: __moduleName') > -1);
  t.true(result.indexOf(`templateUrl: 'Techs.html'`) > -1);
});

test('Test transforms() if framework is angular1', t => {
  context.options = {js: 'js', framework: 'angular1'};
  context.copyTemplate('../../../test/assets/src/index.js', 'test/assets/src/index.js');
  context.destinationPath = path => path;
  const transforms = require('../../generators/app/transforms');
  transforms.apply(context);
  const result = context.copyTemplate['test/assets/src/index.js'];
  t.is(result.indexOf(`templateUrl: 'Techs.html'`), -1);
});
