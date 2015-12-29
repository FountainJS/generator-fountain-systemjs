'use strict';

const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  prompting() {
    this.options.modules = 'systemjs';
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      this.updateJson('package.json', (packageJson) => {
        packageJson.jspm = {
          dependencies: packageJson.dependencies
        };
        _.forEach(packageJson.jspm.dependencies, function (version, name) {
          packageJson.jspm.dependencies[name] = `npm:${name}@${version}`;
        });
        delete packageJson.dependencies;
        if (this.props.framework === 'angular1') {
          packageJson.jspm.devDependencies = {
            'angular-mocks': `npm:angular-mocks@${packageJson.devDependencies['angular-mocks']}`
          };
          delete packageJson.devDependencies['angular-mocks'];
        }
        return packageJson;
      });

      this.mergeJson('package.json', {
        devDependencies: {
          jspm: '^0.16.15',
          'systemjs-builder': '^0.14.15'
        }
      });
    },

    configjs() {
      this.copyTemplate('config.js', 'config.js', {
        systemConf: conf(this.props)
      });
    }
  },

  writing: {
    gulp() {
      let entry = this.props.js === 'typescript' ? 'app/index' : 'index';
      entry = `conf.path.src('${entry}')`;
      if (this.props.framework === 'angular1') {
        entry = `\`\${${entry}} + \${conf.path.tmp('templateCacheHtml')}\``;
      }
      this.copyTemplate('gulp_tasks', 'gulp_tasks', { entry });
    },

    indexHtml() {
      const props = Object.assign({ head: true }, this.props);
      this.replaceInFile('src/index.html', /<\/head>/, props);
      props.head = false;
      this.replaceInFile('src/index.html', /<\/html>/, props);
    }
  },

  installing() {
    this.runInstall('jspm');
  }
});
