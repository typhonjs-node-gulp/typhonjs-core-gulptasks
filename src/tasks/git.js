import cp   from 'child_process';

/**
 * Provides Gulp tasks for working with Git.
 *
 * The following tasks are defined:
 *
 * `git-push` - Verifies the build by running `test-basic` and on success executes `git push`.
 *
 * Note: Make sure to pass in `--travis` as an argument to Gulp to run an in memory bundle / test.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   const rootPath = options.rootPath;

   /**
    * Runs "git push", but only if the test task (`eslint` & `jspm-bundle`) complete successfully.
    *
    * Note: Make sure to pass in `--travis` as an argument to this task to run an in memory build / test.
    */
   gulp.task('git-push', ['test-basic'], (cb) =>
   {
      // Execute git push.
      cp.exec('git push', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('git-push');
}