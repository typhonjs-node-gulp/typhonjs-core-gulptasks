import fs   from 'fs-extra';
import path from 'path';

/**
 * Provides Gulp tasks for working with ESLint.
 *
 * The following tasks are defined:
 *
 * `eslint` - Runs ESLint with the given source glob with the `.eslintrc` file defined in the root path.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   const rootPath = options.rootPath;

   // The source glob defining all sources.
   const srcGlob = options.srcGlob;

   try
   {
      // Require is used here to avoid ES6 hoisted imports.
      const CLIEngine = require('eslint').CLIEngine;
      const cli = new CLIEngine();

      if (fs.statSync(`${rootPath}${path.sep}.eslintrc`).isFile())
      {
         /**
          * Runs ESLint with the given source glob with the `.eslintrc` file defined in the root path.
          */
         gulp.task('eslint', () =>
         {
            if (!Array.isArray(srcGlob))
            {
               console.log(`eslint task error: 'options.srcGlob' is not an 'array'.`);
               process.exit(1);
            }

            const report = cli.executeOnFiles(srcGlob);

            const formatter = cli.getFormatter();

            console.log(formatter(report.results));

            // Exit on errors.
            if (report.errorCount > 0) { process.exit(1); }
         });

         options.loadedTasks.push('eslint');
      }
   }
   catch (err) { /* ... */ }
}