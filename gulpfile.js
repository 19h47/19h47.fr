/**
 * Gulpfile
 *
 * @see  https://github.com/gulpjs/gulp
 **/

/**
 * requireDir
 * 
 * @see https://github.com/aseemk/requireDir
 */
var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders with recurse option 
// pass to true
requireDir( './gulp/tasks', { recurse: true } );