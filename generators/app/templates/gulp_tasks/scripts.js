const gulp = require('gulp');
<% if (js === 'babel' || framework === 'react' && js === 'js') { -%>
const babel = require('gulp-babel');
<% } -%>
<% if (js === 'typescript') { -%>
const typescript = require('gulp-typescript');
const tsConf = require('../conf/ts.conf.json').compilerOptions;
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);

function scripts() {
  return gulp.src(conf.path.src('**/*.js'))
<% if (js === 'babel' || framework === 'react' && js === 'js') { -%>
    .pipe(babel())
<% } -%>
<% if (js === 'typescript') { -%>
    .pipe(typescript(tsConf))
<% } -%>
    .pipe(gulp.dest(conf.path.tmp()));
}
