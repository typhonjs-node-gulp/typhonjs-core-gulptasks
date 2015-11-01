/**
 * Requires all Gulp tasks.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function (gulp, options)
{
   require('./tasks/esdoc.js')(gulp, options);
   require('./tasks/eslint.js')(gulp, options);
   require('./tasks/git.js')(gulp, options);
   require('./tasks/jspm.js')(gulp, options);
   require('./tasks/npm.js')(gulp, options);
   require('./tasks/test.js')(gulp, options);
};