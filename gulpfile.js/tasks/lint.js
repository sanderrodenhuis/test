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
    src: [ GlobalConfig.srcPath + '/assets/js/**/*.js']
}, GlobalConfig.lint);

gulp.task('lint', function () {
    return gulp.src(config.src);
});

gulp.task('lint-watch', ['lint'], function () {
  return watch(config.src, () => runSequence('lint'));
});

/**
 * @module tasks/lint
 * @type {{build: string, watch: string}}
 */
module.exports = {
    build: 'lint',
    watch: 'lint-watch'
};
