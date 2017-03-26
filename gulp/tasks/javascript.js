// JAVASCRIPT

var gulp = require('gulp');
var rename  = require('gulp-rename');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var plumber = require('gulp-plumber');

var config = require('../config').javascript;

gulp.task('javascript', function() {
    config.sources.forEach(function(source) {
        gulp.src( source.src )
            .pipe( plumber({
                errorHandler: function ( error ) {
                    console.log( error.message );
                    this.emit('end');
                }
            }))
            .pipe(concat( source.file))
            .pipe(gulp.dest( config.dest))
            .pipe(rename({ suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(config.dest + '/min/'));
    });
});