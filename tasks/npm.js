/**
 * Provides Gulp tasks for working with the NPM CLI.
 *
 * The following tasks are defined:
 * `npm-install` - Runs `npm install` via NPM CLI.
 *
 * `npm-outdated` - Runs `npm outdated` via NPM CLI.
 *
 * `npm-uninstall` - Runs `npm uninstall <package>` via NPM CLI for all node modules installed.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
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

   /**
    * Runs `npm run test` via NPM CLI. This will run a script associated with `test`.
    */
   gulp.task('npm-run-test', function(cb)
   {
      var exec = require('child_process').exec;
      exec('npm run test', { cwd: rootPath }, function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   /**
    * Runs `npm run test-coverage` via NPM CLI. This will run a script associated with `test-coverage`.
    */
   gulp.task('npm-run-test-coverage', function(cb)
   {
      var exec = require('child_process').exec;
      exec('npm run test-coverage', { cwd: rootPath }, function(err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

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
