var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var classes = require('dom-classes');
var select = require('dom-select');

var NotFound = Barba.BaseView.extend({

	namespace: '404',


	/**
	 * NotFound.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
		
		new Modules.Television('#television');
	},


	onEnterCompleted: function() {

		// The Transition has just finished.
		classes.add(select('.js-footer'), 'is-active');
	},  

	onLeave: function() {
		// A new Transition toward a new page has just started.
	},

	
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});

module.exports = NotFound;
