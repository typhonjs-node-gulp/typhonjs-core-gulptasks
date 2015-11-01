/**
 * Provides Gulp tasks for working with ESLint / `gulp-eslint`.
 *
 * The following tasks are defined:
 * `eslint` - Runs ESLint with the given source glob with the `.eslintrc` defined in the root path.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function (gulp, options)
{
   // The root path of the project being operated on via all tasks.
   var rootPath = options.rootPath;

   // The source glob defining all sources.
   var srcGlob = options.srcGlob;

   /**
    * Runs ESLint with the given source glob with the `.eslintrc` defined in the root path.
    */
   gulp.task('eslint', function()
   {
      var eslint = require('gulp-eslint');
      var fs = require('fs');
      var path = require('path');

      // The location of the `.eslintrc` configuration file.
      var eslintConfigPath = rootPath +path.sep +'.eslintrc';

      if (!fs.existsSync(eslintConfigPath))
      {
         console.error('Could not locate `.eslintrc` at: ' +eslintConfigPath);
         process.exit(1);
      }

      var eslintConfig = fs.readFileSync(eslintConfigPath, 'utf8');

      // Remove all comments formatted between /* ... */
      eslintConfig = eslintConfig.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//g, '');

      // Parse the eslint config as JSON.
      eslintConfig = JSON.parse(eslintConfig);

      // Run ESLint
      return gulp.src(srcGlob)
       .pipe(eslint(eslintConfig))
       .pipe(eslint.formatEach('compact', process.stderr))
       .pipe(eslint.failOnError());
   });
};