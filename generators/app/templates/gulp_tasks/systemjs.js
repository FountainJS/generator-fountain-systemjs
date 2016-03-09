const gulp = require('gulp');
const replace = require('gulp-replace');

const Builder = require('systemjs-builder');

const conf = require('../conf/gulp.conf');

gulp.task('systemjs', systemjs);
gulp.task('systemjs:html', updateIndexHtml);

function systemjs(done) {
  const builder = new Builder('./', 'jspm.config.js');

  builder.buildStatic(
    <%- entry %>,
    conf.path.tmp('index.js')
  ).then(() => done(), done);
}

function updateIndexHtml() {
  return gulp.src(conf.path.src('index.html'))
    .pipe(replace(
      /<script[\s\S]*script>/,
      `<script src="index.js"></script>`
    ))
    .pipe(gulp.dest(conf.path.tmp()));
}
