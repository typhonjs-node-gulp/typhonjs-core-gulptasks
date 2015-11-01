/**
 * Provides Gulp tasks for working with the JSPM CLI and SystemJS Builder.
 *
 * The following tasks are defined:
 * `jspm-bundle` - Bundles the project via the config file found in `./config/bundle-config.json` or
 * `./config/bundle-config-travis.json` if `--travis` is supplied as an argument to Gulp.
 *
 * `jspm-inspect` - Runs `jspm inspect` via JSPM CLI.
 *
 * `jspm-install` - Runs `jspm install` via JSPM CLI.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
var argv =     require('yargs').argv;
var fs =       require('fs');

var Promise =  require("bluebird");

module.exports = function (gulp, options)
{
   // The root path of the project being operated on via all tasks.
   var rootPath = options.rootPath;

   /**
    * Bundles the project via the config file found in `./config/bundle-config.json` or
    * `./config/bundle-config-travis.json` if `--travis` is supplied as an argument to Gulp. This file contains an
    * array of parameters for invoking SystemJS Builder.
    *
    * An example entry:
    * [
    *    {
    *       "destBaseDir": "./dist",         // Root destination directory for bundle output.
    *       "destFilename": "<filename>.js", // Destination bundle file name.
    *       "formats": ["amd", "cjs"],       // Module format to use / also defines destination sub-directory.
    *       "mangle": false,                 // Uglify mangle property used by SystemJS Builder.
    *       "minify": false,                 // Minify mangle property used by SystemJS Builder.
    *       "src": "src/ModuleRuntime.js",   // Entry source point for SystemJS Builder
    *       "extraConfig":                   // Defines additional JSPM config parameters to load after ./config.json is
    *       {                                // loaded. Provide a string and it will be interpreted as an additional
    *          "meta":                       // configuration file styled like `config.js` or provide an object hash
    *          {                             // which is loaded directly.  This example skips building `jquery` and
    *             "jquery": { "build": false },    // `underscore`.
    *             "underscore": { "build": false }
    *          }
    *       }
    *    }
    * ]
    */
   gulp.task('jspm-bundle', function()
   {
      var jspm = require('jspm');
      var path = require('path');

      // Set the package path to the local root where config.js is located.
      jspm.setPackagePath(rootPath);

      var promiseList = [];

      // When testing the build in Travis CI we only need to run a single bundle operation.
      var bundleInfo = argv.travis ? require(rootPath +path.sep +'config' +path.sep +'bundle-config-travis.json') :
       require(rootPath +path.sep +'config' +path.sep +'bundle-config.json');

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

         // Remove an leading local directory string
         destBaseDir = destBaseDir.replace(new RegExp('^\.' +(path.sep === '\\' ? '\\' +path.sep : path.sep)), '');

         // Complete full path including root path of the project.
         destBaseDir = rootPath +path.sep +destBaseDir;

         // Attempt to create destBaseDir directory if it does not exist.
         if (!fs.existsSync(destBaseDir))
         {
            fs.mkdirSync(destBaseDir);
         }

         // Error out early if destBaseDir does not exist.
         if (!fs.existsSync(destBaseDir))
         {
            console.error('Could not create destination directory: ' +destBaseDir);
            process.exit(1);
         }

         for (var cntr2 = 0; cntr2 < formats.length; cntr2++)
         {
            var format = formats[cntr2];

            var destDir = destBaseDir +path.sep +format;
            var destFilepath = destDir +path.sep +destFilename;

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
    * Runs `jspm inspect` via JSPM CLI.
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

   /**
    * Runs `jspm install` via JSPM CLI.
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
};

/**
 * Returns a Promise which encapsulates an execution of SystemJS Builder.
 *
 * @param {jspm}     jspm           - An instance of JSPM.
 * @param {string}   srcFilename    - Source entry point for SystemJS Builder.
 * @param {string}   destDir        - Destination directory for bundle.
 * @param {string}   destFilepath   - Destination file path for bundle.
 * @param {boolean}  minify         - Potentially minify bundle.
 * @param {boolean}  mangle         - Potentially mangle bundle.
 * @param {string}   format         - Module format
 * @param {object}   extraConfig    - Optional JSPM config to load after `config.js`.
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

      var additionalConfig = './config.js';

      // Default to loading './config.js' twice unless extraConfig defines a string / file path to load.
      if (typeof extraConfig === 'string')
      {
         additionalConfig = extraConfig;
      }

      var builder = new jspm.Builder('./config.js');

      builder.loadConfig(additionalConfig).then(function()
      {
         // If extraConfig is an object literal / hash then load it now.
         if (typeof extraConfig === 'object')
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