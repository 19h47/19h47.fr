const { merge } = require('webpack-merge');

const common = require('./webpack.config.common');
const production = require('./webpack.config.production');
const development = require('./webpack.config.development');

module.exports = (env, argv) => {
	switch (argv.mode) {
		case 'development':
			return merge(common, development, { mode: argv.mode });
		case 'production':
			return merge(common, production, { mode: argv.mode });
		default:
			throw new Error(`Trying to use an unknown mode, ${argv.mode}`);
	}
};
