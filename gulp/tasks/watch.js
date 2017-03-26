// WATCH
var gulp = require('gulp'),

	config = require('../config');

gulp.task('watch', function() {
    gulp.watch( config.sass.srcWatch, ['sass'] );
    // gulp.watch( config.coffee.srcWatch, ['coffee'] );
    // gulp.watch( config.javascript.srcWatch, ['javascript'] );
    gulp.watch( config.svg.srcWatch, ['svg'] );
    // gulp.watch( config.minify.srcWatch, ['minify'] );
    gulp.watch( config.browserify.srcWatch, ['browserify']);
});