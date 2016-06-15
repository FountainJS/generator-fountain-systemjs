const gulp = require('gulp');
const replace = require('gulp-replace');

<% if (framework === 'angular1') { -%>
const Builder = require('systemjs-builder');
<% } else { -%>
const Builder = require('jspm').Builder;
<% } -%>
const conf = require('../conf/gulp.conf');

gulp.task('systemjs', systemjs);
gulp.task('systemjs:html', updateIndexHtml);

function systemjs(done) {
  const builder = new Builder('./', 'jspm.config.js');
  builder.config({
    paths: {
      "github:*": "jspm_packages/github/*",
      "npm:*": "jspm_packages/npm/*"
    },
    packageConfigPaths: [
      'npm:@*/*.json',
      'npm:*.json',
      'github:*/*.json'
    ]
  });
  builder.buildStatic(
    <%- entry %>,
    conf.path.tmp('index.js'),
    {
      production: true,
      browser: true
    }
  ).then(() => done(), done);
}

function updateIndexHtml() {
  return gulp.src(conf.path.src('index.html'))
    .pipe(replace(
      /<script src="jspm_packages\/system.js">[\s\S]*System.import.*\n\s*<\/script>/,
      `<script src="index.js"></script>`
    ))
    .pipe(gulp.dest(conf.path.tmp()));
}
