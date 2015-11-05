![typhonjs-core-gulptasks](http://i.imgur.com/KqIyNtd.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-core-gulptasks.svg?label=npm)](https://www.npmjs.com/package/typhonjs-core-gulptasks)
[![Build Status](https://travis-ci.org/typhonjs/typhonjs-core-gulptasks.svg?branch=0.1.0)](https://travis-ci.org/typhonjs/typhonjs-core-gulptasks)
[![Dependency Status](https://www.versioneye.com/user/projects/563b3b1c1d47d40015000a91/badge.svg?style=flat)](https://www.versioneye.com/user/projects/563b3b1c1d47d40015000a91)

[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat)](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/LICENSE)

Provides common shared [Gulp](http://gulpjs.com/) tasks for [TyphonJS](https://github.com/typhonjs) and beyond for those using [JSPM](http://jspm.io) / [SystemJS](https://github.com/systemjs/systemjs). By packaging all common Gulp tasks as a NPM package this fascilitates sharing the tasks across several projects / repos and having one authoritative and versioned source for these tasks and all dependencies. Various JSPM & NPM CLI functions are wrapped as tasks allowing execution from IDEs which support Gulp. 

The following tasks are available and defined in `typhonjs-core-gulptasks`:
- [esdocs](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/esdoc.js) - Creates ES6 documentation with [ESDocs](https://esdoc.org/) via [gulp-esdoc](https://www.npmjs.com/package/gulp-esdoc) including [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) support and outputs to the location specified by `esdoc.json`.
- [eslint](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/eslint.js) - Runs [ESLint](http://eslint.org/) using `.eslintrc` outputting to console and failing on any errors.
- [git-push](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/git.js) - Verifies the build by running `test-basic` and on success executes `git push`. 
- [jspm-bundle](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js) - Creates one or more bundles defined in `./config/bundle-config.json` or `./config/bundle-config-travis.json` (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)
- [jspm-clear-config](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js) - Removes all `paths` and `map` entries that may be populated in the primary / root `config.js`. Performs a git commit if `config.js` was modified.
- [jspm-clear-config-git-push](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js) - Verifies the build by running `test-basic` and on success runs `jspm-clear-config` then `git-push` tasks. 
- [jspm-inspect](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js) - Executes `jspm inspect` via JSPM CLI.
- [jspm-install](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/jspm.js) - Executes `jspm install` via JSPM CLI.
- [npm-install](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js) - Executes `npm install` via NPM CLI.
- [npm-outdated](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js) - Executes `npm outdated` via NPM CLI.
- [npm-uninstall](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/npm.js) - Executes `npm uninstall` via NPM CLI.
- [test-basic](https://github.com/typhonjs/typhonjs-core-gulptasks/blob/master/tasks/test.js) - Sets process.env.TRAVIS and runs `eslint` and `jspm-bundle` tasks for basic testing.  (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)

Importing and using `typhonjs-core-gulptasks` is easy and streamlined. 

First include it as an entry in `devDependencies` in `package.json`:
```
{
  ...
  
  "devDependencies": {
    "gulp": "^3.9.0",
    "jspm": "^0.16.14",
    "typhonjs-core-gulptasks": "^0.1.0"
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

The `esdoc` task requires a valid [esdoc.json](https://esdoc.org/config.html) file in the root project path.

The `eslint` task requires a valid [.eslintrc](http://eslint.org/docs/user-guide/configuring.html) file in the root project path. 

The `jspm-bundle` task requires two configuration files to be defined in `./config`:
- `./config/bundle-config.js` - Provides the main bundle configuration.

- `./config/bundle-config-travis.js` - Provides the testing / Travis bundle configuration which is used for an in memory bundle op by SystemJS Builder.

The following is an example entry:
```
{
  "entryPoints":
  [
    {
      "destBaseDir": "./dist",            // Root destination directory for bundle output.
      "destFilename": "<filename>.js",    // Destination bundle file name.
      "formats": ["amd", "cjs"],          // Module format to use / also defines destination sub-directory.
      "mangle": false,                    // Uglify mangle property used by SystemJS Builder.
      "minify": false,                    // Minify property used by SystemJS Builder.
      "src": "<dir>/<filename>.js",       // Entry source point for SystemJS Builder
      "extraConfig":                      // Defines additional JSPM config parameters to load after ./config.json is
      {                                   // loaded. Provide a string and it will be interpreted as an additional
        "meta":                           // configuration file styled like `config.js` or provide an object hash
        {                                 // which is loaded directly.  This example skips building `jquery` and    
          "jquery": { "build": false },   // `underscore`.
          "underscore": { "build": false }
        }
      }
    }
  ]
}
```

Please note that `extraConfig` can be a string / file path relative to the project root path that defines an additional JSPM styled configuration file like `config.js` (wrapped in a `System.config({ ... });` statement). This is particularly useful to define additional user supplied mapped paths that incorporate normalized JSPM package paths resolved from `config.js`. If an object literal / hash is supplied it is loaded directly.

For a comprehensive demo and tutorial see the [backbone-parse-es6-demo](https://github.com/typhonjs/backbone-parse-es6-demo) repo which uses `typhonjs-core-gulptasks`.

typhonjs-core-gulptasks (c) 2015-present Michael Leahy, TyphonRT, Inc.

typhonjs-core-gulptasks may be freely distributed under the MIT license.
