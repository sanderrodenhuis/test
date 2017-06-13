/**
 * @file This task compiles the handlebars templates to html,
 * When --production flag is used, the paths to css & js will be replaced
 * */
var gulp = require('gulp'),
    Events = require('../events'),
    GlobalConfig = require('./../global-config'),
    handlebars = require('gulp-compile-handlebars'),
    htmlreplace = require('gulp-html-replace'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence').use(gulp);

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
const config = Object.assign({
  all: GlobalConfig.srcPath + '/templates/**/*.hbs',
  dir: GlobalConfig.srcPath + '/templates',
  src: GlobalConfig.srcPath + '/templates/*.hbs',
  dest: GlobalConfig.destPath
}, GlobalConfig.handlebars);

/**
 * Timestamp used for cache busting when making a production build.
 * @type {number}
 */
var timestamp = Date.now();

gulp.task('handlebars', function () {
  var siteData = {};
  
  var options = {
    ignorePartials: false,
    batch: [config.dir]
  };
  
  var isDev = GlobalConfig.environment === 'development';
  
  return gulp.src(config.src)
    .pipe(handlebars(siteData, options))
    .pipe(rename(function (path) {
      path.extname = '.html'
    }))
    .pipe(gulpif( !isDev, htmlreplace({
      'css': 'assets/css/style.min.css?v=' + timestamp,
      'js': 'assets/js/main.min.js?v=' + timestamp
    })))
    .pipe(gulp.dest(config.dest))
    .on('finish', () => Events.emit('build','html'));
});

gulp.task('handlebars-watch', ['handlebars'], function () {
  return watch(config.all, () => runSequence('handlebars') );
});

/**
 * @module tasks/handlebars
 * @type {{build: string, watch: string}}
 */
module.exports = {
  build: 'handlebars',
  watch: 'handlebars-watch'
};

