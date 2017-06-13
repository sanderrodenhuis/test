/**
 * @file This tasks compiles scss into css,
 * adds sourcemaps,
 * uses autoprefixer for vendor prefixes,
 * minifies the css file when using --production.
 */
var gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    nano = require('gulp-cssnano'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence').use(gulp),
    Events = require('../events');

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
var config = Object.assign({
  all: GlobalConfig.srcPath + '/assets/sass/**/*.scss',
  src: GlobalConfig.srcPath + '/assets/sass/main.scss',
  dest: GlobalConfig.destPath + '/assets/css/',
  filename: 'style',
  autoprefixer: ['last 2 versions']
}, GlobalConfig.sass);

gulp.task('sass', function () {
  var isDev = GlobalConfig.environment === 'development';
  return gulp.src(config.src)
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: config.autoprefixer
    }))
    .pipe(rename({
      basename: config.filename
    }))
    .pipe(gulpif(!isDev, rename({
      suffix: '.min'
    })))
    .pipe(gulpif( !isDev, nano()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .on('finish', () => Events.emit('build','css'));
});
gulp.task('sass-watch', ['sass'], function () {
  return watch(config.all, () => runSequence('sass'));
});

/**
 * @module tasks/sass
 * @type {{build: string, watch: string}}
 */
module.exports = {
  build: 'sass',
  watch: 'sass-watch',
  config: config
};
