import { argv }            from 'yargs';
import cp                  from 'child_process';
import fs                  from 'fs-extra';
import path                from 'path';
import stripJsonComments   from 'strip-json-comments';
import vm                  from 'vm';

/**
 * Provides Gulp tasks for working with the JSPM CLI and SystemJS Builder.
 *
 * The following tasks are defined:
 *
 * `jspm-bundle` - Bundles the project via the config file found in `./config/bundle-config.json` or
 * `./config/bundle-config-travis.json` if `--travis` is supplied as an argument to Gulp. Optionally define `configDir`
 * when loading Gulp tasks to change config directory. Or provide --bundleConfig='path/relative/to/rootpath/bundle.json'
 * via the CLI to specify a particular config file. Comments are allowed in bundle config json files.
 *
 * `jspm-clear-config` - Removes all `paths` and `map` entries that may be populated in the primary JSPM config file.
 * Performs a git commit if the config file was modified.
 *
 * `jspm-dl-loader` - Runs `jspm dl-loader` via JSPM CLI.
 *
 * `jspm-clear-config-git-push` - Runs `test-basic` then runs in sequence the following tasks: `jspm-clear-config` and
 * `git-push`
 *
 * `jspm-inspect` - Runs `jspm inspect` via JSPM CLI.
 *
 * `jspm-install` - Runs `jspm install` via JSPM CLI.
 *
 * @param {object}   gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
export default function(gulp, options)
{
   // The root path of the project being operated on via all tasks.
   const rootPath = options.rootPath;

   // A user supplied relative path for config directory or the default of `config`.
   const configDir = options.configDir;

   // If jspm can't be required then don't add any JSPM Gulp tasks.
   try { require('jspm'); }
   catch (err) { return; }

   /**
    * Bundles the project via the config file found in `./config/bundle-config.json` or
    * `./config/bundle-config-travis.json` if `--travis` is supplied as an argument to Gulp. This file contains an
    * array of parameters for invoking SystemJS Builder.
    *
    * An example entry:
    * [
    *    {
    *       "buildType": "buildStatic",      // (Optional) buildStatic is the default; use 'bundle' for non-SFX build.
    *       "inMemoryBuild": false,          // (Optional) when set to true only an in memory build is performed.
    *       "destBaseDir": "./dist",         // Root destination directory for bundle output.
    *       "destFilename": "<filename>.js", // Destination bundle file name.
    *       "formats": ["amd", "cjs"],       // Module format to use / also defines destination sub-directory.
    *       "mangle": false,                 // Uglify mangle property used by SystemJS Builder.
    *       "minify": false,                 // Minify mangle property used by SystemJS Builder.
    *       "src": "src/ModuleRuntime.js",   // Entry source point for SystemJS Builder
    *       "extraConfig":                   // (Optional) Defines additional JSPM config parameters to load after
    *       {                                // ./config.js is loaded. Provide a string or array of strings and they
    *          "meta":                       // will be interpreted as an additional configuration file styled like
    *          {                             // `config.js` or provide an object hash which is loaded directly.  This
    *             "jquery": { "build": false },    // example skips building `jquery` and `underscore`.
    *             "underscore": { "build": false }
    *          }
    *       },
    *       "builderOptions":                // (Optional) an object hash of any parameters for SystemJS Builder.
    *       {
    *          "globalDeps":
    *          {
    *             "underscore": "_"
    *          }
    *       }
    *    }
    * ]
    */
   gulp.task('jspm-bundle', () =>
   {
      const jspm = require('jspm');

      // Set the package path to the local root.
      jspm.setPackagePath(rootPath);

      let bundleInfoPath;
      const promiseList = [];

      // If there is a specific bundleConfig specified then attempt to load it relative to `rootPath`.
      if (argv.bundleConfig)
      {
         bundleInfoPath = `${rootPath}${path.sep}${argv.bundleConfig}`;
      }
      else
      {
         // When testing the build in Travis CI we only need to run a single bundle operation.
         bundleInfoPath = argv.travis || process.env.TRAVIS ? `${rootPath}${path.sep}${configDir}${path.sep}`
         + 'bundle-config-travis.json' : `${rootPath}${path.sep}${configDir}${path.sep}bundle-config.json`;
      }

      // Strip comments
      const bundleJSON = fs.readFileSync(bundleInfoPath, 'utf-8');
      const bundleInfo = JSON.parse(stripJsonComments(bundleJSON));

      for (let cntr = 0; cntr < bundleInfo.entryPoints.length; cntr++)
      {
         const entry = bundleInfo.entryPoints[cntr];

         const inMemoryBuild = entry.inMemoryBuild || argv.travis || process.env.TRAVIS || false;
         const buildType = entry.buildType || 'buildStatic';
         const destFilename = entry.destFilename;
         const srcFilename = entry.src;
         const extraConfig = entry.extraConfig;
         const formats = entry.formats;

         let destBaseDir = entry.destBaseDir;

         if (buildType !== 'bundle' && buildType !== 'buildStatic')
         {
            console.error(`Unknown buildType (${buildType}): must be 'bundle' or 'buildStatic'.`);
            process.exit(1);
         }

         const builderOptions =
         {
            mangle: entry.mangle,
            minify: entry.minify
         };

         // Copy any entries from `builderOptions`.
         if (typeof entry.builderOptions === 'object')
         {
            for (const key in entry.builderOptions)
            {
               // Skip any format keys
               if (key === 'format') { continue; }

               builderOptions[key] = entry.builderOptions[key];
            }
         }

         if (!inMemoryBuild)
         {
            // Remove an leading local directory string
            destBaseDir = destBaseDir.replace(new RegExp(`^\.${path.sep === '\\' ? `\\${path.sep}` : path.sep}`), '');

            // Complete full path including root path of the project.
            destBaseDir = `${rootPath}${path.sep}${destBaseDir}`;

            // Attempt to create destBaseDir directory if it does not exist.
            fs.ensureDirSync(destBaseDir);

            // Error out early if destBaseDir does not exist.
            try
            {
               if (!fs.statSync(destBaseDir).isDirectory())
               {
                  console.error(`Could not create destination directory: ${destBaseDir}`);
                  process.exit(1);
               }
            }
            catch (err)
            {
               console.error(`Could not create destination directory: ${destBaseDir}`);
               process.exit(1);
            }
         }

         for (let cntr2 = 0; cntr2 < formats.length; cntr2++)
         {
            const format = formats[cntr2];

            let destDir, destFilepath;

            if (!inMemoryBuild)
            {
               destDir = `${destBaseDir}${path.sep}${format}`;
               destFilepath = `${destDir}${path.sep}${destFilename}`;
            }

            builderOptions.format = format;

            promiseList.push(s_BUILDER_BUNDLE(jspm, buildType, inMemoryBuild, srcFilename, destDir, destFilepath,
             builderOptions, extraConfig));
         }
      }

      return Promise.all(promiseList).then(() =>
      {
         console.log('All Bundle Tasks Complete');
      })
      .catch((err) =>
      {
         console.log(`Bundle error: ${err}`);
         process.exit(1);
      });
   });

   options.loadedTasks.push('jspm-bundle');

   /**
    * Removes all `paths` and `map` entries that may be populated in the primary / root `config.js`. If `config.js` is
    * modified a git commit for `config.js` is performed.
    *
    * Note: Make sure to pass in `--travis` as an argument to Gulp to run an in memory bundle / test.
    */
   gulp.task('jspm-clear-config', (cb) =>
   {
      const jspm =            require('jspm');

      const PackageConfig =   require(`jspm${path.sep}lib${path.sep}config${path.sep}package.js`);

      // Set the package path to the local root.
      jspm.setPackagePath(rootPath);

      // Loads JSPM package.json to find JSPM config file path.
      const pjsonPath = process.env.jspmConfigPath || `${rootPath}${path.sep}package.json`;
      const pjson = new PackageConfig(pjsonPath);
      pjson.read(false, true);

      let buffer;

      try
      {
         buffer = fs.readFileSync(pjson.configFile, 'utf8');
      }
      catch (err)
      {
         console.error(`Could not locate JSPM config at: ${pjson.configFile}`);
         process.exit(1);
      }

      console.log(`Clearing JSPM config at: ${pjson.configFile}`);

      let config = {};

      // Strip enclosing `System.config` wrapper.
      const match = (/System\.config\(([\s\S]*)\);/).exec(buffer);
      if (match !== null && match[1])
      {
         // Load buffer as object.
         config = vm.runInThisContext(`object = ${match[1]}`);
      }

      // Only modify config.js if map and paths is not empty.
      if (Object.keys(config.map).length > 0 || Object.keys(config.paths).length > 0)
      {
         // Remove map and paths.
         config.map = {};
         config.paths = {};

         // Rewrite the config.js buffer.
         buffer = `System.config(${JSON.stringify(config, null, 2)});`;

         // Remove quotes around primary keys ignoring babelOptions / `optional`.
         buffer = buffer.replace(/"([a-zA-Z]+)":/g, (match, p1) =>
         {
            return p1 !== 'optional' ? `${p1}:` : match;
         });

         // Rewrite 'config.js'.
         fs.writeFileSync(pjson.configFile, buffer);

         // Execute `git commit` and continue silently if this fails.
         try
         {
            cp.exec("git commit -m 'Removed extra data from JSPM config' config.js", { cwd: rootPath },
             (err, stdout, stderr) =>
            {
               console.log(stdout);
               console.log(stderr);
               cb(err);
            });
         }
         catch (err) { /* ... */ }
      }
   });

   options.loadedTasks.push('jspm-clear-config');

   /**
    * Runs `jspm dl-loader` via JSPM CLI.
    */
   gulp.task('jspm-dl-loader', (cb) =>
   {
      cp.exec('jspm dl-loader', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('jspm-dl-loader');

   /**
    * Runs `jspm inspect` via JSPM CLI.
    */
   gulp.task('jspm-inspect', (cb) =>
   {
      cp.exec('jspm inspect', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('jspm-inspect');

   /**
    * Runs `jspm install` via JSPM CLI.
    */
   gulp.task('jspm-install', (cb) =>
   {
      cp.exec('jspm install', { cwd: rootPath }, (err, stdout, stderr) =>
      {
         console.log(stdout);
         console.log(stderr);
         cb(err);
      });
   });

   options.loadedTasks.push('jspm-install');
}

/**
 * Returns a Promise which encapsulates an execution of SystemJS Builder.
 *
 * @param {object}   jspm           - An instance of JSPM.
 * @param {string}   buildType      - Specifies the builder method to execute (bundle or buildStatic).
 * @param {boolean}  inMemoryBuild  - Designates that an in memory build should be performed.
 * @param {string}   srcFilename    - Source entry point for SystemJS Builder.
 * @param {string}   destDir        - Destination directory for bundle.
 * @param {string}   destFilepath   - Destination file path for bundle.
 * @param {object}   builderOptions - Options for bundling.
 * @param {object}   extraConfig    - Optional JSPM config to load after `config.js`.
 * @returns {Promise} Promise
 */
const s_BUILDER_BUNDLE = (jspm, buildType, inMemoryBuild, srcFilename, destDir, destFilepath, builderOptions,
 extraConfig) =>
{
   return new Promise((resolve, reject) =>
   {
      if (!inMemoryBuild)
      {
         fs.ensureDirSync(destDir);

         try
         {
            if (!fs.statSync(destDir).isDirectory())
            {
               console.error(`Could not create destination directory: ${destDir}`);
               reject();
            }
         }
         catch (err)
         {
            console.error(`Could not create destination directory: ${destDir}`);
            reject();
         }
      }

      const builderOptionsString = JSON.stringify(builderOptions);
      const builderOptionsFormat = builderOptions.format;

      const builder = new jspm.Builder();

      const extraConfigType = typeof extraConfig;

      if (extraConfigType === 'string')
      {
         builder.loadConfigSync(extraConfig);
      }
      else if (extraConfigType === 'object')
      {
         builder.config(extraConfig);
      }
      else if (Array.isArray(extraConfig))
      {
         for (let cntr = 0; cntr < extraConfig.length; cntr++)
         {
            builder.loadConfigSync(extraConfig[cntr]);
         }
      }

      if (inMemoryBuild)
      {
         console.log(`Bundle queued - srcFilename: ${srcFilename}; format: ${builderOptionsFormat}; builderOptions: `
          + `${builderOptionsString}`);
      }
      else
      {
         console.log(`Bundle queued - srcFilename: ${srcFilename}; format: ${builderOptionsFormat}; builderOptions: `
          + `${builderOptionsString}; destDir: ${destDir}; destFilepath: ${destFilepath}`);
      }

      let builderPromise;

      // When testing we only need to do an in memory build.
      if (inMemoryBuild)
      {
         builderPromise = builder[buildType](srcFilename, builderOptions);
      }
      else
      {
         builderPromise = builder[buildType](srcFilename, destFilepath, builderOptions);
      }

      builderPromise.then(() =>
      {
         if (inMemoryBuild)
         {
            console.log(`Bundle complete - format: ${builderOptionsFormat}; builderOptions: ${builderOptionsString}`);
         }
         else
         {
            console.log(`Bundle complete - format: ${builderOptionsFormat}; filename: ${destFilepath}`
             + `; builderOptions: ${builderOptionsString}`);
         }

         resolve();
      })
      .catch((err) =>
      {
         if (inMemoryBuild)
         {
            console.error(`Bundle error - format: ${builderOptionsFormat}; builderOptions: ${builderOptionsString}`);
         }
         else
         {
            console.error(`Bundle error - format: ${builderOptionsFormat}; filename: ${destFilepath}; builderOptions: `
             + `${builderOptionsString}`);
         }

         console.error(err);

         reject(err);
      });
   });
};