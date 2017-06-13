let gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    BrowserSync = require('browser-sync'),
    Events = require('../events'),
    sassConfig = require('./sass').config,
    imageConfig = require('./images').config;


let config = Object.assign({
  basePath: GlobalConfig.destPath,
  watchFiles: [
    sassConfig.dest + '**/*.*',
    imageConfig.dest + '**/*.*'
  ]
}, GlobalConfig.browserSync);


gulp.task('browsersync',function(done){
  done();
});

gulp.task('browsersync-watch',function() {
  let bs = BrowserSync.create();
  bs.init({
    files: config.watchFiles,
    server: config.basePath
  });
  
  
  Events.on('build','javascript',bs.reload);
  Events.on('build','html',bs.reload);
  
});

module.exports = {
  build: 'browsersync',
  watch: 'browsersync-watch',
  config: config
};
