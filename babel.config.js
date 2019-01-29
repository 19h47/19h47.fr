const presets = [
  [
	'@babel/env',
	{
	  targets: {
		  esmodules: true,
		  edge: '17',
		  firefox: '60',
		  chrome: '67',
		  safari: '11.1',
		  ie: '11'
	  },
	  useBuiltIns: 'entry',
	},
  ],
];

const plugins = [
	'@babel/plugin-transform-runtime',
	'@babel/plugin-syntax-dynamic-import'
];

module.exports = { presets, plugins };
