## 0.5.0 (2016-01-27)
- Added support for [Electron](http://electron.atom.io/) with tasks `electron-package-<platform>-<arch>`, `electron-start` and `electron-start-debug` tasks. For these tasks to appear you must include `electron-packager` and `electron-prebuilt` NPM modules in `devDependencies` in `package.json`. You must also supply in the root path `electron.json` which provides any [options available for packaging apps](https://www.npmjs.com/package/electron-packager#programmatic-api). Default values are provided for `platform` -> 'process.platform', `arch` -> 'process.arch', `source` -> '.' and `out` -> 'build' if not supplied. You may include comments in `electron.json`. Please see [electron-backbone-es6-localstorage-todos](https://github.com/typhonjs-demos/backbone-es6-localstorage-todos) for an example.

- Added `npm-list-depth-0` task; Executes `npm list --depth=0` via NPM CLI.
 
- Added optional parameter `configDir` for setting a custom config directory path relative to the root path when initializing `typhonjs-core-gulptasks` from `gulpfile.js`.

- Added command line option `--bundleConfig=<path/to/config.json>` to specify a custom path + bundle config JSON file relative to the root path for the `jspm-bundle` task.

## 0.4.2 (2016-01-22)
- Added `jspm-dl-loader`; Executes `jspm dl-loader` via JSPM CLI. 
- Added optional `builderOptions` object hash in bundle-config.json and bundle-config-travis.json files for `jspm-bundle` task. Any extra options available to SystemJS Builder are defined here. 

## 0.4.1 (2016-01-17)
- Added `npm-run-<script>`; dynamically creating Gulp tasks from all script entries `package.json` found in `rootPath`. 

## 0.4.0 (2016-01-12)
- updated [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) to `0.5.0` and
[esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace) to `0.3.0`.
- comments can now be used in bundle-config.json and bundle-config-travis.json files for jspm-bundle task.
- Added npm-run-test and npm-run-test-coverage which will run `test` and `test-coverage` scripts defined in `package.json`.

## 0.3.0 (2015-11-08)
- For esdoc task added [esdoc-importpath-plugin](https://www.npmjs.com/package/esdoc-importpath-plugin]) and
[esdoc-es7-plugin](https://www.npmjs.com/package/esdoc-es7-plugin) plugin support.
- updated [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) to `0.4.0` and
[esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace) to `0.2.0`.

## 0.2.0 (2015-11-06)
- Added [esdoc-plugin-extends-replace](https://www.npmjs.com/package/esdoc-plugin-extends-replace) plugin support +
updated [esdoc-plugin-jspm](https://www.npmjs.com/package/esdoc-plugin-jspm) to `0.3.1` which now does automatic
parsing of JSPM packages.
- Added `importTasks` optional parameter which takes an array of task groups to load. The task groups are: 'esdoc',
'eslint', 'git', 'jspm', 'npm', 'test'.

## 0.1.0 (2015-11-01)
- Initial release
