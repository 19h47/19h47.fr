var $ = require('jquery');
var Tumblr = require('../modules/tumblr');
var Barba = require('barba.enhanced.js');


var WhatInspiresMe = Barba.BaseView.extend({

	namespace: 'what-inspires-me',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
		
		new Tumblr('.Tumblr');
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


WhatInspiresMe.init();

module.exports = WhatInspiresMe;