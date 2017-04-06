module.exports = Menu;

var $ = require('jquery');


/**
* Menu
*/
function Menu() {
	// console.log('Menu'); 
	if (!(this instanceof Menu)) {
		return new Menu();
	}
	
	this.button = '.js-menu-button';
	this.state = 'menu--is-open';
	this.$body = $('body');
	this.is_open = this.$body.hasClass(this.state);

	this.setup();
};


/**
* Menu
*/
Menu.prototype = {

	/**
	 * Menu.setup
	 */
	setup: function() {

		this.setupEvents();
	},


	/**
	* Menu.setupEvents
	*/
	setupEvents: function() {
		// console.log('Menu.setupEvents');

		$(document)
			.on('click.menu', this.button, $.proxy(this.toggle, this))
			.on('click.menu', '.js-menu-backdrop', $.proxy(this.toggle, this))
			.on('keydown.menu', $.proxy(function(e) {
				e.which === 27 && this.close();
			}, this));
	},


	/**
	* Menu.toggle
	*/
	toggle: function() {
		// console.log('Menu.toggle');
		if (this.is_open) {
			return this.close();
		}

		return this.open();
	},


	/**
	* Menu.open
	*/
	open: function() {
		// console.log('Menu.open');
		if (this.is_open) return;

		this.is_open = true;

		this.$body
			.addClass(this.state)
			.trigger('open.menu');

		app.disableScroll();
	},


	/**
	* Menu.close
	*/
	close: function() {
		// console.log('Menu.close');
		if (!this.is_open) return;

		this.is_open = false;

		this.$body
			.removeClass(this.state)
			.trigger('close.menu');

		app.enableScroll();

	}
}