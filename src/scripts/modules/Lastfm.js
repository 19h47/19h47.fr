/* global $ */
import Mustache from 'mustache';

/**
 * Lastfm
 *
 * @see  http://www.last.fm/api
 */
function Lastfm(element, options) {
	if (!(this instanceof Lastfm)) {
		return new Lastfm();
	}

	// If jQuery isn't loaded
	if (!window.jQuery) {
		throw new Error('jQuery is missing.');
	}

	this.$element = $(element);

	if (!this.$element || !this.$element.length) {
		throw new Error('Missing selector.');
	}

	this.defaults = {
		user: '',
		api: {
			key: '',
			secret: '',
		},
	};

	this.options = $.extend({}, this.defaults, options);

	// If user isn't set
	if (!this.options.user || !this.options.user.length) {
		throw new Error('User is missing.');
	}

	// If API key isn't set
	if (!this.options.api.key || !this.options.api.key.length) {
		throw new Error('API key is missing.');
	}

	// If user isn't set
	if (!this.options.api.secret || !this.options.api.secret.length) {
		throw new Error('API secret is missing.');
	}

	return this.setup.call(this);
}


Lastfm.prototype = {

	/**
	 * Lastfm.setup
	 */
	setup() {
		this.API = {
			KEY: this.options.api.key,
			SECRET: this.options.api.secret,
			USER: this.options.user,
			URL: 'https://ws.audioscrobbler.com/2.0/',
		};

		this.$response = this.$element;
		this.loader = this.$response.find('.js-loader');

		this.show.recentTracks.call(this);
		this.show.info.call(this);
	},


	/**
	 * Lastfm.show
	 */
	show: {

		/**
		 * Lastfm.show.recentTracks
		 */
		recentTracks() {
			// console.info('Lastfm.show.recentTracks');
			this.lock.on.call(this);

			return this.get(this.url.recentTracks.call(this))
				.then(this.construct.recenTracks.bind(this))
				.then(this.append.recentTracks.bind(this))
				.done(this.lock.off.bind(this));
		},


		/**
		 * Lastfm.show.info
		 */
		info() {
			return this.get(this.url.info.call(this))
				.then(this.construct.info.bind(this))
				.done(this.append.info.bind(this));
		},
	},


	/**
	 * Lastfm.append
	 */
	append: {
		/**
		 * Lastfm.append.recentTracks
		 */
		recentTracks(html) {
			return this.$response.find('.response').append(html);
		},


		/**
		 * Lastfm.append.info
		 */
		info(html) {
			return this.$response.find('.playcount').prepend(html);
		},
	},


	/**
	 * Lastfm.construct
	 */
	construct: {

		/**
		 * Lastfm.construct.recentTracks
		 */
		recenTracks(response) {
			// console.info('Lastfm.construct.recentTracks');
			const template = $('#track').html();
			let output = '';

			response.recenttracks.track.forEach(track => {
				output += Mustache.render(template, {
					image: track.image[3]['#text'],
					artist: track.artist['#text'],
					name: track.name,
				});
			});

			return output;
		},


		/**
		 * Lastfm.construct.info
		 */
		info: response => response.user.playcount,
	},


	/**
	 * Lastfm.url
	 */
	url: {
		/**
		 * Lastfm.url.recentTracks
		 */
		recentTracks() {
			return `${this.API.URL}?method=user.getrecenttracks&user=${this.API.USER}&api_key=${this.API.KEY}&format=json`;
		},


		/**
		 * Lastfm.url.info
		 */
		info() {
			return `${this.API.URL}?method=user.getinfo&user=${this.API.USER}&api_key=${this.API.KEY}&format=json`;
		},
	},


	/**
	 * Lastfm.lock
	 */
	lock: {

		/**
		 * Lastfm.lock.on
		 */
		on() {
			// console.info('Lastfm.lock.on');

			// remove loading state to loader if exists
			// eslint-disable-next-line
			this.loader.length
				&& this.loader
					.addClass('is-loading');
		},


		/**
		 * Lastfm.lock.off
		 */
		off() {
			// console.info('Lastfm.lock.off');

			// remove loading state to loader if exists
			// eslint-disable-next-line
			this.loader.length
				&& this.loader
					.removeClass('is-loading');
		},
	},


	/**
	 * Lastfm.get
	 */
	get(url) {
		return $.get({
			url,
			dataType: 'json',
		});
	},
};

export default Lastfm;
