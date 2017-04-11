var $ = require('jquery');
var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');


var NotFound = Barba.BaseView.extend({

	namespace: '404',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
		
		new Modules.Television('#television');

		$('.js-footer').addClass('is-active');
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


NotFound.init();

module.exports = NotFound;