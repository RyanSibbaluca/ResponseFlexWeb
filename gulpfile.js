var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var mocha = require('gulp-mocha');

gulp.task('sass', function() {
  return gulp.src('assets/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('assets/scss/**/*.scss', ['sass']);
  gulp.watch(['*.html','assets/js/**/*.js'], browserSync.reload);
  gulp.watch(['assets/js/**/*.js', 'test/**/*.js'], ['mocha']);
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })
});

gulp.task('mocha', function(){
  return gulp.src(['test/*.js'], {read: false})
    .pipe(mocha({
      report: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('default', ['watch']);
