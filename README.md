![typhonjs-core-gulptasks](http://i.imgur.com/KqIyNtd.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-core-gulptasks.svg?label=npm)](https://www.npmjs.com/package/typhonjs-core-gulptasks)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-gulp/typhonjs-core-gulptasks.svg?branch=master)](https://travis-ci.org/typhonjs-node-gulp/typhonjs-core-gulptasks)
[![Dependency Status](https://www.versioneye.com/user/projects/56dd82bb1535730033988367/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56dd82bb1535730033988367)

Provides common shared [Gulp](http://gulpjs.com/) tasks for [TyphonJS](https://github.com/typhonjs/typhonjs-overview) and beyond for those using [JSPM](http://jspm.io) / [SystemJS](https://github.com/systemjs/systemjs). By packaging all common Gulp tasks as a NPM module this fascilitates sharing the tasks across several projects / repos having one authoritative and versioned source for these tasks and all dependencies. Various JSPM & NPM CLI functions are wrapped as tasks allowing execution from IDEs which support Gulp. 

Please note as of the `0.6.0` release that dependencies for the tasks defined below are no longer bundled with `typhonjs-core-gulptasks` and need to be separately installed for the associated tasks to be loaded. For seamless integration for ESDoc and ESLint tasks consider loading [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as a dev dependency.

For the latest significant changes please see the [CHANGELOG](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/CHANGELOG.md).

The following tasks are available and defined in `typhonjs-core-gulptasks` with the following categories:

- `electron`:
  - [`electron-package-<platform>-<arch>`](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/electron.js#L133) - Invokes [electron-packager](https://www.npmjs.com/package/electron-packager) with the options from `.electronrc` in the root path. Default values are provided for `platform` -> 'process.platform', `arch` -> 'process.arch', `source` -> '.' and `out` -> 'build' if not supplied. For options to provide in `.electronrc` please see:
https://www.npmjs.com/package/electron-packager#programmatic-api

  - [electron-start](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/electron.js#L57) - Spawns `electron .` starting the app defined in `package.json->main` entry in the root path. 

  - [electron-start-debug](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/electron.js#L65) - Spawns `electron --debug=5858 .` starting the app defined in `package.json->main` entry in the root path. 

- `esdocs`:
  - [esdocs](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/esdoc.js#L56) - Creates ES6 documentation with [ESDocs](https://esdoc.org/) via [esdoc](https://www.npmjs.com/package/esdoc) which must be installed separately outputting to the location specified by `.esdocrc` or `esdoc.json`. Consider using [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as a dev dependency for [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) and [esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace) support.

- `eslint`:
  - [eslint](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/eslint.js#L33) - Runs [ESLint](http://eslint.org/) via [eslint](https://www.npmjs.com/package/eslint) using `.eslintrc` outputting to console and failing on any errors. Consider using [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as a dev dependency which includes `eslint` as a dependency.

- `jspm`:
  - [jspm-bundle](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm.js#L86) - Creates one or more bundles defined in `./config/bundle-config.json` or `./config/bundle-config-travis.json` (Add `--travis` argument to run minimal in memory bundle op for Travis CI.). When running from the command line you may use `gulp jspm-bundle --bundleConfig=<path/to/custom/config.json>` to use a specific customized bundle configuration. 

  - [jspm-clear-config](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm.js#L214) - Removes all `paths` and `map` entries that may be populated in the primary JSPM config file. Performs a git commit if the config file was modified.

  - [jspm-dl-loader](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm.js#L291) - Executes `jspm dl-loader` via JSPM CLI.

  - [jspm-inspect](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm.js#L306) - Executes `jspm inspect` via JSPM CLI.

  - [jspm-install](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm.js#L321) - Executes `jspm install` via JSPM CLI.
  
- `jspm-test`:
  - [jspm-test-basic](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm-test.js#L34) - Sets process.env.TRAVIS for in memory bundling and runs `eslint` and `jspm-bundle` tasks for basic testing.

  - [jspm-test-basic-git-push](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/jspm-test.js#L52) - Verifies the build by running `jspm-test-basic` and on success executes `git push`. 

- `npm`:
  - [npm-install](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L32) - Executes `npm install` via NPM CLI.

  - [npm-list-depth-0](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L47) - Executes `npm list --depth=0` via NPM CLI.

  - [npm-outdated](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L62) - Executes `npm outdated` via NPM CLI.

  - [npm-uninstall](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L77) - Executes `npm uninstall` via NPM CLI.

  - [npm-update](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L93) - Executes `npm update` via NPM CLI.

  - [npm-update-dev](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm.js#L108) - Executes `npm update --dev` via NPM CLI.

- `npm-scripts`:
  - [`npm-run-<script name>`](https://github.com/typhonjs-node-gulp/typhonjs-core-gulptasks/blob/master/src/tasks/npm-scripts.js#L34) - Creates Gulp tasks dynamically generated from script entries found in `package.json` in the `rootPath`. Executes `npm run <script name>` via NPM CLI.

Importing and using `typhonjs-core-gulptasks` is easy and streamlined. 

First include it as an entry in `devDependencies` in `package.json`:
```
{
  ...
  
  "devDependencies": {
    "gulp": "^3.9.0",
    "jspm": "^0.16.0",
    "typhonjs-core-gulptasks": "^0.6.0",
    "typhonjs-npm-build-test": "^0.1.0"
  }
}
```

Then create a minimal `gulpfile.js`:
```
var gulp = require('gulp');

// Require all `typhonjs-core-gulptasks`; please note that typhonjs-core-gulptasks is now ES6 so `default` is required.
require('typhonjs-core-gulptasks').default(gulp, { rootPath: __dirname, srcGlob: './src/**/*.js' });
```

or better yet if using Babel / `typhonjs-npm-build-test` create a minimal ES6 `gulpfile.babel.js`:
```
import gulp          from 'gulp';
import gulpTasks     from 'typhonjs-core-gulptasks';

// Import all tasks and set `rootPath` to the base project path and `srcGlob` to all JS sources in `./src`.
gulpTasks(gulp, { rootPath: __dirname, srcGlob: ['./src/**/*.js'] });
```


Required options:

- `rootPath` - The root path where `package.json` is located for the given project that may contain [JSPM directives](https://github.com/jspm/registry/wiki/Configuring-Packages-for-jspm).

- `srcGlob` - Defines a [string or array of strings](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options) for the location of local sources to be manipulated by the following tasks: `eslint`.

Optional configuration parameters:

`configDir` - The directory where configuration files for various tasks such as `jspm-bundle` are stored; default 
(`./config`).

- `excludeTasks` - An array of strings which specifies particular categories of tasks to exclude.

- `importTasks` - An array of strings which specifies which categories of tasks to load. This allows only exposing certain tasks that are relevant for a given project. For instance several TyphonJS Node packages only use `eslint` and `npm`. Available task categories include: 'electron', 'esdoc', 'eslint', 'jspm', 'jspm-test', 'npm' and 'npm-scripts'.

--------

The [Electron](http://electron.atom.io/) tasks require that NPM modules [electron-packager](https://www.npmjs.com/package/electron-packager) and [electron-prebuilt](https://www.npmjs.com/package/electron-prebuilt) are installed in addition to an `.electronrc` configuration file located in the root path. `.electronrc` contains optional parameters for invoking electron-packager. Default values are provided for `platform` -> 'process.platform', `arch` -> 'process.arch', `source` -> '.' and `out` -> 'build' if not supplied. If the above requirements are met these tasks will be available. For options to provide in `.electronrc` please see:
https://www.npmjs.com/package/electron-packager#programmatic-api

For a complete example please see:  [electron-backbone-es6-localstorage-todos](https://github.com/typhonjs-demos-deploy-electron/electron-backbone-es6-localstorage-todos)

The `esdoc` task requires a valid `.esdocrc` or `esdoc.json` [configuration file](https://esdoc.org/config.html) file in the root project path.

The `eslint` task requires a valid [.eslintrc](http://eslint.org/docs/user-guide/configuring.html) file in the root project path. 

The `jspm-bundle` task requires two configuration files to be defined in `./config`:
- `./config/bundle-config.json` - Provides the main bundle configuration.

- `./config/bundle-config-travis.json` - Provides the testing / Travis bundle configuration which is used for an in memory bundle op by SystemJS Builder.

You may use comments in the bundle-config JSON files as they are stripped. 

The following is an example entry:
```
{
  "entryPoints":
  [
    {
      "buildType": "buildStatic",         // (Optional) 'buildStatic' is the default; use 'bundle' for non-SFX build.
      "inMemoryBuild": false              // (Optional) Indicates in memory build; may omit `dest<X>` entries.
      "destBaseDir": "./dist",            // Root destination directory for bundle output.
      "destFilename": "<filename>.js",    // Destination bundle file name.
      "formats": ["amd", "cjs", "umd"],   // Module format to use / also defines destination sub-directory.
      "mangle": false,                    // Uglify mangle property used by SystemJS Builder.
      "minify": false,                    // Minify property used by SystemJS Builder.
      "src": "<dir>/<filename>.js",       // Entry source point for SystemJS Builder
      "extraConfig":                      // (Optional) Defines additional JSPM config parameters to load after
      {                                   // ./config.js is loaded. Provide a string or array of strings and they
        "meta":                           // will be interpreted as an additional configuration file styled like
        {                                 // `config.js` or provide an object hash which is loaded directly.  This
          "jquery": { "build": false },   // example skips building `jquery` and `underscore`.
          "underscore": { "build": false }
        }
      },
      "builderOptions":                   // (Optional) an object hash of any valid parameters for SystemJS Builder. This 
      {                                   // example sets `globalDeps` for associating `jquery` and `underscore` for UMD  
        "globalDeps":                     // and global bundles.
        {
          "jquery": "$",
          "underscore": "_"
        }
      }
    }
  ]
}
```

Please note that `extraConfig` can be a string or array of strings of filepaths relative to the project root path that defines an additional JSPM styled configuration file like `config.js` (wrapped in a `System.config({ ... });` statement). This is particularly useful to define additional user supplied mapped paths that incorporate normalized JSPM package paths resolved from `config.js`. If an object literal / hash is supplied it is loaded directly.

Please note that `builderOptions` may include any valid optional parameters that SystemJS Builder supports.

For a comprehensive demo and tutorial see the [backbone-es6-localstorage-todos](https://github.com/typhonjs-demos/backbone-es6-localstorage-todos) repo which uses `typhonjs-core-gulptasks`.

typhonjs-core-gulptasks (c) 2015-present Michael Leahy, TyphonRT, Inc.

typhonjs-core-gulptasks may be freely distributed under the MPLv2.0 license.
