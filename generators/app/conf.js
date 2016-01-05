module.exports = function systemConf(props) {
  const conf = {
    defaultJSExtensions: true,
    defaultExtension: 'js'
  };

  if (props.js === 'js' || props.js === 'babel') {
    conf.transpiler = 'babel';
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
      conf.typescriptOptions.jsx = 2;
      conf.packages.src.defaultExtension = 'tsx';
    }

    if (props.framework === 'angular1') {
      conf.packages['.tmp'] = { defaultExtension: 'ts' };
    }
  }

  return conf;
};
