import fs   from 'fs-extra';
import path from 'path';

/**
 * Provides Gulp tasks for working with `ESDoc` / `gulp-esdoc`.
 *
 * The following tasks are defined:
 *
 * `esdoc` - Create docs using `esdoc.json` to define the source and destination locations including support for
 * `esdoc-plugin-jspm`.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   const rootPath = options.rootPath;

   try
   {
      // Require is used here to avoid ES6 hoisted imports.
      const ESDoc = require(`${rootPath}${path.sep}node_modules${path.sep}esdoc${path.sep}out${path.sep}src${path.sep}`
       + `ESDoc.js`);

      const publisher = require(`${rootPath}${path.sep}node_modules${path.sep}esdoc${path.sep}out${path.sep}src`
       + `${path.sep}Publisher${path.sep}publish.js`);

      if (ESDoc && publisher)
      {
         // The location of the ESDoc configuration file.
         let esdocConfigPath;
         let foundConfigPath = false;

         // Lookup ESDoc config file via supported names.
         for (let cntr = 0; cntr < s_ESDOC_CONFIG_NAMES.length; cntr++)
         {
            esdocConfigPath = `${rootPath}${path.sep}${s_ESDOC_CONFIG_NAMES[cntr]}`;
            try
            {
               // Found the config file so breaking out of loop.
               if (fs.statSync(esdocConfigPath).isFile())
               {
                  foundConfigPath = true;
                  break;
               }
            }
            catch (err) { /* ... */ }
         }

         if (foundConfigPath)
         {
            /**
             * Create docs using `.esdocrc` or `esdoc.json` to define the source and destination locations.
             */
            gulp.task('esdoc', () =>
            {
               let esdocConfig;

               try
               {
                  esdocConfig = fs.readJsonSync(esdocConfigPath);
               }
               catch (err)
               {
                  console.error(`Could not locate ESDoc configuration file at: ${esdocConfigPath}`);
                  process.exit(1);
               }

               // Set the jspmRootPath to the root path of the project; utilized by `esdoc-plugin-jspm`.
               esdocConfig.jspmRootPath = rootPath;

               ESDoc.generate(esdocConfig, publisher);
            });
         }

         options.loadedTasks.push('esdoc');
      }
   }
   catch (err) { /* ... */ }
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Defines the supported file names for ESDoc configuration file names.
 * @type {string[]}
 */
const s_ESDOC_CONFIG_NAMES = ['.esdocrc', 'esdoc.json'];
