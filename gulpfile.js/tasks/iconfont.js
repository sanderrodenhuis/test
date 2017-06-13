/**
 * @file Task to generate an iconfont from a directory of svg's and add it to a sass partial
 * */
var gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence').use(gulp),
    Events = require('../events');

var runTimestamp = Math.round(Date.now() / 1000);

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
var config = Object.assign({
    name: 'custom-icon-font',
    src: GlobalConfig.srcPath + '/assets/fonts/icons/*.svg',
    dest: GlobalConfig.destPath + '/assets/fonts/',
    destCss: '../../../src/assets/sass/01_variables/_icon-font.scss',
    destInternal: '../fonts/',
    cssClass: 'icon',
    template: './gulpfile.js/tasks/iconfont.tpl'
}, GlobalConfig.iconfont);

gulp.task('iconfont', function () {
    return gulp.src([config.src])
        .pipe(iconfontCss({
            fontName: config.name,
            path: config.template,
            targetPath: config.destCss,
            fontPath: config.destInternal,
            cssClass: config.cssClass
        }))
        .pipe(iconfont({
            fontName: config.name,
            prependUnicode: true,
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
            timestamp: runTimestamp,
            normalize: true,
            fontHeight: 1001

        }))
        .pipe(gulp.dest(config.dest))
        .on('finish', () => Events.emit('build','iconfont'));
});

gulp.task('iconfont-watch', ['iconfont'], function () {
    return watch(config.src, () => runSequence('iconfont'));
});

/**
 * @module tasks/iconfont
 * @type {{build: string, watch: string}}
 */
module.exports = {
    build: 'iconfont',
    watch: 'iconfont-watch'
};
