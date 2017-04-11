var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');


var FrontPage = Barba.BaseView.extend({

	namespace: 'front-page',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
		
		new Modules.Paint('#canvas');
	},


	onEnterCompleted: function() {
		// The Transition has just finished.
	},
	

	onLeave: function() {
		// A new Transition toward a new page has just started.
	},

	
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});


FrontPage.init();

module.exports = FrontPage;