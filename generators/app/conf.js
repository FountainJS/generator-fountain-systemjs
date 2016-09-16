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
      src: {defaultExtension: 'ts'},
      typings: {defaultExtension: 'ts'}
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

  if (options.framework === 'angular2') {
    conf.map = {
      "@angular/core/testing": "npm:@angular/core@2.0.0/bundles/core-testing.umd.js",
      "@angular/compiler/testing": "npm:@angular/compiler@2.0.0/bundles/compiler-testing.umd.js",
      "@angular/platform-browser/testing": "npm:@angular/platform-browser@2.0.0/bundles/platform-browser-testing.umd.js",
      "@angular/platform-browser-dynamic/testing": "npm:@angular/platform-browser-dynamic@2.0.0/bundles/platform-browser-dynamic-testing.umd.js",
      "@angular/http/testing": "npm:@angular/http@2.0.0/bundles/http-testing.umd.js"
    };

    if (options.sample === 'todoMVC') {
      conf.map['@angular/forms/testing'] = 'npm:@angular/forms@2.0.0/bundles/forms-testing.umd.js';
    }
  }

  return conf;
};
