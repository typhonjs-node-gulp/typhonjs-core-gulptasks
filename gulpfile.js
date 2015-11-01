/**
 * Gulp operations - Used for Travis CI / testing
 *
 * The following tasks are available and defined in `typhon-core-gulptasks`:
 * esdocs - Creates ES6 documentation including `esdoc-plugin-jspm` support and outputs it in './docs'
 * eslint - Runs ESLint outputting to console.
 * jspm-bundle - Creates one or more bundles defined in './bundle-config.js' (Add "--travis" argument to run minimal
 *               bundle op for Travis CI.)
 * jspm-inspect - Executes 'jspm inspect'
 * jspm-install - Executes 'jspm install'
 * npm-install - Executes 'npm install'
 * npm-uninstall - Executes 'npm uninstall'
 * test - Runs eslint and jspm-bundle tasks.  (Add "--travis" argument to run minimal bundle op for Travis CI.)
 */

/* eslint-disable */

var gulp = require('gulp');

// require all tasks
require('./index.js')(gulp, { rootPath: __dirname, srcGlob: './src/**/*.js' });

/**
 * Generates task listing
 */
gulp.task('local-test', function()
{
   var taskListing = require('gulp-task-listing');
   taskListing.withFilters(null, ['local-test', 'verify-test'])();
});

/**
 * Verifies task listing data
 */
gulp.task('verify-test', function()
{
   var fs = require('fs');

   var testData = fs.readFileSync('./test/testdata.txt', 'utf8');
   var matchData = fs.readFileSync('./test/matchdata.txt', 'utf8');

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