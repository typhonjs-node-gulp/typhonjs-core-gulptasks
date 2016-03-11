import cp            from 'child_process';
import runSequence   from 'run-sequence';

/**
 * Provides Gulp tasks for basic testing JSPM CLI and SystemJS Builder.
 *
 * The following tasks are defined:
 *
 * `jspm-test-basic` - Runs tasks `eslint` and `jspm-bundle` in memory build. Useful for basic testing and Travis CI for
 * JSPM projects. If `eslint` task is not available then this task is hidden.
 *
 * `jspm-test-basic-git-push` - Runs `git push` via CLI, but only if the task `jspm-test-basic`
 * (`eslint` & `jspm-bundle`) completes successfully.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   const rootPath = options.rootPath;

   // If jspm can't be required then don't add any JSPM Gulp tasks.
   try { require('jspm'); }
   catch (err) { return; }

   // Only add task if eslint and jspm task categories are also included.
   if (options.importTasks.indexOf('eslint') >= 0 && options.importTasks.indexOf('jspm') >= 0)
   {
      /**
       * Runs tasks `eslint` and `jspm-bundle` in memory build. Useful for basic testing and Travis CI for
       * JSPM projects. If `eslint` task is not available then this task is hidden.
       */
      gulp.task('jspm-test-basic', (cb) =>
      {
         // Set TRAVIS environment variable to run all tasks in testing mode.
         process.env.TRAVIS = true;

         const runSequenceLocal = runSequence.use(gulp);
         runSequenceLocal('eslint', 'jspm-bundle', cb);
      });

      options.loadedTasks.push('jspm-test-basic');


      if (options.importTasks.indexOf('git') >= 0)
      {
         /**
          * Runs "git push", but only if the test task `jspm-test-basic` (`eslint` & `jspm-bundle`) complete
          * successfully.
          */
         gulp.task('jspm-test-basic-git-push', ['jspm-test-basic'], (cb) =>
         {
            // Execute git push.
            cp.exec('git push', { cwd: rootPath }, (err, stdout, stderr) =>
            {
               console.log(stdout);
               console.log(stderr);
               cb(err);
            });
         });

         options.loadedTasks.push('jspm-git-push');
      }
   }
}