![typhonjs-core-gulptasks](http://i.imgur.com/KqIyNtd.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-core-gulptasks.svg?label=npm)](https://www.npmjs.com/package/typhonjs-core-gulptasks)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat)](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/LICENSE)

[![Build Status](https://travis-ci.org/typhonjs/typhonjs-core-gulptasks.svg?branch=0.1.0)](https://travis-ci.org/typhonjs/typhonjs-core-gulptasks)
[![Dependency Status](https://www.versioneye.com/user/projects/563b3b1c1d47d40015000a91/badge.svg?style=flat)](https://www.versioneye.com/user/projects/563b3b1c1d47d40015000a91)

Provides common shared [Gulp](http://gulpjs.com/) tasks for [TyphonJS](https://github.com/typhonjs) and beyond for those using [JSPM](http://jspm.io) / [SystemJS](https://github.com/systemjs/systemjs). By packaging all common Gulp tasks as a NPM package this fascilitates sharing the tasks across several projects / repos having one authoritative and versioned source for these tasks and all dependencies. Various JSPM & NPM CLI functions are wrapped as tasks allowing execution from IDEs which support Gulp. 

The following tasks are available and defined in `typhonjs-core-gulptasks`:
- [esdocs](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/esdoc.js#L19) - Creates ES6 documentation with [ESDocs](https://esdoc.org/) via [gulp-esdoc](https://www.npmjs.com/package/gulp-esdoc) including [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm), [esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace), [esdoc-importpath-plugin](https://www.npmjs.com/package/esdoc-importpath-plugin) and
[esdoc-es7-plugin](https://www.npmjs.com/package/esdoc-es7-plugin) support and outputs to the location specified by `esdoc.json`.
- [eslint](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/eslint.js#L21) - Runs [ESLint](http://eslint.org/) via [gulp-eslint](https://www.npmjs.com/package/gulp-eslint) using `.eslintrc` outputting to console and failing on any errors.
- [git-push](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/git.js#L25) - Verifies the build by running `test-basic` and on success executes `git push`. 
- [jspm-bundle](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L67) - Creates one or more bundles defined in `./config/bundle-config.json` or `./config/bundle-config-travis.json` (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)
- [jspm-clear-config](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L177) - Removes all `paths` and `map` entries that may be populated in the primary JSPM config file. Performs a git commit if the config file was modified.
- [jspm-clear-config-git-push](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L251) - Verifies the build by running `test-basic` and on success runs `jspm-clear-config` then `git-push` tasks. 
- [jspm-dl-loader](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L261) - Executes `jspm dl-loader` via JSPM CLI.
- [jspm-inspect](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L275) - Executes `jspm inspect` via JSPM CLI.
- [jspm-install](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js#L289) - Executes `jspm install` via JSPM CLI.
- [npm-install](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js#L21) - Executes `npm install` via NPM CLI.
- [npm-outdated](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js#L35) - Executes `npm outdated` via NPM CLI.
- [`npm-run-<script name>`](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js#L55) - Creates Gulp tasks dynamically generated from script entries found in `package.json` in the `rootPath`. Executes `npm run <script name>` via NPM CLI.
- [npm-uninstall](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js#L77) - Executes `npm uninstall` via NPM CLI.
- [test-basic](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/test.js#L18) - Sets process.env.TRAVIS and runs `eslint` and `jspm-bundle` tasks for basic testing.  (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)

For the latest significant changes please see the [CHANGELOG](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/CHANGELOG.md).

Importing and using `typhonjs-core-gulptasks` is easy and streamlined. 

First include it as an entry in `devDependencies` in `package.json`:
```
{
  ...
  
  "devDependencies": {
    "gulp": "^3.9.0",
    "jspm": "^0.16.24",
    "typhonjs-core-gulptasks": "^0.4.2"
  }
}
```

Then create a minimal `gulpfile.js`:
```
var gulp = require('gulp');

// Require all `typhonjs-core-gulptasks`
require('typhonjs-core-gulptasks')(gulp, { rootPath: __dirname, srcGlob: './src/**/*.js' });
```

- `rootPath` defines the base path where JSPM `config.js` is located.

- `srcGlob` defines a [string or array of strings](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options) for the location of local sources to be manipulated by the following tasks: `eslint`.

- `importTasks` defines an optional array of strings limiting the category groups of tasks loaded. If this option is not supplied all task categories are loaded. The categories available include: 'esdoc', 'eslint', 'git', 'jspm', 'npm', 'test'. For instance for the ES5 / Node TyphonJS repos `importTasks: ['eslint', 'npm']` is used to just load eslint and npm related tasks. 


The `esdoc` task requires a valid [esdoc.json](https://esdoc.org/config.html) file in the root project path.

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

For a comprehensive demo and tutorial see the [backbone-parse-es6-todos](https://github.com/typhonjs-demos/backbone-parse-es6-todos) repo which uses `typhonjs-core-gulptasks`.

typhonjs-core-gulptasks (c) 2015-present Michael Leahy, TyphonRT, Inc.

typhonjs-core-gulptasks may be freely distributed under the MIT license.
