module.exports = App;


var feature = require('feature.js');
var $ = require('jquery');


/**
 * App
 */
function App() {
	if (!(this instanceof App)) {
        return new App();
    }

    this.$body = $('body');

    this.is_touch = feature.touch;

    this.body_scrollLeft = 0;
    this.body_scrollTop = 0;
}


App.prototype = {
	
	/**
	 * App.disableScroll
	 */
	disableScroll: function() {
	    // lock scroll position, but retain settings for later
	    // http://stackoverflow.com/a/3656618
	    this.body_scrollLeft = self.pageXOffset || document.documentElement.scrollLeft  || document.body.scrollLeft;
	    this.body_scrollTop = self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop;
	    $('html').css('overflow', 'hidden');

	    this.resetScroll(this.body_scrollLeft, this.body_scrollTop);

	    // disable scroll on touch devices as well
	    if (this.is_touch) {
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
	        position = this.body_scrollTop;
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
	        this.resetScroll(this.body_scrollLeft, position);
	    }

	    // enable scroll on touch devices as well
	    if (this.is_touch) {
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
	        this.body_scrollLeft = parseInt(position_x);
	    }

	    if (typeof position_y !== 'undefined') {
	        this.body_scrollTop = parseInt(position_y);
	    }

	    window.scrollTo(this.body_scrollLeft, this.body_scrollTop);
	},


	/**
	 * App.addState
	 *
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	addState: function(state) {

	    this.$body.addClass(state);
	},


	/**
	 * App.removeState
	 * 
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	removeState: function(state) {

	    this.$body.removeClass(state);
	}
}