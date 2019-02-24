import scrollMonitor from 'scrollmonitor';

// const config = require('../config');
const classes = require('dom-classes');
const select = require('dom-select');

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
	setup() {
		this.footer();
		this.initEvents();
	},

	initEvents() {
		window.addEventListener('scroll', () => {
			// scrollMonitor
			scrollMonitor.update();

			// console.log(scrollMonitor.viewportHeight);
			// console.log(config.body.el.scrollTop);
			// console.dir(config.body.el);

			// Update offset
			const scrollTop = window.pageYOffset
			|| document.documentElement.scrollTop
			|| document.body.scrollTop
			|| 0;
			const offset = scrollTop + scrollMonitor.viewportHeight;

			this.footer(select('.js-footer'), offset);
		});
	},


	/**
	 * Watchers.footer
	 *
	 * @var 	element 	DOM element
	 * @var 	offset		actual offset
	 */
	footer(element, offset) {
		// If element selector doesn't exist
		if (!element) {
			return;
		}

		// Avoid unnecessary DOM manipulation
		if (classes.contains(element, 'is-active')) {
			classes.remove(element, 'is-active');
			classes.remove(element, 'is-on-top');
		}

		if (offset === document.documentElement.clientHeight) {
			// console.log(offset);
			// console.log(document.documentElement.clientHeight);
			classes.add(element, 'is-active');
			classes.add(element, 'is-on-top');
		}

		if (offset >= scrollMonitor.documentHeight) {
			classes.add(element, 'is-active');
		}
	},
};

export default Watchers;
