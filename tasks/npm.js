module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;

   /**
    * Runs "npm install"
    */
   gulp.task('npm-install', function(cb)
   {
      var exec = require('child_process').exec;
      exec('npm install', { cwd: rootPath }, function (err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   /**
    * Runs "npm uninstall <package> for all node modules installed."
    */
   gulp.task('npm-uninstall', function(cb)
   {
      var exec = require('child_process').exec;
      exec('for package in `ls node_modules`; do npm uninstall $package; done;', { cwd: rootPath },
       function (err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });
};
