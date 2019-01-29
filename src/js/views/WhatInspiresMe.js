import Barba from 'Vendors/barba.enhanced';

import Tumblr from 'Modules/Tumblr';

const classes = require('dom-classes');
const select = require('dom-select');


/**
 * WhatInspiresMe
 */
export default Barba.BaseView.extend({
	namespace: 'what-inspires-me',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter() {
		// The new Container is ready and attached to the DOM.
		// eslint-disable-next-line
		new Tumblr('.Tumblr');

		// Tumblr.deferred.then(function() {});
	},


	/**
	 * WhatInspiresMe.onEnterCompleted
	 */
	onEnterCompleted() {
		// The Transition has just finished.
		classes.remove(select('.js-footer'), 'is-active');
	},


	/**
	 * WhatInspiresMe.onLeave description
	 */
	onLeave() {
		// A new Transition toward a new page has just started.
	},


	/**
	 * WhatInspiresMe.onLeaveCompleted
	 */
	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});
