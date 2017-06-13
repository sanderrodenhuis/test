/**
 * @file This task optimizes the images and copies them to the dist folder
 */
let gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence').use(gulp),
    Events = require('../events');

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
const config = Object.assign({
  src: GlobalConfig.srcPath + '/assets/images/**/*.{jpg,jpeg,svg,gif,png}',
  dest: GlobalConfig.destPath + '/assets/images/'
}, GlobalConfig.images);

gulp.task('images', function () {
  return gulp.src(config.src)
    .pipe(changed(config.dest))
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(config.dest))
    .on('finish', () => Events.emit('build','images'));
});

gulp.task('images-watch', ['images'], function () {
  return watch(config.src, () => runSequence('images'));
});

/**
 * @module tasks/images
 * @type {{build: string, watch: string}}
 */
module.exports = {
  build: 'images',
  watch: 'images-watch',
  config: config
};
