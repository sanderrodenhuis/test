/**
 * @file In this file you can find the global config settings,
 * It's a plain JS object that gets exported so it can be imported in the seperate tasks.
 * Via this file you can overwrite the config setting for a specific gulp task
 * with yargs you can use --production in your command so the tasks get executed in production mode
 */
var argv = require('yargs').argv;

/**
 * @module 'global-config'
 * @type {Object}
 */
module.exports = {
    environment: argv.production ? 'production' : 'development', // 'development' or 'production'
    srcPath: './client/src',
    destPath: './client/dist'
};
