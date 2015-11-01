module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;
   var srcGlob = options.srcGlob;

   /**
    * Runs eslint
    */
   gulp.task('eslint', function()
   {
      var eslint = require('gulp-eslint');
      var fs = require('fs');
      var path = require('path');

      var eslintConfigPath = rootPath +path.sep +'.eslintrc';

      var eslintConfig = fs.readFileSync(eslintConfigPath, 'utf8');

      // Remove all comments formatted between /* */
      eslintConfig = eslintConfig.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//g, '');

      // Parse the eslint config as JSON.
      eslintConfig = JSON.parse(eslintConfig);

      return gulp.src(srcGlob)
       .pipe(eslint(eslintConfig))
       .pipe(eslint.formatEach('compact', process.stderr))
       .pipe(eslint.failOnError());
   });
};