/**
 * Provides Gulp tasks for working with Electron.
 *
 * The following tasks are defined:
 *
 * `electron-package-<platform>-<arch>` - Invokes "electron-packager" with the options from `electron.json` in the root
 * path. Default values are provided for `platform` -> 'process.platform', `arch` -> 'process.arch', `source` -> '.' and
 * `out` -> 'build' if not supplied. For options to provide in `electron.json` please see:
 * https://www.npmjs.com/package/electron-packager#programmatic-api
 *
 * `electron-start` - Spawns `electron .` starting the app defined in `package.json->main` entry in the root path.
 *
 * `electron-start-debug` - Spawns `electron --debug=5858 .` starting the app defined in `package.json->main`
 * entry in the root path.
 *
 * Note: For these tasks to appear you must include `electron-packager` and `electron-prebuilt` in `devDependencies`
 * of the `package.json` found in the root path.
 *
 * Please see electron-backbone-es6-localstorage-todos for a complete example:
 * https://github.com/typhonjs-demos/backbone-es6-localstorage-todos
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   var rootPath = options.rootPath;

   var electronPackager, electronPrebuilt;

   try
   {
      electronPackager = require('electron-packager');
   }
   catch (err) { /* ... */ }

   try
   {
      electronPrebuilt = require('electron-prebuilt');
   }
   catch (err) { /* ... */ }

   /**
    * Only add electron-start tasks if NPM module `electron-prebuilt` is installed.
    */
   if (electronPrebuilt)
   {
      /**
       * Spawns `electron .` starting the app defined in `package.json->main` entry in the root path.
       */
      gulp.task('electron-start', function()
      {
         require('child_process').spawn(electronPrebuilt, ['.'], { cwd: rootPath });
      });

      /**
       * Spawns `electron --debug=5858 .` starting the app defined in `package.json->main` entry in the root path.
       */
      gulp.task('electron-start-debug', function()
      {
         require('child_process').spawn(electronPrebuilt, ['--debug=5858', '.'], { cwd: rootPath });
      });

      options.loadedTasks.push('electron-start');
      options.loadedTasks.push('electron-start-debug');
   }

   /**
    * Only add electron-package task if NPM modules `electron-packager` and `electron-prebuilt` is installed in addition
    * to `electron.json` configuration file located in the root path.
    */
   if (electronPackager && electronPrebuilt)
   {
      var fs =                require('fs-extra');
      var path =              require('path');
      var stripJsonComments = require('strip-json-comments');

      var electronInfoPath = rootPath + path.sep + 'electron.json';

      if (fs.existsSync(electronInfoPath))
      {
         // Strip comments & attempt to load
         var electronJSON = fs.readFileSync(electronInfoPath).toString();
         var electronInfo = JSON.parse(stripJsonComments(electronJSON));

         // Automatically set `arch` and `platform` to `all` if true.
         if (typeof electronInfo.all === 'boolean' && electronInfo.all)
         {
            electronInfo.arch = 'all';
            electronInfo.platform = 'all';
         }

         // If `platform` is missing provide a default value: `process.platform`.
         if (typeof electronInfo.platform !== 'string')
         {
            electronInfo.platform = process.platform;
         }

         // If `arch` is missing provide a default value: `process.arch`.
         if (typeof electronInfo.arch !== 'string')
         {
            electronInfo.arch = process.arch;
         }

         // If `dir` is missing provide a default value: `.`.
         if (typeof electronInfo.source !== 'string')
         {
            electronInfo.dir = '.';
         }

         // If `out` is missing provide a default value: `build`.
         if (typeof electronInfo.out !== 'string')
         {
            electronInfo.out = 'build';
         }

         if (electronInfo.all || (electronInfo.platform && electronInfo.arch))
         {
            var taskName = 'electron-package-' + electronInfo.platform + '-' + electronInfo.arch;

            /**
             * Invokes "electron-packager" with the options from `electron.json` in the root path. Default values are
             * provided for `platform` -> 'process.platform', `arch` -> 'process.arch', `source` -> '.' and
             * `out` -> 'build' if not supplied.
             *
             * For options to provide in `electron.json` please see:
             * https://www.npmjs.com/package/electron-packager#programmatic-api
             */
            gulp.task(taskName, function(cb)
            {
               electronPackager(electronInfo, function(err, appPath)
               {
                  console.log('Packaging app complete: ' + appPath);
                  cb(err);
               });
            });

            options.loadedTasks.push(taskName);
         }
      }
   }
};