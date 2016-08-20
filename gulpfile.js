var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var mocha = require('gulp-mocha');
var argv = require('yargs').argv;
var git = require('gulp-git');
var runSequence = require('run-sequence');

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

gulp.task('add', function() {
  console.log('adding...');
  return gulp.src('.')
    .pipe(git.add());
});

gulp.task('commit', function(){
  console.log('committing...');
  if (argv.m) {
    return gulp.src('.')
      .pipe(git.commit(argv.m));
  }
});

gulp.task('push', function(){
  console.log('pushing...');
  git.push('origin', 'master', function(err){
    if(err) throw err;
  });
})

gulp.task('gitupload', function(){
  runSequence('add', 'commit', 'push');
})

gulp.task('default', ['watch']);
