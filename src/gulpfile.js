'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    src_main : './src/scss/style.scss',
    src_sass : './src/scss/**/*.scss',
    public_sass : './public/stylesheets/'
};

// SASS Compiler.
gulp.task('sass', function () {
  return gulp.src(paths.src_main)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.public_sass));
});

gulp.task('default',['sass'], function () {
  gulp.watch(paths.src_sass, ['sass']);
});
