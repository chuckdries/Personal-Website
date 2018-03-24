var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('default', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
    gulp.watch("./sass/*.scss", ['style', 'reload']);
    gulp.watch("*.html", ['reload']);
})
gulp.task('style', function() {
    gulp.src('./sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});
gulp.task('reload', function() {
    gulp.src('*.html')
        .pipe(connect.reload());
})