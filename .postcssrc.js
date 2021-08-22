module.exports = {
	plugins: {
		'postcss-object-fit-images': {},
		'postcss-100vh-fix': {},
		// // 'postcss-import': {},
		// // 'postcss-cssnext': {},
		autoprefixer: {},
		cssnano: process.env.NODE_ENV === 'production' ? true : false,
	},
};
