var $ = require('jquery');
var Lastfm = require('../modules/lastfm');
var Barba = require('barba.enhanced.js');


var WhatICurrentlyListening = Barba.BaseView.extend({

	namespace: 'what-i-currently-listening',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		// The new Container is ready and attached to the DOM.
		
		new Lastfm('.Lastfm', {
			limit:50,
			user: 'Bsurde',
			apiKey: '34ee8634c2620b37bb06c0910c946200',
			apiSecret: '47d74ac88537e2963cd91c187f7636aa',
		});
	},


	onEnterCompleted: function() {
	    // The Transition has just finished.
	},
	  

	onLeave: function() {
	    // A new Transition toward a new page has just started.
	},

	
	onLeaveCompleted: function() {
	    // The Container has just been removed from the DOM.
	}
});


WhatICurrentlyListening.init();

module.exports = WhatICurrentlyListening;