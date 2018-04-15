var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sass = require('gulp-sass');
// var pug = require('gulp-pug');

gulp.task('css', function() {
  gulp.src('app/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./app/css/'));
});

// gulp.task('html', function() {
//   gulp.src('app/views/**/*.pug')
//       .pipe($.pug ({pretty: true, doctype: 'html'}))
//       .pipe(gulp.dest('./app/html/'));
// });

// gulp.task('html', function() {
//   gulp.src('app/views/**/*.pug')
//       .pipe($.pug ({pretty: true, doctype: 'html'}))
//       .on('error', $.util.log)
//       .pipe(gulp.dest('./html/'));
// });

//Watch task
gulp.task('watch',function() {
  gulp.watch('app/sass/**/*.scss',['styles']);
  // gulp.watch('app/views/**/*.pug',['html']);
});

gulp.task('default', ['css', 'watch'], function() {});