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
