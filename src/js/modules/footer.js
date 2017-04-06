module.exports = Footer;

var $ = require('jquery');
var scrollMonitor = require('scrollMonitor');

/**
 * Footer
 */
function Footer(element) {
 	if (!(this instanceof Footer)) {
    	return new Footer();
	}

    // If jQuery isn't loaded
    if (!window.jQuery) {
        throw new Error('jQuery is missing.');
    }

	this.$element = $(element);

	if (!this.$element || !this.$element.length) {
		throw new Error('Missing selector.');
	}

	this.$wrapper = $('.js-wrapper');
	this.body = document.querySelector('body');
	this.$body = $(this.body);

	this.setup();
}


/**
 * Footer
 */
Footer.prototype = {
	
	/**
	 * Footer.setup
	 */
	setup: function() {
		var _this = this;

		this.wrapperWatcher = scrollMonitor.create(this.$wrapper);

		this.init.events.call(this);
	},


	/**
	 * Footer.init
	 */
	init: {

		/**
		 * Footer.init.events
		 */
		events: function() {
			window.addEventListener('scroll', this.state.change.bind(this));
		}
	},


	/**
	 * Footer.state
	 */
	state: {

		/**
		 * Footer.state.change
		 */
		change: function() {

			// scrollMonitor
			scrollMonitor.update();

			if (this.body.scrollTop + scrollMonitor.viewportHeight === scrollMonitor.documentHeight) {
				
				this.state.add(this.$element, 'is-active');
			}

			if (this.body.scrollTop + scrollMonitor.viewportHeight != scrollMonitor.documentHeight) {
				
				this.state.remove(this.$element, 'is-active');
			}
		},


		/**
		 * Footer.state.add
		 *
		 * @param 	element
		 * @param 	classes
		 */
		add: function(element, classes) {
			
			element.addClass(classes);
		},


		/**
		 * Footer.state.remove
		 *
		 * @param 	element
		 * @param 	classes
		 */
		remove: function(element, classes) {
			
			element.removeClass(classes);
		}
	}
};