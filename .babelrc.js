const presets = [
	[
		'@babel/preset-env',
		{
			targets: '>0.25%',
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
