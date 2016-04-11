'use strict';

const expect = require('chai').expect;
const TestUtils = require('fountain-generator').TestUtils;

describe('generator fountain systemjs package', () => {
  beforeEach(function () {
    this.context = TestUtils.mock();
    require('../generators/app/index');
  });

  it('should move certain dev deps to jspm', function () {
    let devDependencies = {'angular-mocks': '^1.2.3'};
    this.context.updateJson = (file, update) => {
      this.context.updateJson[file] = update({devDependencies});
    };
    const getJspmDevDep = () => this.context.updateJson['package.json'].jspm.devDependencies;
    TestUtils.call(this.context, 'configuring.pkg', {framework: 'angular1'});
    expect(getJspmDevDep()).to.eql({'angular-mocks': 'npm:angular-mocks@^1.2.3'});

    devDependencies = {'react-addons-test-utils': '^2.3.4'};
    TestUtils.call(this.context, 'configuring.pkg', {framework: 'react', js: 'typescript'});
    expect(getJspmDevDep()).to.eql({'react-addons-test-utils': 'npm:react-addons-test-utils@^2.3.4'});
  });
});
