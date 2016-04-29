'use strict';

const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');
const transforms = require('./transforms');

module.exports = fountain.Base.extend({
  prompting() {
    this.options.modules = 'systemjs';
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      this.updateJson('package.json', packageJson => {
        packageJson.jspm = {
          dependencies: packageJson.dependencies
        };
        _.forEach(packageJson.jspm.dependencies, (version, name) => {
          packageJson.jspm.dependencies[name] = `npm:${name}@${version}`;
        });
        delete packageJson.dependencies;

        const moveDevDepsToJspm = dep => {
          packageJson.jspm.devDependencies[dep] = `npm:${dep}@${packageJson.devDependencies[dep]}`;
          delete packageJson.devDependencies[dep];
        };

        packageJson.jspm.devDependencies = {};
        if (this.props.framework === 'angular1') {
          moveDevDepsToJspm('angular-mocks');
        }
        if (this.props.framework === 'react') {
          packageJson.jspm.dependencies['babel-polyfill'] = 'npm:babel-polyfill@^6.7.4';
          moveDevDepsToJspm('react-addons-test-utils');
        }
        if (this.props.js === 'typescript') {
          packageJson.jspm.dependencies.typescript = 'npm:typescript@^1.8.7';
        }

        return packageJson;
      });

      this.mergeJson('package.json', {
        devDependencies: {
          'jspm': '^0.17.0-beta.9',
          'systemjs-builder': '^0.15.15',
          'gulp-replace': '^0.5.4'
        }
      });
    },

    configjs() {
      if (this.props.modules === 'systemjs') {
        this.copyTemplate('jspm.test.js', 'jspm.test.js');
      }
      this.copyTemplate('jspm.config.js', 'jspm.config.js', {
        systemConf: conf(this.props)
      });
    }
  },

  writing: {
    transforms,

    gulp() {
      const extensions = this.getExtensions(this.props);
      let entry = `conf.path.src('index.${extensions.js}')`;
      if (this.props.framework === 'angular1') {
        entry = `\`\${${entry}} + \${conf.path.tmp('templateCacheHtml.${extensions.js}')}\``;
      }
      this.copyTemplate('gulp_tasks', 'gulp_tasks', {entry});
    },

    indexHtml() {
      this.replaceInFileWithTemplate(
        'src/index-head.html',
        'src/index.html',
        /<\/head>/
      );
      this.replaceInFileWithTemplate(
        'src/index-footer.html',
        'src/index.html',
        /<\/html>/
      );
    }
  },

  install() {
    this.runInstall('./node_modules/.bin/jspm');
  }
});
