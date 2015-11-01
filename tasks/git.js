module.exports = function (gulp, options)
{
   var rootPath = options.rootPath;

   /**
    * Runs "git push", but only if the test task (eslint & bundle) complete successfully. Also removes all path and map
    * statements that may be populated in `config.js`. If `config.js` is modified an additional commit is added.
    *
    * Note: Make sure to pass in `--travis` as an argument to this task to run an in memory build / test.
    */
   gulp.task('git-push', ['test'], function(cb)
   {
      var exec = require('child_process').exec;
      var fs = require('fs');
      var path = require('path');
      var vm = require('vm');

      var jspmConfigPath = rootPath +path.sep +'config.js';

      var buffer = fs.readFileSync(jspmConfigPath, 'utf8');

      // Remove the leading and trailing Javascript SystemJS config method invocation so we are left with a JSON file.
      buffer = buffer.replace('System.config(', '');
      buffer = buffer.replace(');', '');

      // Load buffer as object.
      var config = vm.runInThisContext('object = ' +buffer);

      // Only modify config.js if map and paths is not empty.
      if (Object.keys(config.map).length > 0 || Object.keys(config.paths).length > 0)
      {
         // Remove map and paths.
         config.map = {};
         config.paths = {};

         // Rewrite the config.js buffer.
         buffer = 'System.config(' + JSON.stringify(config, null, 2) +');';

         // Remove quotes around primary keys ignoring babelOptions / "optional".
         buffer = buffer.replace(/"([a-zA-Z]+)":/g, function(match, p1)
         {
            return p1 !== 'optional' ? p1 +':' : match;
         });

         // Rewrite 'config.js'.
         fs.writeFileSync(jspmConfigPath, buffer);

         // Execute git commit.
         exec("git commit -m 'Removed extra config.js data' config.js", { cwd: rootPath },
          function (err, stdout, stderr)
         {
            console.log(stdout);
            console.log(stderr);
         });
      }

      // Execute git push.
      exec('git push', { cwd: rootPath }, function (err, stdout, stderr)
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });
};