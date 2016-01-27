/**
 * Requires all Gulp tasks.
 *
 * Required parameters include:
 * `rootPath` - the root path where `package.json` is located for the given project.
 * `srcGlob` - the source glob that certain tasks like `eslint` use to associate the source for the given project.
 *
 * Additional optional parameters include:
 * `configDir` - the directory where configuration files for various tasks such as `jspm-bundle` are stored.
 *
 * `importTasks` -  may be supplied which specifies which categories of tasks to require. This allows only exposing
 * certain tasks that are relevant for a given project. For instance several TyphonJS Node packages only use `eslint`
 * and `npm`. Available task categories include: 'electron', 'esdoc', 'eslint', 'git', 'jspm', 'npm' and 'test'.
 *
 * Regarding the `Electron` tasks; these are the only tasks that require `electron-packager` and `electron-prebuilt`
 * NPM modules to be installed along with an `electron.json` configuration file in rootPath to load these tasks
 * otherwise they stay hidden.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   options =                  options || {};
   options.configDir =        options.configDir || 'config';
   options.importTasks =      options.importTasks || ['electron', 'esdoc', 'eslint', 'git', 'jspm', 'npm', 'test'];

   options.loadedTasks =      [];   // Stores loaded task names.
   options.topLevelModules =  {};   // Stores top level module info.

   var rootPath =             options.rootPath;

   var childProcess =         require('child_process');
   var os =                   require('os');

   // Remove git task from options.importTasks if error is raised when invoking `git --version` via CLI.
   try
   {
      childProcess.execSync('git --version', { cwd: rootPath, encoding: 'utf8' });
   }
   catch (err)
   {
      var gitIndex = options.importTasks.indexOf('git');
      if (gitIndex >= 0) { options.importTasks.splice(gitIndex, 1); }
   }

   // Parses top level modules installed in `node_modules` and provides an object hash of name -> version in
   // `options.topLevelModules`.

   var moduleList;

   try
   {
      moduleList = childProcess.execSync('npm list --depth=0', { cwd: rootPath, encoding: 'utf8' });
   }
   catch (err) { /* ... */ }

   if (moduleList)
   {
      var lines = moduleList.split(os.EOL);
      var regex = /([\S]+)@([\S]+)/;

      for (var cntr = 1; cntr < lines.length; cntr++)
      {
         var results = regex.exec(lines[cntr]);
         if (results && results.length >= 3) { options.topLevelModules[results[1]] = results[2]; }
      }
   }

   // Require all tasks
   requireTasks(gulp, options);
};

/**
 * Dispatches and requires tasks defined in `options.importTasks`.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
function requireTasks(gulp, options)
{
   for (var cntr = 0; cntr < options.importTasks.length; cntr++)
   {
      switch (options.importTasks[cntr])
      {
         case 'electron':
            require('./tasks/electron.js')(gulp, options);
            break;

         case 'esdoc':
            require('./tasks/esdoc.js')(gulp, options);
            break;

         case 'eslint':
            require('./tasks/eslint.js')(gulp, options);
            break;

         case 'git':
            require('./tasks/git.js')(gulp, options);
            break;

         case 'jspm':
            require('./tasks/jspm.js')(gulp, options);
            break;

         case 'npm':
            require('./tasks/npm.js')(gulp, options);
            break;

         case 'test':
            require('./tasks/test.js')(gulp, options);
            break;
      }
   }
}