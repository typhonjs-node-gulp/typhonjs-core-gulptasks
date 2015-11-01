var argv =     require('yargs').argv;
var fs =       require('fs');

var Promise =  require("bluebird");

/**
 * Returns a Promise which encapsulates an execution of SystemJS Builder.
 *
 * @param jspm
 * @param srcFilename
 * @param destDir
 * @param destFilepath
 * @param minify
 * @param mangle
 * @param format
 * @param extraConfig
 * @returns {bluebird} Promise
 */
function buildStatic(jspm, srcFilename, destDir, destFilepath, minify, mangle, format, extraConfig)
{
   return new Promise(function(resolve, reject)
   {
      if (!fs.existsSync(destDir))
      {
         fs.mkdirSync(destDir);
      }

      if (!fs.existsSync(destDir))
      {
         console.error('Could not create destination directory: ' +destDir);
         reject();
      }

      var builder = new jspm.Builder();
      builder.loadConfig('./config.js').then(function()
      {
         if (typeof extraConfig !== 'undefined')
         {
            builder.config(extraConfig);
         }

         console.log('Bundle queued - srcFilename: ' +srcFilename +'; format: ' +format  +'; mangle: ' +mangle
          +'; minify: ' +minify +'; destDir: ' +destDir +'; destFilepath: ' +destFilepath);

         var builderPromise;
         var builderConfig =
         {
            minify: minify,
            mangle: mangle,
            format: format
         };

         // When testing we only need to do an in memory build.
         if (argv.travis)
         {
            builderPromise = builder.buildStatic(srcFilename, builderConfig);
         }
         else
         {
            builderPromise = builder.buildStatic(srcFilename, destFilepath, builderConfig);
         }

         builderPromise.then(function ()
         {
            console.log('Bundle complete - filename: ' +destFilepath +' minify: ' +minify +'; mangle: ' +mangle
             +'; format: ' +format);

            resolve();
         })
          .catch(function(err)
          {
             console.log('Bundle error - filename: ' +destFilepath +' minify: ' +minify + '; mangle: ' +mangle
              +'; format: ' +format);

             console.log(err);

             reject(err);
          });
      });
   });
}

module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;

   /**
    * Bundles Backbone-Parse-Typhon-ES6 via the config file found in './bundle-config.json'. This file contains an array of
    * parameters for invoking SystemJS Builder.
    *
    * An example entry:
    *    {
    *       "destBaseDir": "./dist/",        // Root destination directory for bundle output.
    *       "destFilename": "backbone.js",   // Destination bundle file name.
    *       "formats": ["amd", "cjs"],       // Module format to use / also defines destination sub-directory.
    *       "mangle": false,                 // Uglify mangle property used by SystemJS Builder.
    *       "minify": false,                 // Minify mangle property used by SystemJS Builder.
    *       "src": "src/ModuleRuntime.js",   // Source file for SystemJS Builder
    *       "extraConfig":                   // Defines additional config parameters to load after ./config.json is loaded.
    *       {
    *          "meta":
    *          {
    *             "jquery": { "build": false },
    *             "underscore": { "build": false }
    *          }
    *       }
    *    },
    */
   gulp.task('jspm-bundle', function()
   {
console.log("TCG - jspm-bundle - argv.travis: " +argv.travis);

      var jspm = require('jspm');
      var path = require('path');

      // Set the package path to the local root where config.js is located.
      jspm.setPackagePath(rootPath);

      var promiseList = [];

      // When testing the build in Travis CI we only need to run a single bundle operation.
      var bundleInfo = argv.travis ? require(rootPath +path.sep +'bundle-config-travis.json') :
       require(rootPath +path.sep +'bundle-config.json');

      var distPath = rootPath +path.sep +'dist';

      // Attempt to create './dist' directory if it does not exist.
      if (!fs.existsSync(distPath))
      {
         fs.mkdirSync(distPath);
      }

      // Error out early if destDir does not exist.
      if (!fs.existsSync(distPath))
      {
         console.error('Could not create destination directory: ' +distPath);
         process.exit(1);
      }

      for (var cntr = 0; cntr < bundleInfo.entryPoints.length; cntr++)
      {
         var entry = bundleInfo.entryPoints[cntr];

         var destBaseDir = entry.destBaseDir;
         var destFilename = entry.destFilename;
         var srcFilename = entry.src;
         var extraConfig = entry.extraConfig;
         var formats = entry.formats;
         var mangle = entry.mangle;
         var minify = entry.minify;

         for (var cntr2 = 0; cntr2 < formats.length; cntr2++)
         {
            var format = formats[cntr2];

            var destDir = destBaseDir +format;
            var destFilepath = destDir +'/' +destFilename;

            promiseList.push(buildStatic(jspm, srcFilename, destDir, destFilepath, minify, mangle, format,
             extraConfig));
         }
      }

      return Promise.all(promiseList).then(function()
      {
         console.log('All Bundle Tasks Complete');
      })
      .catch(function (err)
      {
         console.log('Bundle error: ' +err);
         process.exit(1);
      });
   });

   /**
    * Runs "jspm install"
    */
   gulp.task('jspm-install', function(cb)
   {
      var exec = require('child_process').exec;
      exec('jspm install', { cwd: rootPath }, function (err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   /**
    * Runs "jspm inspect"
    */
   gulp.task('jspm-inspect', function(cb)
   {
      var exec = require('child_process').exec;
      exec('jspm inspect', { cwd: rootPath }, function (err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });
};
