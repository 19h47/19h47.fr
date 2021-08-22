/* global $ */
const select = require('dom-select');

/**
 * Config object
 *
 * global shared variables
 */
const config = {
	body: {
		el: select('body'),
		$: $('body'),
		scroll: {
			left: 0,
			top: 0,
		},
	},
	html: select('html'),
	transition: select('.js-transition'),
	// is
	is: {
		// eslint-disable-next-line
		touch: window.feature.touch,
	},
	// eslint-disable-next-line
	api: wp.api_url + 'wp/v2/',
	// eslint-disable-next-line
	nonce: wp.api_nonce,
};

module.exports = config;
