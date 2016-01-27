/**
 * Provides Gulp tasks for working with `ESDoc` / `gulp-esdoc`.
 *
 * The following tasks are defined:
 *
 * `esdoc` - Create docs using `esdoc.json` to define the source and destination locations including support for
 * `esdoc-plugin-jspm`.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   var rootPath = options.rootPath;

   /**
    * Create docs using `esdoc.json` to define the source and destination locations.
    */
   gulp.task('esdoc', function()
   {
      var esdoc = require('gulp-esdoc');
      var fs =    require('fs');
      var path =  require('path');

      // The location of the `esdoc.json` configuration file.
      var esdocConfigPath = rootPath + path.sep + 'esdoc.json';

      if (!fs.existsSync(esdocConfigPath))
      {
         console.error('Could not locate `esdoc.json` at: ' + esdocConfigPath);
         process.exit(1);
      }

      var esdocConfig = require(esdocConfigPath);

      // Set the jspmRootPath to the root path of the project; utilized by `esdoc-plugin-jspm`.
      esdocConfig.jspmRootPath = rootPath;

      // Launch ESDoc
      return gulp.src(esdocConfig.source).pipe(esdoc(esdocConfig));
   });

   options.loadedTasks.push('esdoc');
};