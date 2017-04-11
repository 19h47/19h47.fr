module.exports = App;


var config = require('../config');
var $ = require('jquery');


/**
 * App
 */
function App() {
	if (!(this instanceof App)) {
		return new App();
	}
}


App.prototype = {
	
	/**
	 * App.disableScroll
	 */
	disableScroll: function() {
		
		// lock scroll position, but retain settings for later
		// http://stackoverflow.com/a/3656618
		config.body.scroll.left = self.pageXOffset || document.documentElement.scrollLeft  || document.body.scrollLeft;
		config.body.scroll.top = self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop;
		
		$('html').css('overflow', 'hidden');

		this.resetScroll(config.body.scroll.left, config.body.scroll.top);

		// disable scroll on touch devices as well
		if (config.is.touch) {
			$(document).on('touchmove.app', function(e) {
				e.preventDefault();
			});
		}
	},


	/**
	 * App.enableScroll description]
	 * 
	 * @param  position
	 */
	enableScroll: function(position) {
		if (typeof position === 'undefined') {
			position = config.body.scroll.top;
		}

		var resume_scroll = true;
		if (typeof position === 'boolean' && position === false) {
			resume_scroll = false;
		}

		// unlock scroll position
		// http://stackoverflow.com/a/3656618
		$('html').css('overflow', 'visible');

		// resume scroll position if possible
		if (resume_scroll) {
			this.resetScroll(config.body.scroll.left, position);
		}

		// enable scroll on touch devices as well
		if (config.is.touch) {
			$(document).off('touchmove.app');
		}
	},


	/**
	 * App.resetScroll
	 * 
	 * @param  position_x
	 * @param  position_y
	 */
	resetScroll: function(position_x, position_y) {

		if (typeof position_x !== 'undefined') {
			config.body.scroll.left = parseInt(position_x);
		}

		if (typeof position_y !== 'undefined') {
			config.body.scroll.top = parseInt(position_y);
		}

		window.scrollTo(config.body.scroll.left, config.body.scroll.top);
	},


	/**
	 * App.addState
	 *
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	addState: function(state) {

		config.body.$.addClass(state);
	},


	/**
	 * App.removeState
	 * 
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	removeState: function(state) {

		config.body.$.removeClass(state);
	}
};