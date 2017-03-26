var gulp = require('gulp');

// BUILD

gulp.task( 'build', [ 'sass'/*, 'javascript'*/, 'browserify', 'svg'/*, 'minify'*/] );

// DEFAULT

gulp.task( 'default', [ 'build', 'watch'] );