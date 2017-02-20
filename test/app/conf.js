const test = require('ava');
const _ = require('lodash');

const systemConf = require('../../generators/app/conf');

const conf = {
  packages: {
    src: {
      defaultExtension: 'js'
    }
  }
};

const typescriptBase = {
  transpiler: 'ts',
  typescriptOptions: {
    sourceMap: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    removeComments: false,
    noImplicitAny: false
  },
  packages: {
    src: {defaultExtension: 'ts'}
  }
};

test('systemConf with react/typescript', t => {
  const options = {js: 'typescript', framework: 'react'};
  const expected = _.mergeWith({}, conf, typescriptBase, {
    typescriptOptions: {jsx: 2},
    packages: {
      src: {
        defaultExtension: 'tsx',
        main: 'index'
      }
    }
  });
  const result = systemConf(options);
  t.deepEqual(result, expected);
});

test('systemConf with angular1/typescript', t => {
  const options = {js: 'typescript', framework: 'angular1'};
  const expected = _.mergeWith({}, conf, typescriptBase, {
    packages: {
      '.tmp': {
        defaultExtension: 'ts'
      }
    }
  });
  const result = systemConf(options);
  t.deepEqual(result, expected);
});

test('systemConf with babel/angular2', t => {
  const options = {js: 'babel', framework: 'angular2'};
  const expected = _.mergeWith({}, conf, {
    transpiler: 'plugin-babel',
    babelOptions: {
      plugins: [
        'babel-plugin-transform-es2015-typeof-symbol',
        'babel-plugin-angular2-annotations',
        'babel-plugin-transform-decorators-legacy',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-flow-strip-types'
      ]
    }
  });
  const result = systemConf(options);
  t.deepEqual(result, expected);
});

test('systemConf with react/babel', t => {
  const options = {js: 'babel', framework: 'react'};
  const expected = _.mergeWith({}, conf, {
    transpiler: 'plugin-babel',
    babelOptions: {
      presets: ['babel-preset-react']
    }
  });
  const result = systemConf(options);
  t.deepEqual(result, expected);
});

test(t => {
  const options = {js: 'babel', framework: 'angular1'};
  const expected = _.mergeWith({}, conf, {
    transpiler: 'plugin-babel'
  });
  const result = systemConf(options);
  t.deepEqual(result, expected);
});
