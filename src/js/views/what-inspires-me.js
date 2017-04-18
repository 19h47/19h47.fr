var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var classes = require('dom-classes');
var select = require('dom-select');


/**
 * WhatInspiresMe
 */
var WhatInspiresMe = Barba.BaseView.extend({

	namespace: 'what-inspires-me',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.

		var Tumblr = new Modules.Tumblr('.Tumblr');
		
		// Tumblr.deferred.then(function() {});
	},


	/**
	 * WhatInspiresMe.onEnterCompleted
	 */
	onEnterCompleted: function() {
		// The Transition has just finished.
		classes.remove(select('.js-footer'), 'is-active');
	},


	/**
	 * WhatInspiresMe.onLeave description
	 */
	onLeave: function() {
		// A new Transition toward a new page has just started.
	},

	
	/**
	 * WhatInspiresMe.onLeaveCompleted
	 */
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});

module.exports = WhatInspiresMe;