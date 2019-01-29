module.exports = {
	// parser: 'sugarss',
	plugins: {
		// 'postcss-import': {},
		// 'postcss-cssnext': {},
		'autoprefixer': { browsers: ['last 2 versions', 'safari >= 8', 'ie >= 9', 'ff >= 20', 'ios 6', 'android 4'] },
		'cssnano': process.env.NODE_ENV === 'production' ? true : false
	}
}
