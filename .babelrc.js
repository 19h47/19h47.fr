const presets = [
	[
		'@babel/preset-env',
		{
			modules: false,
			targets: {
				edge: '17',
				firefox: '60',
				chrome: '67',
				safari: '11.1',
				ie: '11',
			},
			corejs: 3,
			useBuiltIns: 'usage',
		},
	],
];

const plugins = [
	'@babel/plugin-syntax-dynamic-import',
	'@babel/plugin-transform-runtime',
	'@babel/plugin-transform-parameters',
	'@babel/plugin-proposal-object-rest-spread',
	'@babel/plugin-transform-spread',
	'@babel/plugin-proposal-class-properties',
];

module.exports = { presets, plugins };
