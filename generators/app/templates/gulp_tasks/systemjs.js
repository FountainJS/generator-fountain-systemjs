const gulp = require('gulp');
const replace = require('gulp-replace');

<% if (framework === 'angular1' && js !== 'typescript') { -%>
const Builder = require('systemjs-builder');
<% } else if (framework === 'angular2') { -%>
const Builder = require('jspm').Builder;
const inlineNg2Template = require('gulp-inline-ng2-template');
const del = require('del');
<% } else { -%>
const Builder = require('jspm').Builder;
<% } -%>
const conf = require('../conf/gulp.conf');

<% if (framework === 'angular2') { -%>
gulp.task('systemjs', gulp.series(replaceTemplates, systemjs));
<% } else { -%>
gulp.task('systemjs', systemjs);
<% } -%>
gulp.task('systemjs:html', updateIndexHtml);

function systemjs(done) {
  const builder = new Builder(<%- baseUrl %>, 'jspm.config.js');
  builder.config({
    paths: {
      'github:*': 'jspm_packages/github/*',
      'npm:*': 'jspm_packages/npm/*'
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
  ).then(() => {
<% if (framework === 'angular2') { -%>
    del([conf.path.tmp('templates')]);
<% } -%>
    done();
  }, done);
}
<% if (framework === 'angular2') { -%>

function replaceTemplates() {
  return gulp.src(conf.path.src(`**/*.<%- extensions.js %>`))
    .pipe(inlineNg2Template({base: conf.path.src('app'), useRelativePaths: true}))
    .pipe(gulp.dest(conf.path.tmp('templates')));
}
<% } -%>

function updateIndexHtml() {
  return gulp.src(conf.path.src('index.html'))
    .pipe(replace(
      /<script src="jspm_packages\/system.js">[\s\S]*System.import.*\r?\n\s*<\/script>/,
      `<script src="index.js"></script>`
    ))
<% if (framework === 'angular2') { -%>
    .pipe(replace(
      /<!-- <script src="(node_modules)(\/([\s\S]*?))*"><\/script> -->/g,
      `<script src="vendor$2"></script>`
    ))
<% } -%>
    .pipe(gulp.dest(conf.path.tmp()));
}
