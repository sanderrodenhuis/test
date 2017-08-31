/**
 * @file Task to lint the javascript, also uses jscs to check the javascript styling
 */
var gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    runSequence = require('run-sequence').use(gulp),
    watch = require('gulp-watch');

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
var config = Object.assign({
  src: GlobalConfig.srcPath + '/assets/files/**/*',
  dest: GlobalConfig.destPath + '/assets/files/',
  base: GlobalConfig.srcPath + '/assets/files/'
}, GlobalConfig.copy);

gulp.task('copy', function () {
  return gulp.src(config.src,{base: config.base}).pipe(gulp.dest(config.dest));
});

gulp.task('copy-watch', ['copy'], function () {
  return watch(config.src, () => runSequence('copy'));
});

/**
 * @module tasks/lint
 * @type {{build: string, watch: string}}
 */
module.exports = {
  build: 'copy',
  watch: 'copy-watch'
};
