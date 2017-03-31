module.exports = Lastfm;

var $ = require('jquery');
var fn = require('../functions.js');

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

	$element = $(element);

	if (!$element || !$element.length) {
		throw new Error('Missing selector.');
	}

	this.defaults = {
		limit: 50,
		user: '',
		apiKey: '',
		apiSecret: '',
	};

	this.options = $.extend({}, this.defaults, options);

	// If user isn't set
	if (!this.options.user || !this.options.user.length) {
	    throw new Error('User is missing.');
	}

	// If API key isn't set
	if (!this.options.apiKey || !this.options.apiKey.length) {
	    throw new Error('API key is missing.');
	}

	// If user isn't set
	if (!this.options.apiSecret || !this.options.apiSecret.length) {
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
			KEY: this.options.apiKey,
			SECRET: this.options.apiSecret,
			USER: this.options.user,
		}

		this.$response = $element;

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
			this.get(this.url.recentTracks.call(this))
				.then($.proxy(this.construct.recenTracks, this))
				.done($.proxy(this.append.recentTracks, this));
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

			var recenTracksLength = response.recenttracks.track.length;
			var output = '';

			for (i = 0; i < this.options.limit; i++) {

				var track = {
					artist: response.recenttracks.track[i].artist['#text'],
					name: response.recenttracks.track[i].name,
					image: response.recenttracks.track[i].image[3]['#text']	
				}

				output += '<div class="Lastfm__row row margin-xs-top-32 margin-xs-bottom-32" data-aos="slide-up" data-aos-offset="0">';
				output += '<div class="col-xs-1 col-xs-offset-1">';
				output += '<div class="Lastfm__cover" style="background-image: url(\'' + track.image + '\')">';
				output += '</div>';
				output += '</div>';
				output += '<div class="col-xs-9">';
				output += '<p class="color-white margin-xs-top-8 no-margin-bottom">';
				output += '<span class="artist font-medium">' + track.artist + '</span><br/>';
				output += '<span class="name font-light">' + track.name + '</span>';
				output += '</p></div></div>';
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

			return url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + this.API.USER + '&api_key=' + this.API.KEY + '&format=json';
		},


		/**
		 * Lastfm.url.info
		 */
		info: function() {
			
			return url = 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=' + this.API.USER + '&api_key=' + this.API.KEY + '&format=json';
		},
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