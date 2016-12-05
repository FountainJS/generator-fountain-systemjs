module.exports = function systemConf(options) {
  const conf = {
    packages: {
      src: {
        defaultExtension: 'js'
      }
    }
  };

  if (options.js === 'typescript') {
    conf.transpiler = 'ts';
    conf.typescriptOptions = {
      sourceMap: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      removeComments: false,
      noImplicitAny: false
    };
    conf.packages = {
      src: {defaultExtension: 'ts'}
    };

    if (options.framework === 'react') {
      // https://github.com/Microsoft/TypeScript/issues/5918
      conf.typescriptOptions.jsx = 2;
      conf.packages.src.defaultExtension = 'tsx';
      conf.packages.src.main = 'index';
    }

    if (options.framework === 'angular1') {
      conf.packages['.tmp'] = {defaultExtension: 'ts'};
    }
  } else {
    // https://github.com/systemjs/plugin-babel
    conf.transpiler = 'plugin-babel';
    if (options.framework === 'angular2') {
      conf.babelOptions = {
        plugins: [
          'babel-plugin-transform-es2015-typeof-symbol',
          'babel-plugin-angular2-annotations',
          'babel-plugin-transform-decorators-legacy',
          'babel-plugin-transform-class-properties',
          'babel-plugin-transform-flow-strip-types'
        ]
      };
    } else if (options.framework === 'react') {
      conf.babelOptions = {
        presets: ['babel-preset-react']
      };
    }
  }

  return conf;
};
