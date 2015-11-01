module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;

   /**
    * Create docs from ./src using ESDoc. The docs are located in ./docs
    */
   gulp.task('esdoc', function ()
   {
      var esdoc = require('gulp-esdoc');
      var path = require('path');

      var esdocConfigPath = rootPath +path.sep +'esdoc.json';

console.log("TCG - esdoc - docs - path: " +esdocConfigPath);

      var esdocConfig = require(esdocConfigPath);
      esdocConfig.jspmRootPath = rootPath;

      // Launch ESDoc
      return gulp.src(esdocConfig.source).pipe(esdoc(esdocConfig));
   });
};