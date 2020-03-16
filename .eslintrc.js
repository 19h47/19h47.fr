module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
	},
	extends: [
		'standard',
		'airbnb-base',
	],
	rules: {
		'arrow-parens': ['error', 'as-needed'],
		'no-console': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		indent: ['error', 'tab', { SwitchCase: 1, ignoredNodes: ["TemplateLiteral"] }],
		'template-curly-spacing': ["off"],
		'no-param-reassign': ['error', { props: false }],
		yoda: [2, 'always'],
		"import/no-named-as-default": 0,
		// Weird rule that is triggered on every function with name 'callback' or 'cb'
		// Added: https://github.com/standard/eslint-plugin-standard/issues/12
		// Maybe someday it will be removed: https://github.com/standard/eslint-plugin-standard/issues/27
		'standard/no-callback-literal': 'off',
	},
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: true
	},
	settings: {
		'import/resolver': {
			'webpack': {
				'config': 'config/webpack.common.js'
			},
		}
	},
};
