'use strict';

/* eslint no-unused-expressions: 0 */

const TestUtils = require('fountain-generator').TestUtils;
const expect = require('chai').expect;
const conf = require('../generators/app/conf');

describe('generator fountain systemjs conf', () => {
  it('should add .tmp packages and add default extension .ts for angular 1 and TS to handle template cache', () => {
    const props = TestUtils.defaults();
    props.framework = 'react';
    props.modules = 'systemjs';
    props.js = 'typescript';
    let jsonConf = conf(props);
    expect(jsonConf.packages['.tmp']).not.to.exist;

    props.framework = 'angular1';
    jsonConf = conf(props);
    expect(jsonConf.packages['.tmp']).to.eql({ defaultExtension: 'ts' });
  });
});
