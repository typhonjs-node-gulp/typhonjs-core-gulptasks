import cp   from 'child_process';
import fs   from 'fs-extra';
import path from 'path';

/**
 * Provides Gulp tasks for working with the NPM CLI.
 *
 * The following tasks are defined:
 *
 * `npm-run-<script name>` - Runs `npm run <script name>` via NPM CLI from script names in `package.json`.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   const rootPath = options.rootPath;

   try
   {
      // Loads package.json in `rootPath` and adds Gulp tasks to invoke any script entries.
      const packageJSONPath = `${rootPath}${path.sep}package.json`;

      const packageJSON = fs.readJSONSync(packageJSONPath);

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
   catch (err) { /* ... */ }
}