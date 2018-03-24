var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var del = require('del');
var Hexo = require('hexo');
var runSequence = require('run-sequence');

gulp.task('default',['style'], function () {
  // connect.server({
  //   port: 3000,
  //   root: 'public',
  //   livereload: true
  // });
  gulp.watch("themes/chucksite/source/_sass/*", ['style']);
})

gulp.task('cleanStyle', function() {
  return del(['public/css/*','db.json']);
});

gulp.task('style', ['cleanStyle'], function () {
  return gulp.src('themes/chucksite/source/_sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('reload', function () {
  return gulp.src('/public/*.html')  
    .pipe(connect.reload());
});

gulp.task('go', function(cb) {
  runSequence('style', 'reload', cb)
});
