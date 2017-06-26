/**
 * @file This task uses browserify to add 'require()' functionality,
 * with this you traverse the require tree in the project to wrap it appropriately,
 * after that use babelify to transpile es2015 to es5 and use watchify to watch file changes,
 * also it adds sourcemaps and minifies the file.
 */
let gulp = require('gulp'),
    GlobalConfig = require('./../global-config'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    envify = require('envify'),
    watchify = require('watchify'),
    eventStream = require('event-stream'),
    logger = require("eazy-logger").Logger({
      prefix: "[{blue:JS}] "
    }),
    gulpif = require('gulp-if'),
    Events = require('../events');

/**
 * Local config that's overwritten by properties from the global config if they exist
 * @type {Object}
 */
var config = Object.assign({
    src: [ GlobalConfig.srcPath + '/assets/js/main.js'],
    dest: GlobalConfig.destPath + '/assets/js',
    babelify: {
        presets: ['es2015'] // change to es2015-loose if you want ie9 support
    }
}, GlobalConfig.browserify);

/**
 * Create JS file with sourcemaps, if the environment is production, minify the javascript
 * @param bundler
 * @param filename
 * @returns {Stream}
 */
var bundle = function (bundler, filename) {
    logger.info('Bundling \'{yellow:%s}\'', filename);
    var isDev = GlobalConfig.environment === 'development';
    var bundle = bundler.bundle()
        .on('error', function(error) {
          logger.error("{red:SyntaxError} %s\r\n%s", error);
        })
        .pipe(source(filename))
        .pipe(buffer())
        .pipe(rename({dirname: ''}))
            .pipe(gulpif( !isDev, gulp.dest(config.dest)))
            .pipe(gulpif( !isDev, rename({extname: '.min.js'})))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(gulpif( !isDev, uglify()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dest));

    return bundle;
};


let cache = {},
    pkgCache = {};
/**
 * Function gets JS src files and creates a bundle which can be used in the gulp event stream
 * @param callback
 * @param watchCallback
 */
var build = function (callback, watchCallback) {
    // See if watchCallback is set and convert in a boolean
    var hasWatch = !!watchCallback;

    // Map the array with JS sourcefiles and create a bundle for each one
    var tasks = config.src.map(function (file) {
        var filename = file.split('/').pop();

        // Use browserify to traverse through the required partials, if hasWatch use watchify
        var bundler = browserify({
            entries: file,
            plugin: hasWatch ? [watchify] : undefined,
            debug: (GlobalConfig.environment !== 'production'),
            cache: (GlobalConfig.environment !== 'production') ? cache : undefined,
            packageCache: (GlobalConfig.environment !== 'production') ? pkgCache : undefined,
            fullPaths: (GlobalConfig.environment !== 'production')
        });

        // Transpile the JS into ES5 using Babelify
        bundler
            .transform(envify, {global: true})
            .transform(babelify);

        // If hasWatch put event listeners on the bundler
        if (hasWatch) {
            bundler.on('update', function () {
                bundle(bundler, file).on('end', watchCallback);
            });
            bundler.on('log', function (msg) {
                logger.info("{yellow:%s}: %s", filename, msg);
            });
        }

        // Return file as bundle() with all the options set
        return bundle(bundler, file);
    });


    if (hasWatch)
        eventStream.merge(tasks);

    eventStream.merge(tasks).on('end', callback);
};

gulp.task('browserify', ['lint'], function (done) {
    return build(done);
});

gulp.task('browserify-watch', function (done) {
  return build(done, () => {
    Events.emit('build','javascript');
  });
});

/**
 * @module tasks/browserify
 * @type {{build: string, watch: string}}
 */
module.exports = {
    build: 'browserify',
    watch: 'browserify-watch'
};
