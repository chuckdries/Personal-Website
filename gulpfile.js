var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var del = require('del');
var Hexo = require('hexo');

gulp.task('default', function () {
  connect.server({
    port: 3000,
    root: 'public',
    livereload: true
  });
  gulp.watch("source/*", ['clean', 'generate', 'style', 'reload']);
})
gulp.task('style', function () {
  return gulp.src('source/_sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/'));
});
gulp.task('reload', function () {
  return gulp.src('public/*.html')
    .pipe(connect.reload());
});
gulp.task('clean', function () {
  return del(['public/*']);
})

var hexo = new Hexo(process.cwd(), {});
gulp.task('hexo', function (cb) {
  hexo.init().then(function() {
    return hexo.call('generate', {
      watch: false
    });
  }).then(function(){
    return hexo.exit()
  }).then(function() {
    return cb();
  }).catch(function(err){
    console.error(err);
    hexo.exit(err);
    return cb(err);
  })
})