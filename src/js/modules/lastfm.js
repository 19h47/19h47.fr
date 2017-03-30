module.exports = Lastfm;

var $ = require('jquery');
var fn = require('../functions.js');

/**
 * Lastfm
 *
 * @see  http://www.last.fm/api
 */
function Lastfm(element) {
 	if (!(this instanceof Lastfm)) {
    	return new Lastfm();
	}

	$element = $(element);

	if (!$element || !$element.length) {
		return;
	}

	this.setup();
}


Lastfm.prototype = {

	/**
	 * Lastfm.setup
	 */
	setup: function() {

		this.API = {
			KEY: '3920629640c026da1a7437af12cb6089',
			SECRET: '78975b7ddf12b8b8216773e29d9dcb34',
			USER: 'Bsurde',
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

			var output = '';

			for (i = 0; i < 3; i++) {

				var track = {
					artist: response.recenttracks.track[i].artist['#text'],
					name: response.recenttracks.track[i].name,
					image: response.recenttracks.track[i].image[3]['#text']	
				}

				output += '<div class="Lastfm__row row margin-xs-top-32 margin-xs-bottom-32">';
				output += '<div class="col-xs-1 col-xs-offset-1">';
				output += '<img src="' + track.image + '" class="Lastfm__cover"/>';
				output += '</div><div class="col-xs-9">';
				output += '<p class=" color-white margin-xs-top-8 no-margin-bottom">';
				output += '<span class="artist font-medium">' + track.artist + '</span>';
				output += '<br/><span class="name font-light">' + track.name + '</span></p></div></div>';
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