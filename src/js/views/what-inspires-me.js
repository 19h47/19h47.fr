var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var scrollMonitor = require('scrollMonitor');
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
		
		new Modules.Tumblr('.Tumblr');
	},


	onEnterCompleted: function() {
		// The Transition has just finished.
		
		// scrollMonitor
		scrollMonitor.recalculateLocations();

		classes.remove(select('.js-footer'), 'is-active');
	},


	onLeave: function() {
		// A new Transition toward a new page has just started.
	},

	
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});

module.exports = WhatInspiresMe;