module.exports = function systemConf(props) {
  const conf = {
    defaultJSExtensions: true,
    defaultExtension: 'js'
  };

  if (props.js !== 'typescript') {
    // https://github.com/systemjs/plugin-babel
    conf.transpiler = 'plugin-babel';
    if (props.framework === 'angular2') {
      conf.babelOptions = {
        plugins: [
          'babel-plugin-angular2-annotations',
          'babel-plugin-transform-decorators-legacy',
          'babel-plugin-transform-class-properties',
          'babel-plugin-transform-flow-strip-types'
        ]
      };
    } else if (props.framework === 'react') {
      conf.babelOptions = {
        presets: ['babel-preset-react']
      };
    }
  }

  if (props.js === 'typescript') {
    conf.transpiler = 'typescript';
    conf.typescriptOptions = {
      sourceMap: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      removeComments: false,
      noImplicitAny: false
    };
    conf.packages = {
      src: { defaultExtension: 'ts' },
      typings: { defaultExtension: 'ts' }
    };

    if (props.framework === 'react') {
      // https://github.com/Microsoft/TypeScript/issues/5918
      conf.typescriptOptions.jsx = 2;
      conf.packages.src.defaultExtension = 'tsx';
    }

    if (props.framework === 'angular1') {
      conf.packages['.tmp'] = { defaultExtension: 'ts' };
    }
  }

  return conf;
};
