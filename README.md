![Typhon-Core-Gulptasks](http://i.imgur.com/oWpvbAs.png)

[![NPM](https://img.shields.io/npm/v/typhon-core-gulptasks.svg?label=npm)](https://www.npmjs.com/package/typhon-core-gulptasks)
[![Build Status](https://travis-ci.org/typhonjs/typhon-core-gulptasks.svg?branch=master)](https://travis-ci.org/typhonjs/typhon-core-gulptasks)
[![Dependency Status](https://www.versioneye.com/user/projects/5636036136d0ab00160020a8/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5636036136d0ab00160020a8)

[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat)](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/LICENSE)

Provides common shared [Gulp](http://gulpjs.com/) tasks for [TyphonJS](https://github.com/typhonjs) and beyond for those using [JSPM](http://jspm.io) / [SystemJS](https://github.com/systemjs/systemjs). By packaging all common Gulp tasks as a NPM package this fascilitates sharing the tasks across several projects / repos and having one authoritative and versioned source for the tasks.

The following tasks are available and defined in `typhon-core-gulptasks`:
- [esdocs](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/esdoc.js) - Creates ES6 documentation with [ESDocs](https://esdoc.org/) via [gulp-esdoc](https://www.npmjs.com/package/gulp-esdoc) including [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) support and outputs to the location specified by `esdoc.json`.
- [eslint](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/eslint.js) - Runs ESLint using `.eslintrc` outputting to console and failing on any errors. 
- [git-push-clear-config](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/git.js) - Verifies the build by running `test-basic` and on success clears JSPM `config.js` of `map` & `paths` entries performing a `git commit` as necessary before executing `git push`. 
- [git-push](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/git.js) - Verifies the build by running `test-basic` and on success executes `git push`. 
- [jspm-bundle](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/jspm.js) - Creates one or more bundles defined in `./bundle-config.js` or `./bundle-config-travis.json` (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)
- [jspm-inspect](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/jspm.js) - Executes `jspm inspect`.
- [jspm-install](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/jspm.js) - Executes `jspm install`.
- [npm-install](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/npm.js) - Executes `npm install`.
- [npm-uninstall](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/npm.js) - Executes `npm uninstall`.
- [test-basic](https://github.com/typhonjs/typhon-core-gulptasks/blob/master/tasks/test.js) - Runs `eslint` and `jspm-bundle` tasks for basic testing.  (Add `--travis` argument to run minimal in memory bundle op for Travis CI.)
