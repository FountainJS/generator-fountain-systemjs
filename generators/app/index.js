const _ = require('lodash');
var fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting: function () {
    this.options.modules = 'systemjs';
    this.fountainPrompting();
  },

  configuring: {
    package: function () {
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

    configjs: function () {
      this.fs.copyTpl(
        this.templatePath('config.js'),
        this.destinationPath('config.js')
      );
    }
  },

  writing: {
    gulp: function () {
      this.copyTemplate('gulp_tasks', 'gulp_tasks', this.props);
    },

    indexHtml: function () {
      this.replaceInFile('src/index.html', /<\/html>/);
    }
  },

  installing: function () {
    this.runInstall('jspm');
  }
});
