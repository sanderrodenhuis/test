/**
 * @file In this file are the main gulp tasks,
 * to execute them, run gulp build or gulp watch.
 * build will build the application (use --production for minified css & js),
 * watch will build & watch for filechanges.
 */
var gulp = require('gulp'),
    requireDir = require('require-dir'),
    GlobalConfig = require('./global-config'),
    tasks = requireDir('./tasks', { recurse: true, camelcase: true });

gulp.task('default', ['build']);

['build','watch'].forEach((buildType) => {
  process.env.NODE_ENV = GlobalConfig.environment;
  gulp.task(buildType, Object.keys(tasks).map(task => tasks[task][buildType]));
});
