// SVG

var gulp            = require( 'gulp' ),
    svgstore		= require( 'gulp-svgstore' ),
    svgmin			= require( 'gulp-svgmin' ),
    plumber			= require( 'gulp-plumber' ),

    config          = require('../config').svg;

gulp.task('svg', function(){
	return gulp
		.src( config.src )
        .pipe( plumber({
            errorHandler: function ( error ) {
                console.log( error.message );
                this.emit( 'end' );
            }
        }))
        .pipe( svgmin() )
        .pipe( svgstore() )
        .pipe( gulp.dest( config.dest ));
});