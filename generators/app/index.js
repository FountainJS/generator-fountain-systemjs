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
      this.updateJson('package.json', packageJson => {
        packageJson.jspm = {
          dependencies: packageJson.dependencies
        };
        _.forEach(packageJson.jspm.dependencies, (version, name) => {
          packageJson.jspm.dependencies[name] = `npm:${name}@${version}`;
        });
        delete packageJson.dependencies;

        const moveDevDepsToJspm = dep => {
          packageJson.jspm.devDependencies = {
            [dep]: `npm:${dep}@${packageJson.devDependencies[dep]}`
          };
          delete packageJson.devDependencies[dep];
        };

        if (this.props.framework === 'angular1') {
          moveDevDepsToJspm('angular-mocks');
        }
        if (this.props.framework === 'react' && this.props.js === 'typescript') {
          moveDevDepsToJspm('react-addons-test-utils');
        }

        return packageJson;
      });

      this.mergeJson('package.json', {
        devDependencies: {
          'jspm': '^0.16.15',
          'systemjs-builder': '^0.14.15',
          'gulp-replace': '^0.5.4'
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
      let entry = `conf.path.src('index')`;
      if (this.props.framework === 'angular1') {
        entry = `\`\${${entry}} + \${conf.path.tmp('templateCacheHtml')}\``;
      }
      this.copyTemplate('gulp_tasks', 'gulp_tasks', { entry });
    },

    indexHtml() {
      this.replaceInFile('src/index-head.html', 'src/index.html', /<\/head>/);
      this.replaceInFile('src/index-footer.html', 'src/index.html', /<\/html>/);
    }
  },

  installing() {
    this.runInstall('jspm');
  }
});
