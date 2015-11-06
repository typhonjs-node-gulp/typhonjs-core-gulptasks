/**
 * Requires all Gulp tasks. An optional array, `importTasks`, may be supplied which specifies which categories of
 * tasks to require. This allows only exposing certain tasks that are relevant for a given project. For instance
 * several TyphonJS Node packages only use `eslint` and `npm`.
 *
 * @param {Gulp}     gulp     - An instance of Gulp.
 * @param {object}   options  - Optional parameters
 */
module.exports = function(gulp, options)
{
   options = options || {};
   var importTasks = options.importTasks || ['esdoc', 'eslint', 'git', 'jspm', 'npm', 'test'];

   for (var cntr = 0; cntr < importTasks.length; cntr++)
   {
      switch (importTasks[cntr])
      {
         case 'esdoc':
            require('./tasks/esdoc.js')(gulp, options);
            break;

         case 'eslint':
            require('./tasks/eslint.js')(gulp, options);
            break;

         case 'git':
            require('./tasks/git.js')(gulp, options);
            break;

         case 'jspm':
            require('./tasks/jspm.js')(gulp, options);
            break;

         case 'npm':
            require('./tasks/npm.js')(gulp, options);
            break;

         case 'test':
            require('./tasks/test.js')(gulp, options);
            break;
      }
   }
};