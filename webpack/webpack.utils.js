const path = require('path'); // eslint-disable-line import/no-extraneous-dependencies

const resolve = dir => {
	return path.join(__dirname, '..', dir);
};

module.exports = resolve;
