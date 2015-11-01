/**
 * Provides Gulp tasks for testing.
 *
 * The following tasks are defined:
 * `test-basic` - Runs `eslint` and `jspm-bundle`; useful for basic testing and Travis CI.
 *
 * @param {Gulp}  gulp  - An instance of Gulp.
 */
module.exports = function(gulp)
{
   /**
    * Runs `eslint` and `jspm-bundle`; useful for basic testing and Travis CI.
    */
   gulp.task('test-basic', ['eslint', 'jspm-bundle']);
};
