/**
 * Provides Gulp tasks for working with the NPM CLI.
 *
 * The following tasks are defined:
 * `npm-install` - Runs `npm install` via NPM CLI.
 *
 * `npm-outdated` - Runs `npm outdated` via NPM CLI.
 *
 * `npm-run-test` - Runs `npm run test` via NPM CLI.
 *
 * `npm-run-test-coverage` - Runs `npm run test-coverage` via NPM CLI.
 *
 * `npm-uninstall` - Runs `npm uninstall <package>` via NPM CLI for all node modules installed.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   var path =     require('path');
   var fs =       require('fs-extra');

   var rootPath = options.rootPath;

   /**
    * Runs `npm install` via NPM CLI.
    */
   gulp.task('npm-install', function(cb)
   {
      var exec = require('child_process').exec;
      exec('npm install', { cwd: rootPath }, function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   /**
    * Runs `npm outdated` via NPM CLI.
    */
   gulp.task('npm-outdated', function(cb)
   {
      var exec = require('child_process').exec;
      exec('npm outdated', { cwd: rootPath }, function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   // Load any package.json in `rootPath` and add Gulp tasks to invoke any script entries.

   var packageJSONPath = rootPath + path.sep + 'package.json';

   if (fs.existsSync(packageJSONPath))
   {
      var packageJSON = require(packageJSONPath);

      // If a scripts entry exists then create Gulp tasks to invoke them.
      if (typeof packageJSON.scripts === 'object')
      {
         Object.keys(packageJSON.scripts).forEach(function(element)
         {
            /**
             * Runs `npm run <script name>` via NPM CLI.
             */
            gulp.task('npm-run-' + element, function(cb)
            {
               var exec = require('child_process').exec;
               exec('npm run ' + element, { cwd: rootPath }, function(err, stdout, stderr)
               {
                  console.log(stdout);
                  console.log(stderr);
                  cb(err);
               });
            });
         });
      }
   }

   /**
    * Runs `npm uninstall <package>` via NPM CLI for all node modules installed.
    */
   gulp.task('npm-uninstall', function(cb)
   {
      var exec = require('child_process').exec;
      exec('for package in `ls node_modules`; do npm uninstall $package; done;', { cwd: rootPath },
       function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });
};
