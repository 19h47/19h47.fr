var Barba = require('barba.enhanced.js');
var select = require('dom-select');
var YouTubeVideo = require('youtube-video-js');

var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

/**
 * Works
 */
var Works = Barba.BaseView.extend({

	namespace: 'works',


	/**
	 * Works.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
	},


	/**
	 * Works.onEnterCompleted
	 */
	onEnterCompleted: function() {
		// The Transition has just finished.
	},


	/**
	 * Works.onLeave description
	 */
	onLeave: function() {
		// A new Transition toward a new page has just started.
	},

	
	/**
	 * Works.onLeaveCompleted
	 */
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});

module.exports = Works;