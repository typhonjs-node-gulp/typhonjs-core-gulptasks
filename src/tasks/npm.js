import cp   from 'child_process';
import fs   from 'fs-extra';
import path from 'path';

/**
 * Provides Gulp tasks for working with the NPM CLI.
 *
 * The following tasks are defined:
 *
 * `npm-install` - Runs `npm install` via NPM CLI.
 *
 * `npm-list-depth-0` - Runs `npm list --depth=0` via NPM CLI.
 *
 * `npm-outdated` - Runs `npm outdated` via NPM CLI.
 *
 * `npm-run-<script name>` - Runs `npm run <script name>` via NPM CLI from script names in `package.json`.
 *
 * `npm-uninstall` - Runs `npm uninstall <package>` via NPM CLI for all node modules installed.
 *
 * `npm-update` - Runs `npm update` via NPM CLI.
 *
 * `npm-update-dev` - Runs `npm update --dev` via NPM CLI.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   const rootPath = options.rootPath;

   /**
    * Runs `npm install` via NPM CLI.
    */
   gulp.task('npm-install', (cb) =>
   {
      cp.exec('npm install', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-install');

   /**
    * Runs `npm list --depth=0` via NPM CLI.
    */
   gulp.task('npm-list-depth-0', (cb) =>
   {
      cp.exec('npm list --depth=0', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-list-depth-0');

   /**
    * Runs `npm outdated` via NPM CLI.
    */
   gulp.task('npm-outdated', (cb) =>
   {
      cp.exec('npm outdated', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-outdated');

   // Load any package.json in `rootPath` and add Gulp tasks to invoke any script entries.

   const packageJSONPath = `${rootPath}${path.sep}package.json`;

   if (fs.existsSync(packageJSONPath))
   {
      const packageJSON = require(packageJSONPath);

      // If a scripts entry exists then create Gulp tasks to invoke them.
      if (typeof packageJSON.scripts === 'object')
      {
         Object.keys(packageJSON.scripts).forEach((element) =>
         {
            /**
             * Runs `npm run <script name>` via NPM CLI.
             */
            gulp.task(`npm-run-${element}`, (cb) =>
            {
               cp.exec(`npm run ${element}`, { cwd: rootPath }, (err, stdout, stderr) =>
               {
                  console.log(stdout);
                  console.log(stderr);
                  cb(err);
               });
            });

            options.loadedTasks.push(`npm-run-${element}`);
         });
      }
   }

   /**
    * Runs `npm uninstall <package>` via NPM CLI for all node modules installed.
    */
   gulp.task('npm-uninstall', (cb) =>
   {
      cp.exec('for package in `ls node_modules`; do npm uninstall $package; done;', { cwd: rootPath },
       (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-uninstall');

   /**
    * Runs `npm update` via NPM CLI.
    */
   gulp.task('npm-update', (cb) =>
   {
      cp.exec('npm update', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-update');

   /**
    * Runs `npm update --dev` via NPM CLI.
    */
   gulp.task('npm-update-dev', (cb) =>
   {
      cp.exec('npm update --dev', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('npm-update-dev');
}
