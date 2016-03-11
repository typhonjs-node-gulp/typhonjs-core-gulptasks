import cp               from 'child_process';
import os               from 'os';

import tasksElectron    from './tasks/electron.js';
import tasksESDoc       from './tasks/esdoc.js';
import tasksESLint      from './tasks/eslint.js';
import tasksJSPM        from './tasks/jspm.js';
import tasksJSPMTest    from './tasks/jspm-test.js';
import tasksNPM         from './tasks/npm.js';
import tasksNPMScripts  from './tasks/npm-scripts.js';

/**
 * Requires all Gulp tasks.
 *
 * Required parameters include:
 * `rootPath` - The root path where `package.json` is located for the given project.
 * `srcGlob` - The source glob that certain tasks like `eslint` use to associate the source for the given project.
 *
 * Additional optional parameters include:
 * `configDir` - The directory where configuration files for various tasks such as `jspm-bundle` are stored; default
 * (`./config`).
 *
 * `importTasks` - An array of strings which specifies which categories of tasks to load. This allows only exposing
 * certain tasks that are relevant for a given project. For instance several TyphonJS Node packages only use `eslint`
 * and `npm`. Available task categories include: 'electron', 'esdoc', 'eslint', 'jspm', 'jspm-test', 'npm' and
 * 'npm-scripts'.
 *
 * `excludeTasks` - An array of strings which specifies particular categories of tasks to exclude.
 *
 * It should be noted that `typhonjs-core-gulptasks` does not include dependencies for ESDoc, ESLint or JSPM. If
 * these dependencies are missing from `package.json` / `node_modules` then the associated Gulp tasks for each do not
 * load.
 *
 * Regarding the `Electron` tasks; these are the only tasks that require `electron-packager` and `electron-prebuilt`
 * NPM modules to be installed along with a `.electronrc` configuration file in rootPath to load these tasks
 * otherwise they stay hidden.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   options =                  options || {};
   options.configDir =        options.configDir || 'config';
   options.importTasks =      options.importTasks || ['electron', 'esdoc', 'eslint', 'jspm', 'jspm-test', 'npm',
                                                      'npm-scripts'];
   options.excludeTasks =     options.excludeTasks || [];

   options.loadedTasks =      [];   // Stores loaded task names.
   options.topLevelModules =  {};   // Stores top level module info.

   const rootPath =           options.rootPath;

   // Remove any tasks defined in `options.excludeTasks`.
   for (let cntr = 0; cntr < options.excludeTasks.length; cntr++)
   {
      const removeIndex = options.importTasks.indexOf(options.excludeTasks[cntr]);
      if (removeIndex >= 0) { options.importTasks.splice(removeIndex, 1); }
   }

   // Add `git` to `options.importTasks` if error is not raised when invoking `git --version` via CLI.
   try
   {
      cp.execSync('git --version', { cwd: rootPath, encoding: 'utf8' });
      options.importTasks.push('git');
   }
   catch (err) { /* ... */ }

   // Remove npm tasks from `options.importTasks` if error is raised when invoking `npm version` via CLI.
   try
   {
      cp.execSync('npm version', { cwd: rootPath, encoding: 'utf8' });
   }
   catch (err)
   {
      const npmIndex = options.importTasks.indexOf('npm');
      if (npmIndex >= 0) { options.importTasks.splice(npmIndex, 1); }

      const npmScriptIndex = options.importTasks.indexOf('npm-scripts');
      if (npmScriptIndex >= 0) { options.importTasks.splice(npmScriptIndex, 1); }
   }

   // Parses top level modules installed in `node_modules` and provides an object hash of name -> version in
   // `options.topLevelModules`.

   let moduleList;

   try
   {
      moduleList = cp.execSync('npm list --depth=0', { cwd: rootPath, encoding: 'utf8' });
   }
   catch (err) { /* ... */ }

   if (moduleList)
   {
      const lines = moduleList.split(os.EOL);
      const regex = /([\S]+)@([\S]+)/;

      for (let cntr = 1; cntr < lines.length; cntr++)
      {
         const results = regex.exec(lines[cntr]);
         if (results && results.length >= 3) { options.topLevelModules[results[1]] = results[2]; }
      }
   }

   // Require all tasks
   s_REQUIRE_TASKS(gulp, options);
}

/**
 * Dispatches and requires tasks defined in `options.importTasks`.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
const s_REQUIRE_TASKS = (gulp, options) =>
{
   for (let cntr = 0; cntr < options.importTasks.length; cntr++)
   {
      switch (options.importTasks[cntr])
      {
         case 'electron':
            tasksElectron(gulp, options);
            break;

         case 'esdoc':
            tasksESDoc(gulp, options);
            break;

         case 'eslint':
            tasksESLint(gulp, options);
            break;

         case 'jspm':
            tasksJSPM(gulp, options);
            break;

         case 'jspm-test':
            tasksJSPMTest(gulp, options);
            break;

         case 'npm':
            tasksNPM(gulp, options);
            break;

         case 'npm-scripts':
            tasksNPMScripts(gulp, options);
            break;
      }
   }
};