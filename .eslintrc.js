module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		jquery: true
	},
	extends: ['standard', 'airbnb-base'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'no-param-reassign': ['error', {
			props: true,
			ignorePropertyModificationsFor: ['state']
		}],
	},
	parser: 'babel-eslint',
	parserOptions: {
		'sourceType': 'module'
	},
	settings: {
		'import/resolver': {
			'webpack': {
				'config': 'config/webpack.common.js'
			},
		}
	},
};
