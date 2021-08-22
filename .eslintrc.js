module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
	},
	extends: ['standard', 'airbnb-base', 'prettier'],
	rules: {
		'arrow-parens': ['error', 'as-needed'],
		'no-console': 'off',
		'no-debugger': 'production' === process.env.NODE_ENV ? 'error' : 'off',
		'no-tabs': 0,
		indent: ['error', 'tab', { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }],
		'template-curly-spacing': ['off'],
		'no-param-reassign': ['error', { props: false }],
		yoda: [2, 'always'],
		'import/no-named-as-default': 0,
		// Weird rule that is triggered on every function with name 'callback' or 'cb'
		// Added: https://github.com/standard/eslint-plugin-standard/issues/12
		// Maybe someday it will be removed: https://github.com/standard/eslint-plugin-standard/issues/27
		'standard/no-callback-literal': 'off',
		'import/no-anonymous-default-export': [
			'error',
			{
				allowArray: false,
				allowArrowFunction: false,
				allowAnonymousClass: false,
				allowAnonymousFunction: false,
				allowCallExpression: true, // The true value here is for backward compatibility
				allowLiteral: false,
				allowObject: false,
			},
		],
	},
	parser: '@babel/eslint-parser',
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: true,
	},
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack/webpack.config.common.js',
			},
		},
	},
};
