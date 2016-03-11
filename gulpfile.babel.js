/**
 * Gulp operations - Used for Travis CI / testing
 * Please see https://www.npmjs.com/package/typhonjs-core-gulptasks
 */

import fs            from 'fs';
import gulp          from 'gulp';

import gulpTasks     from './src/index.js';

import taskListing   from 'gulp-task-listing';

// Loads all tasks
gulpTasks(gulp,
{
   rootPath: __dirname,
   srcGlob: ['./src/index.js', './src/tasks/**/*.js']
});

/**
 * Generates task listing
 */
gulp.task('local-test', () =>
{
   taskListing.withFilters(null, ['local-test', 'verify-test'])();
});

/**
 * Verifies task listing data
 */
gulp.task('verify-test', () =>
{
   const testData = fs.readFileSync('./test/testdata.txt', 'utf8');
   const matchData = fs.readFileSync('./test/matchdata.txt', 'utf8');

   if (matchData !== testData)
   {
      console.log('Verification failed');
      process.exit(1);
   }
   else
   {
      console.log('Verification passed');
   }
});