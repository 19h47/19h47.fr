module.exports = Lastfm;

var $ = require('jquery');
var Mustache = require('mustache');

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
		limit: 50,
		user: '',
		api: {
			key: '',
			secret: '',
		}
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

	this.setup();
}


Lastfm.prototype = {

	/**
	 * Lastfm.setup
	 */
	setup: function() {

		this.API = {
			KEY: this.options.api.key,
			SECRET: this.options.api.secret,
			USER: this.options.user,
			URL: 'http://ws.audioscrobbler.com/2.0/'
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
		recentTracks: function() {
			this.lock.on.call(this);

			this.get(this.url.recentTracks.call(this))
				.then($.proxy(this.construct.recenTracks, this))
				.then($.proxy(this.append.recentTracks, this))
				.done($.proxy(this.lock.off, this));
		},

		
		/**
		 * Lastfm.show.info
		 */
		info: function() {
			this.get(this.url.info.call(this))
				.then($.proxy(this.construct.info, this))
				.done($.proxy(this.append.info, this));
		}

	},


	/**
	 * Lastfm.append
	 */
	append: {

		/**
		 * Lastfm.append.recentTracks
		 */
		recentTracks: function(html) {

			this.$response.find('.response').append(html);
		},


		/**
		 * Lastfm.append.info
		 */
		info: function(html) {

			this.$response.find('.playcount').prepend(html);
		}
	},


	/**
	 * Lastfm.construct
	 */
	construct: {

		/**
		 * Lastfm.construct.recentTracks
		 */
		recenTracks: function(response) {

			// var recenTracksLength = response.recenttracks.track.length;
			var template = $('#track').html();
			var output = '';
			var i = 0;
			
			Mustache.parse(template);


			for (i; i < this.options.limit; i++) {

				output += Mustache.render(template, {
					image: response.recenttracks.track[i].image[3]['#text'],
					artist: response.recenttracks.track[i].artist['#text'],
					name: response.recenttracks.track[i].name
				});
			}

			return output;

		},


		/**
		 * Lastfm.construct.info
		 */
		info: function(response) {
			
			return response.user.playcount;
		}
	},


	/**
	 * Lastfm.url
	 */
	url: {

		/**
		 * Lastfm.url.recentTracks
		 */
		recentTracks: function() {

			return this.API.URL + '?method=user.getrecenttracks&user=' + this.API.USER + '&api_key=' + this.API.KEY + '&format=json';
		},


		/**
		 * Lastfm.url.info
		 */
		info: function() {
			
			return this.API.URL + '?method=user.getinfo&user=' + this.API.USER + '&api_key=' + this.API.KEY + '&format=json';
		},
	},


	/**
	 * Lastfm.lock
	 */
	lock: {

		/**
		 * Lastfm.lock.on
		 */
		on: function() {
			// console.info('Lastfm.lock.on');

			// remove loading state to loader if exists
			this.loader.length && 
			this.loader
				.addClass('is-loading');
		},


		/**
		 * Lastfm.lock.off
		 */
		off: function() {
			// console.info('Lastfm.lock.off');

			// remove loading state to loader if exists
			this.loader.length && 
			this.loader
				.removeClass('is-loading');
		}
	},


	/**
	 * Lastfm.get
	 */
	get: function(url) {

		return $.get({
			url: url, 
			dataType: 'json'
		});
	}
};