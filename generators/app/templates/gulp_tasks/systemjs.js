const gulp = require('gulp');
const replace = require('gulp-replace');

const Builder = require('jspm').Builder;

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
<% if (framework === 'angular1' && modules === 'systemjs' && js === 'typescript') { -%>
  const opts = {rollup: false};
<% } else { -%>
  const opts = {};
<% } -%>
  builder.buildStatic(
    <%- entry %>,
    conf.path.tmp('index.js'),
    opts
  ).then(() => done(), done);
}

function updateIndexHtml() {
  return gulp.src(conf.path.src('index.html'))
    .pipe(replace(
      /<script>\n\s*System.import.*\n\s*<\/script>/,
      `<script src="index.js"></script>`
    ))
    .pipe(gulp.dest(conf.path.tmp()));
}
