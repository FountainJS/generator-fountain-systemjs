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
      app: { defaultExtension: 'ts' }
    };
  }

  return conf;
};
