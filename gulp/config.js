/**
 * Config
 * 
 * To clean modules that are not used in package.json but still installed: `npm 
 * prune` in terminal.
 **/


// Sources of files
var src = './src';
var nodeModules = './node_modules/';


// Names of files
var fileCSS = 'global.css';
var fileJS = 'bundle.js';


// Destinations of files
var dest = './dist';


/**
 * Option for gulp-cssnano
 * @see  https://github.com/ben-eb/gulp-cssnano
 */
var browserSupported = [ 'last 2 versions', 'safari >= 8', 'ie >= 9', 'ff >= 20', 'ios 6', 'android 4' ];

module.exports = {
	
	/**
	 * Sass
	 **/
	sass: {
		// Source of CSS files
		sources: [{
			src: [
				src + '/scss/main.scss'
			],
			deps: [
				nodeModules + 'ress',
				nodeModules + 'breakpoint-sass/stylesheets',
				nodeModules + 'breakpoint-slicer/stylesheets',
				nodeModules + 'bootstrap-sass/assets/stylesheets'
			],
			file: fileCSS
		},
		{
			src: src + '/scss/editor-style.scss',
			file: 'editor-style.css',
			deps: [
				nodeModules + 'ress',
				nodeModules + 'breakpoint-sass/stylesheets',
				nodeModules + 'breakpoint-slicer/stylesheets',
				nodeModules + 'bootstrap-sass/assets/stylesheets'
			],
		}
		],

		// vendors: [],

		// Source to watch
		srcWatch: src + '/scss/**/*',
		dest: dest + '/css'
	},


	/**
	 * Browserify
	 **/
	browserify: {
		src: [src + '/js/main.js'],
		srcWatch: src + '/js/**/*.js',
		file: fileJS,
		dest: dest + '/js'
	},


	/**
	 * JavaScript
	 **/
	javascript: {
		// Source to watch
		srcWatch: src + '/js/*.js',
		// Destination
		dest: dest + '/js',
		// Source of Javascript files
		sources: [
			{
				src: [
					'./node_modules/feature.js/feature.js',
				],
				file: 'feature.js',
			}
		]
	},


	/**
	 * Minify
	 */
	minify: {
		src: dest + '/css/' + fileCSS,
		srcWatch : src + '/scss/**',
		dest: dest + '/css/min',
		supported: browserSupported,
	},


	/**
	 * SVG
	 **/
	svg: {
		src: 'img/svg/icons/*.svg',
		srcWatch: 'img/svg/icons/*.svg',
		dest: dest + '/svg',
	},
};