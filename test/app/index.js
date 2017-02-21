const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const _ = require('lodash');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;
const base = {
  devDependencies: {
    'jspm': '0.17.0-beta.25',
    'systemjs-builder': '0.15.23',
    'gulp-replace': '^0.5.4'
  },
  scripts: {
    jspm: 'jspm'
  }
};

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
  process.chdir(path.resolve(__dirname, '../../'));
});

test.beforeEach(() => {
  context.updateJson['package.json'] = {};
  context.mergeJson['package.json'] = {};
});

test(`Move dependencies to jspm from 'package.json'`, t => {
  context.updateJson['package.json'] = {
    dependencies: {angular: '^1.6.4'},
    devDependencies: {'angular-mocks': '^1.6.2'}
  };
  const expected = {
    devDependencies: {},
    jspm: {
      dependencies: {
        angular: 'npm:angular@^1.6.4',
        ts: 'github:frankwallis/plugin-typescript@7.0.3'
      },
      devDependencies: {'angular-mocks': 'npm:angular-mocks@^1.6.2'}
    }
  };
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular1', js: 'typescript'});
  t.deepEqual(context.updateJson['package.json'], expected);
  t.deepEqual(context.mergeJson['package.json'], _.merge({}, base, context.mergeJson['package.json']));
});

test(`Add 'reflect-metadata' to jspm dependencies if framework is 'angular2'`, t => {
  context.updateJson['package.json'] = {
    dependencies: {},
    devDependencies: {},
    jspm: {
      dependencies: {}
    }
  };
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular2', js: 'typescript'});
  t.is(context.updateJson['package.json'].jspm.dependencies['reflect-metadata'], 'npm:reflect-metadata@^0.1.9');
});

test(`Delete dependencies from 'package.json'`, t => {
  context.updateJson['package.json'] = {
    dependencies: {react: '^15.4.2'},
    devDependencies: {'react-addons-test-utils': '^15.4.2'}
  };
  const expected = {
    devDependencies: {},
    jspm: {
      dependencies: {
        'css': 'github:systemjs/plugin-css@^0.1.32',
        'react': 'npm:react@^15.4.2',
        'babel-polyfill': 'npm:babel-polyfill@^6.23.0',
        'es6-shim': 'npm:es6-shim@^0.35.3'
      },
      devDependencies: {'react-addons-test-utils': 'npm:react-addons-test-utils@^15.4.2'}
    }
  };
  TestUtils.call(context, 'configuring.pkg', {framework: 'react', sample: 'todoMVC', js: 'js'});
  t.deepEqual(context.updateJson['package.json'], expected);
  t.deepEqual(context.mergeJson['package.json'], _.merge({}, base, context.mergeJson['package.json']));
});

test(`Delete dependencies from 'package.json'`, t => {
  context.updateJson['package.json'] = {
    dependencies: {react: '^15.4.2'},
    devDependencies: {'react-addons-test-utils': '^15.4.2'}
  };
  const expected = {
    devDependencies: {},
    jspm: {
      dependencies: {
        'css': 'github:systemjs/plugin-css@^0.1.32',
        'react': 'npm:react@^15.4.2',
        'babel-polyfill': 'npm:babel-polyfill@^6.23.0'
      },
      devDependencies: {'react-addons-test-utils': 'npm:react-addons-test-utils@^15.4.2'}
    }
  };
  TestUtils.call(context, 'configuring.pkg', {framework: 'react', sample: 'todoMVC', js: 'babel'});
  t.deepEqual(context.updateJson['package.json'], expected);
  t.deepEqual(context.mergeJson['package.json'], _.merge({}, base, context.mergeJson['package.json']));
});

test('configjs(): Call this.copyTemplate 3 times', () => {
  const spy = chai.spy.on(context, 'copyTemplate');
  TestUtils.call(context, 'configuring.configjs');
  expect(spy).to.have.been.called.exactly(3);
});

test(`gulp(): copy 'gulp_tasks/systemjs.js' when framework is angular1`, t => {
  TestUtils.call(context, 'writing.gulp', {framework: 'angular1'});
  t.true(context.copyTemplate['gulp_tasks/systemjs.js'].length > 0);
});

test(`gulp(): copy 'gulp_tasks/systemjs.js' when framework is react`, t => {
  TestUtils.call(context, 'writing.gulp', {framework: 'react'});
  t.true(context.copyTemplate['gulp_tasks/systemjs.js'].length > 0);
});

test(`gulp(): copy 'gulp_tasks/systemjs.js' when framework is angular2`, t => {
  TestUtils.call(context, 'writing.gulp', {framework: 'angular2'});
  t.true(context.copyTemplate['gulp_tasks/systemjs.js'].length > 0);
});

test(`indexHtml(): Call replaceInFileWithTemplate twice`, () => {
  context.templatePath = context.destinationPath = path => path;
  context.replaceInFileWithTemplate = () => {};
  const spy = chai.spy.on(context, 'replaceInFileWithTemplate');
  TestUtils.call(context, 'writing.indexHtml');
  expect(spy).to.have.been.called.exactly(2);
});

test('Call runInstall', () => {
  context.runInstall = () => {};
  const spy = chai.spy.on(context, 'runInstall');
  TestUtils.call(context, 'install');
  expect(spy).to.have.been.called.once();
});
