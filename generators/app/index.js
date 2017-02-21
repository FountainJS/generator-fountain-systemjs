'use strict';

const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');
const transforms = require('./transforms');

module.exports = fountain.Base.extend({
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
        if (this.options.framework === 'angular1') {
          moveDevDepsToJspm('angular-mocks');
        }
        if (this.options.framework === 'angular2') {
          packageJson.jspm.dependencies['reflect-metadata'] = 'npm:reflect-metadata@^0.1.9';
        }
        if (this.options.framework === 'react') {
          packageJson.jspm.dependencies['babel-polyfill'] = 'npm:babel-polyfill@^6.23.0';
          moveDevDepsToJspm('react-addons-test-utils');
        }
        if (this.options.sample === 'todoMVC') {
          packageJson.jspm.dependencies.css = 'github:systemjs/plugin-css@^0.1.32';
          if (this.options.js === 'js') {
            packageJson.jspm.dependencies['es6-shim'] = 'npm:es6-shim@^0.35.3';
          }
        }
        if (this.options.js === 'typescript') {
          packageJson.jspm.dependencies.ts = 'github:frankwallis/plugin-typescript@7.0.3';
        }

        return packageJson;
      });

      this.mergeJson('package.json', {
        devDependencies: {
          'jspm': '0.17.0-beta.25',
          'systemjs-builder': '0.15.23',
          'gulp-replace': '^0.5.4'
        },
        scripts: {
          jspm: 'jspm'
        }
      });
    },

    configjs() {
      this.copyTemplate('jspm.test.js', 'jspm.test.js');
      this.copyTemplate('jspm.browser.js', 'jspm.browser.js');
      this.copyTemplate('jspm.config.js', 'jspm.config.js', {
        systemConf: conf(this.options)
      });
    }
  },

  writing: {
    transforms,

    gulp() {
      const extensions = this.getExtensions(this.options);
      let baseUrl = `'./'`;
      let configPath = `'jspm.config.js'`;
      let entry = `conf.path.src('index.${extensions.js}')`;
      if (this.options.framework === 'angular1') {
        entry = `\`\${${entry}} + \${conf.path.tmp('templateCacheHtml.${extensions.js}')}\``;
      }
      if (this.options.framework === 'angular2') {
        baseUrl = `conf.path.tmp('templates')`;
        configPath = `'../../jspm.config.js'`;
        entry = `'index.${extensions.js}'`;
      }
      this.copyTemplate('gulp_tasks', 'gulp_tasks', {entry, baseUrl, configPath, extensions});
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
