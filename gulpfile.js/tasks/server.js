var gulp = require('gulp'),
    GlobalConfig = require('../global-config'),
    nodemon = require('gulp-nodemon'),
    logger = require("eazy-logger").Logger({
      prefix: "[{blue:SERVER}] "
    });

var config = Object.assign({
  script: 'server/index.js',
  extensions: 'js',
  watch: 'server',
}, GlobalConfig.server);

gulp.task('server', (done) => done());
gulp.task('server-watch', (done) => {
  logger.info('Starting back-end server');
  return nodemon({
    script: config.script,
    ext: Array.isArray(config.extensions) ? config.extensions.join(' ') : config.extensions,
    watch: config.watch
  })
});

module.exports = {
  build: 'server',
  watch: 'server-watch',
  config: config
};
