module.exports = Watchers;

var scrollMonitor = require('scrollMonitor');
var config = require('../config');
var classes = require('dom-classes');
var select = require('dom-select');

require('polyfill-nodelist-foreach');

/**
 * Watcher
 */
function Watchers() {
	if (!(this instanceof Watchers)) {
		return new Watchers();
	}
	
	this.wrapper = select('.js-wrapper');

	this.setup();
}


/**
 * Watchers
 */
Watchers.prototype = {
	
	/**
	 * Watchers.setup
	 */
	setup: function() {

		this.footer();
		this.initEvents();
	},

	initEvents: function(){

		window.addEventListener('scroll', function() {
			// scrollMonitor
			scrollMonitor.update();

			// Update offset
			var offset = config.body.el.scrollTop + scrollMonitor.viewportHeight;

			this.footer(select('.js-footer'), offset);


		}.bind(this));
	},


	/**
	 * Watchers.footer
	 *
	 * @var 	element 	DOM element
	 * @var 	offset		actual offset
	 */
	footer: function(element, offset){

		// If element selector doesn't exist
		if(!element) {
			return;
		}

		// Avoid unnecessary DOM manipulation
		if(classes.contains(element, 'is-active')) {

			classes.remove(element, 'is-active');
			classes.remove(element, 'is-on-top');
		}


		if(offset == document.documentElement.clientHeight) {
			
			classes.add(element, 'is-active');
			classes.add(element, 'is-on-top');
		}

		if (offset >= scrollMonitor.documentHeight) {
			
			classes.add(element, 'is-active');
		}
	}	
};