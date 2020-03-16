/* global $ */
const css = require('dom-css');
const config = require('../config');


/**
 * App
 */
export default class App {
}


App.prototype = {

	/**
	 * App.disableScroll
	 */
	disableScroll() {
		// lock scroll position, but retain settings for later
		// http://stackoverflow.com/a/3656618
		config.body.scroll.left = document.documentElement.scrollLeft || document.body.scrollLeft;
		config.body.scroll.top = document.documentElement.scrollTop || document.body.scrollTop;

		css(config.html, 'overflow', 'hidden');

		this.resetScroll(config.body.scroll.left, config.body.scroll.top);

		// disable scroll on touch devices as well
		if (config.is.touch) {
			document.addEventListener('touchmove.app', e => {
				e.preventDefault();
			});
		}
	},


	/**
	 * App.enableScroll description]
	 *
	 * @param  position
	 */
	enableScroll(position) {
		if ('undefined' === typeof position) {
			// eslint-disable-next-line
			position = config.body.scroll.top;
		}

		let resumeScroll = true;
		if ('boolean' === typeof position && false === position) {
			resumeScroll = false;
		}

		// unlock scroll position
		// http://stackoverflow.com/a/3656618
		css(config.html, 'overflow', 'visible');

		// resume scroll position if possible
		if (resumeScroll) {
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
	 * @param  positionX
	 * @param  positionY
	 */
	resetScroll(positionX, positionY) {
		if ('undefined' !== typeof positionX) {
			config.body.scroll.left = parseInt(positionX, 10);
		}

		if ('undefined' !== typeof positionY) {
			config.body.scroll.top = parseInt(positionY, 10);
		}

		window.scrollTo(config.body.scroll.left, config.body.scroll.top);
	},


	/**
	 * App.addState
	 *
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	addState: state => config.body.$.addClass(state),


	/**
	 * App.removeState
	 *
	 * @param 	state
	 * @author 	Julien Vasseur julien@poigneedemainvirile.com
	 */
	removeState: state => {
		const deferred = new $.Deferred();

		config.body.$.removeClass(state);

		deferred.promise();

		return deferred.resolve();
	},
};
