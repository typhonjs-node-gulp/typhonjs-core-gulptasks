/**
 * Provides Gulp tasks for testing.
 *
 * The following tasks are defined:
 * `test-basic` - Sets process.env.TRAVIS and runs `eslint` and `jspm-bundle`; useful for basic testing and Travis CI.
 *
 * @param {Gulp}  gulp  - An instance of Gulp.
 */
module.exports = function(gulp)
{
   /**
    * Runs `eslint` and `jspm-bundle`; useful for basic testing and Travis CI.
    */
   gulp.task('test-basic', function(cb)
   {
      // Set TRAVIS environment variable to run all tasks in testing mode.
      process.env.TRAVIS = true;

      var runSequence = require('run-sequence').use(gulp);
      runSequence('eslint', 'jspm-bundle', cb);
   });
};
