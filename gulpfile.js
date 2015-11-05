/**
 * Gulp operations - Used for Travis CI / testing
 * Please see https://www.npmjs.com/package/typhonjs-core-gulptasks
 */

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