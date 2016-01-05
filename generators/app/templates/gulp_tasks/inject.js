const gulp = require('gulp');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
<% if (framework === 'angular1') { -%>
const angularFilesort = require('gulp-angular-filesort');
<% } -%>
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
<% if (css === 'css') { -%>
  const injectStyles = gulp.src(conf.path.src('app/**/*.css'), { read: false });
<% } else {-%>
  const injectStyles = gulp.src(conf.path.tmp('index.css'), { read: false });
<% } -%>

  const injectScripts = gulp.src([
<% if (framework === 'react') { -%>
    conf.path.tmp('**/!(index).js'),
    conf.path.tmp('**/index.js'),
<% } else { -%>
  conf.path.tmp('**/*.js'),
<% } -%>
    `!${conf.path.tmp('**/*.spec.js')}`
<% if (framework === 'angular1') { -%>
  ])
  .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
<% } else { -%>
  ]);
<% } -%>

  const injectOptions = {
    ignorePath: [ conf.paths.src, conf.paths.tmp ],
    addRootSlash: false
  };

  return gulp.src(conf.path.src('index.html'))
    .pipe(gulpInject(injectStyles, injectOptions))
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}
