/**
 * Provides Gulp tasks for working with Git.
 *
 * The following tasks are defined:
 *
 * `git-push` - Verifies the build by running `test-basic` and on success executes `git push`.
 *
 * Note: Make sure to pass in `--travis` as an argument to Gulp to run an in memory bundle / test.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   var rootPath = options.rootPath;

   /**
    * Runs "git push", but only if the test task (`eslint` & `jspm-bundle`) complete successfully.
    *
    * Note: Make sure to pass in `--travis` as an argument to this task to run an in memory build / test.
    */
   gulp.task('git-push', ['test-basic'], function(cb)
   {
      var exec = require('child_process').exec;

      // Execute git push.
      exec('git push', { cwd: rootPath }, function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('git-push');
};