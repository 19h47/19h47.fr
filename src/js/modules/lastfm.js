module.exports = Lastfm;

var $ = require('jquery');
var fn = require('../functions.js');
var LastfmAPI = require('lastfmapi');

// Application name		My listening	
// Registered to		Bsurde

/**
 * Lastfm
 */
function Lastfm(element) {
 	if (!(this instanceof Lastfm)) {
    	return new Lastfm();
	}

	$element = $(element);

	if (!$element || !$element.length) {
		return;
	}

	this.API_KEY = '3920629640c026da1a7437af12cb6089';
	this.API_SECRET = '78975b7ddf12b8b8216773e29d9dcb34';
	this.USER = 'Bsurde';

	this.lastfm = new LastfmAPI({
		'api_key' : this.API_KEY,
		'secret' : this.API_SECRET
	});

	$response = $element;

	// console.log(this.lastfm);

	// Clients.setup 
	this.setup();
}


Lastfm.prototype = {
	
	/**
	 * Lastfm.setup
	 */
	setup: function() {
		// console.info('Lastfm.setup');
		
		this.lastfm.user.getRecentTracks({
			user: this.USER
		}, 

		function(err, recentTracks) {
			if(err) { throw err; }

			for ( i = 0; i < 3; i++ ) {

				var posts = {
					artist: recentTracks.track[i].artist['#text'],
					name: recentTracks.track[i].name,
					image: recentTracks.track[i].image[3]['#text']
					
				}
				
				$('.currently-listening').append('<div class="Lastfm__row row margin-xs-top-24 margin-xs-bottom-24"><div class="col-xs-1 col-xs-offset-1"><img src="' + posts.image + '" class="Lastfm__cover"/></div><div class="col-xs-9"><p class=" color-white margin-xs-top-12 no-margin-bottom"><span class="artist font-medium">' + posts.artist + '</span><br/><span class="name font-light">' + posts.name + '</span></p></div></div>');
			}
		});




		this.lastfm.user.getInfo(
			this.USER, 

			function(err, info) {
				if(err) { throw err; }

				// console.log(info);

				$response.find('.playcount').prepend(info.playcount);
		});
	}
};