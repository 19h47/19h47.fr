module.exports = Watchers;

var scrollMonitor = require('scrollMonitor');
var config = require('../config');
var classes = require('dom-classes');
var select = require('dom-select');
var $ = require('jquery');

require('polyfill-nodelist-foreach');

/**
 * Watcher
 */
function Watchers() {
	if (!(this instanceof Watchers)) {
		return new Watchers();
	}

	// If jQuery isn't loaded
	if (!window.jQuery) {
		throw new Error('jQuery is missing.');
	}
	
	this.wrapper = select('.js-wrapper');

	this.footer();
	// this.tumblr();
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

		this.wrapperWatcher = scrollMonitor.create(this.wrapper);

		this.init.events.call(this);
	},


	/**
	 * Watchers.init
	 */
	init: {

		/**
		 * Watcher.init.events
		 */
		events: function() {

			window.addEventListener('scroll', function() {

				this.footer();
				// this.tumblr();

			}.bind(this));
		}
	},


	/**
	 * Watchers.tumblr
	 */
	tumblr: function() {
		// console.info('Watcher.tumblr');

		var element = select('.Tumblr');

		// If element selector doesn't exist
		if(!element) {
			return;
		}


		var tumblrPosts = document.querySelectorAll('.Tumblr__post');

		var collection = [];

		tumblrPosts.forEach(function(tumblrPost) {
			classes.add(tumblrPost, 'is-hidden');

			var tumblrPostWatcher = scrollMonitor.create(tumblrPost);

			collection.push(tumblrPostWatcher);

		});

		console.log(collection);
		collection.forEach(function(watcher) {
			
			window.addEventListener('scroll', function() {

				var offset = config.body.el.scrollTop + scrollMonitor.viewportHeight;
				
				var itemOffsetTop = (watcher.top+128) - config.body.el.scrollTop;

				// console.log(watcher.top);
				// console.log(config.body.el.scrollTop);

				// classes.add(watcher.watchItem, 'is-hidden');

				if (itemOffsetTop <= config.body.el.scrollTop) {
					
					classes.remove(watcher.watchItem, 'is-hidden');
				}

			});
		});

		// console.log(collection);
		
	},


	/**
	 * Watchers.footer
	 */
	footer: function() {
		// console.log('Watcher.footer');

		var element = select('.js-footer')

		// If element selector doesn't exist
		if(!element) {
			return;
		}

		// Avoid unnecessary DOM manipulation
		if(classes.contains(element, 'is-active')) {

			classes.remove(element, 'is-active');
		}

		// scrollMonitor
		scrollMonitor.update();

		var offset = config.body.el.scrollTop + scrollMonitor.viewportHeight;

		if(offset == document.documentElement.clientHeight) {
			
			classes.add(element, 'is-active');
		}

		if (offset >= scrollMonitor.documentHeight) {
			
			classes.add(element, 'is-active');
		}
	}
};