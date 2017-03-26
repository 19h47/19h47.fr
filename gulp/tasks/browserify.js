// BROWSERIFY

var gulp = require('gulp');
var browserify = require('browserify');
// var gutil = require('gulp-util');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var config = require('../config' ).browserify;

gulp.task('browserify', function() {
    // var production = gutil.env.type === 'production';
    return browserify({
            entries: config.src
        })
        .bundle()
        // Pass desired output filename to vinyl-source-stream
        .pipe(source(config.file))
        .pipe(buffer())
        .pipe(gulp.dest(config.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        
        // Output to the build directory
        .pipe(gulp.dest(config.dest + '/min/'));
});