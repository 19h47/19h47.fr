var select = require('dom-select');

var config = {

	body: {
		el: select('body'),
		$: $('body'),
		scroll: {
			left: 0,
			top: 0
		}
	},

	html: select('html'),

	is: {
		touch: feature.touch
	},

	api: wp.api_url + 'wp/v2/',
	nonce: wp.api_nonce
}

module.exports = config;