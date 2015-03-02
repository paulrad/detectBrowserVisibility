var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  gulp.src('detectBrowserVisibility.js')
    .pipe(uglify({
      outSourceMap: true
    }))
    .pipe(rename({
      suffix: '.min'}
    ))
    .pipe(gulp.dest('./'));
});