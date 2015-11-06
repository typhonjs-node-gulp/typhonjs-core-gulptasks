/**
 * Provides Gulp tasks for working with the JSPM CLI and SystemJS Builder.
 *
 * The following tasks are defined:
 * `jspm-bundle` - Bundles the project via the config file found in `./config/bundle-config.json` or
 * `./config/bundle-config-travis.json` if `--travis` is supplied as an argument to Gulp.
 *
 * `jspm-clear-config` - Removes all `paths` and `map` entries that may be populated in the primary / root `config.js`.
 * Performs a git commit if `config.js` was modified.
 *
 * `jspm-clear-config-git-push` - Runs `test-basic` then runs in sequence the following tasks: `jspm-clear-config` and
 * `git-push`
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

module.exports = function(gulp, options)
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
      var bundleInfo = argv.travis || process.env.TRAVIS ? require(rootPath + path.sep + 'config' + path.sep
       + 'bundle-config-travis.json') : require(rootPath + path.sep + 'config' + path.sep + 'bundle-config.json');

      for (var cntr = 0; cntr < bundleInfo.entryPoints.length; cntr++)
      {
         var entry = bundleInfo.entryPoints[cntr];

         var inMemoryBuild = entry.inMemoryBuild || false;
         var destBaseDir = entry.destBaseDir;
         var destFilename = entry.destFilename;
         var srcFilename = entry.src;
         var extraConfig = entry.extraConfig;
         var formats = entry.formats;
         var mangle = entry.mangle;
         var minify = entry.minify;

         if (!inMemoryBuild)
         {
            // Remove an leading local directory string
            destBaseDir = destBaseDir.replace(new RegExp('^\.' + (path.sep === '\\' ? '\\' + path.sep : path.sep)), '');

            // Complete full path including root path of the project.
            destBaseDir = rootPath + path.sep + destBaseDir;

            // Attempt to create destBaseDir directory if it does not exist.
            if (!fs.existsSync(destBaseDir))
            {
               fs.mkdirSync(destBaseDir);
            }

            // Error out early if destBaseDir does not exist.
            if (!fs.existsSync(destBaseDir))
            {
               console.error('Could not create destination directory: ' + destBaseDir);
               process.exit(1);
            }
         }

         for (var cntr2 = 0; cntr2 < formats.length; cntr2++)
         {
            var format = formats[cntr2];

            if (!inMemoryBuild)
            {
               var destDir = destBaseDir + path.sep + format;
               var destFilepath = destDir + path.sep + destFilename;
            }

            promiseList.push(buildStatic(jspm, inMemoryBuild, srcFilename, destDir, destFilepath, minify, mangle,
             format, extraConfig));
         }
      }

      return Promise.all(promiseList).then(function()
      {
         console.log('All Bundle Tasks Complete');
      })
      .catch(function(err)
      {
         console.log('Bundle error: ' + err);
         process.exit(1);
      });
   });

   /**
    * Removes all `paths` and `map` entries that may be populated in the primary / root `config.js`. If `config.js` is
    * modified a git commit for `config.js` is performed.
    *
    * Note: Make sure to pass in `--travis` as an argument to Gulp to run an in memory bundle / test.
    */
   gulp.task('jspm-clear-config', function(cb)
   {
      var exec = require('child_process').exec;
      var fs = require('fs');
      var path = require('path');
      var vm = require('vm');

      // The location of the JSPM `config.js` configuration file.
      var jspmConfigPath = rootPath + path.sep + 'config.js';

      if (!fs.existsSync(jspmConfigPath))
      {
         console.error('Could not locate JSPM `config.js` at: ' + jspmConfigPath);
         process.exit(1);
      }

      var buffer = fs.readFileSync(jspmConfigPath, 'utf8');

      // Remove the leading and trailing Javascript SystemJS config method invocation so we are left with a JSON file.
      buffer = buffer.replace('System.config(', '');
      buffer = buffer.replace(');', '');

      // Load buffer as object.
      var config = vm.runInThisContext('object = ' + buffer);

      // Only modify config.js if map and paths is not empty.
      if (Object.keys(config.map).length > 0 || Object.keys(config.paths).length > 0)
      {
         // Remove map and paths.
         config.map = {};
         config.paths = {};

         // Rewrite the config.js buffer.
         buffer = 'System.config(' + JSON.stringify(config, null, 2) + ');';

         // Remove quotes around primary keys ignoring babelOptions / `optional`.
         buffer = buffer.replace(/"([a-zA-Z]+)":/g, function(match, p1)
         {
            return p1 !== 'optional' ? p1 + ':' : match;
         });

         // Rewrite 'config.js'.
         fs.writeFileSync(jspmConfigPath, buffer);

         // Execute git commit.
         exec("git commit -m 'Removed extra config.js data' config.js", { cwd: rootPath }, function(err, stdout, stderr)
         {
            console.log(stdout);
            console.log(stderr);
            cb(err);
         });
      }
   });

   /**
    * Removes all `paths` and `map` entries that may be populated in the primary / root `config.js`. If `config.js` is
    * modified a git commit for `config.js` is performed. A git push is then executed.
    */
   gulp.task('jspm-clear-config-git-push', ['test-basic'], function(cb)
   {
      var runSequence = require('run-sequence').use(gulp);
      runSequence('jspm-clear-config', 'git-push', cb);
   });

   /**
    * Runs `jspm inspect` via JSPM CLI.
    */
   gulp.task('jspm-inspect', function(cb)
   {
      var exec = require('child_process').exec;
      exec('jspm inspect', { cwd: rootPath }, function(err, stdout, stderr)
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
      exec('jspm install', { cwd: rootPath }, function(err, stdout, stderr)
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
 * @param {boolean}  inMemoryBuild  - Designates that an in memory build should be performed.
 * @param {string}   srcFilename    - Source entry point for SystemJS Builder.
 * @param {string}   destDir        - Destination directory for bundle.
 * @param {string}   destFilepath   - Destination file path for bundle.
 * @param {boolean}  minify         - Potentially minify bundle.
 * @param {boolean}  mangle         - Potentially mangle bundle.
 * @param {string}   format         - Module format
 * @param {object}   extraConfig    - Optional JSPM config to load after `config.js`.
 * @returns {bluebird} Promise
 */
function buildStatic(jspm, inMemoryBuild, srcFilename, destDir, destFilepath, minify, mangle, format, extraConfig)
{
   return new Promise(function(resolve, reject)
   {
      if (!inMemoryBuild)
      {
         if (!fs.existsSync(destDir))
         {
            fs.mkdirSync(destDir);
         }

         if (!fs.existsSync(destDir))
         {
            console.error('Could not create destination directory: ' + destDir);
            reject();
         }
      }

      var builder = new jspm.Builder('./config.js');

      var extraConfigType = typeof extraConfig;
      if (extraConfigType === 'string')
      {
         builder.loadConfigSync(extraConfig);
      }
      else if (extraConfigType === 'object')
      {
         builder.config(extraConfig);
      }

      if (inMemoryBuild)
      {
         console.log('Bundle queued - srcFilename: ' + srcFilename + '; format: ' + format  + '; mangle: ' + mangle
          + '; minify: ' + minify);
      }
      else
      {
         console.log('Bundle queued - srcFilename: ' + srcFilename + '; format: ' + format  + '; mangle: ' + mangle
          + '; minify: ' + minify + '; destDir: ' + destDir + '; destFilepath: ' + destFilepath);
      }

      var builderPromise;
      var builderConfig =
      {
         minify: minify,
         mangle: mangle,
         format: format
      };

      // When testing we only need to do an in memory build.
      if (inMemoryBuild || argv.travis || process.env.TRAVIS)
      {
         builderPromise = builder.buildStatic(srcFilename, builderConfig);
      }
      else
      {
         builderPromise = builder.buildStatic(srcFilename, destFilepath, builderConfig);
      }

      builderPromise.then(function()
      {
         if (inMemoryBuild)
         {
            console.log('Bundle complete - minify: ' + minify + '; mangle: ' + mangle + '; format: ' + format);
         }
         else
         {
            console.log('Bundle complete - filename: ' + destFilepath + ' minify: ' + minify + '; mangle: ' + mangle
             + '; format: ' + format);
         }

         resolve();
      })
      .catch(function(err)
      {
         if (inMemoryBuild)
         {
            console.log('Bundle error - minify: ' + minify + '; mangle: ' + mangle + '; format: ' + format);
         }
         else
         {
            console.log('Bundle error - filename: ' + destFilepath + ' minify: ' + minify + '; mangle: ' + mangle
             + '; format: ' + format);
         }

         console.log(err);

         reject(err);
      });
   });
}