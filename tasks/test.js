module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;

   /**
    * Runs "lint" and "bundle"; useful for testing and Travis CI.
    */
   gulp.task('test', ['eslint', 'jspm-bundle']);
};
