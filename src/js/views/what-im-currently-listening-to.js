var $ = require('jquery');
var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var scrollMonitor = require('scrollMonitor');


/**
 * WhatInspiresMe
 */
var WhatImCurrentlyListeningTo = Barba.BaseView.extend({

	/**
	 * WhatInspiresMe.namespace
	 */
	namespace: 'what-im-currently-listening-to',


	/**
	 * WhatInspiresMe.onEnter
	 */
	onEnter: function() {
		
		new Modules.Lastfm('.Lastfm', {
			limit: 50,
			user: 'Bsurde',
			api: {
				key: '34ee8634c2620b37bb06c0910c946200',
				secret: '47d74ac88537e2963cd91c187f7636aa'
			}
		});
	},


	/**
	 * WhatImCurrentlyListeningTo.onEnterCompleted
	 */
	onEnterCompleted: function() {
		// The Transition has just finished.

		// scrollMonitor
		scrollMonitor.update();

		$('.js-footer').removeClass('is-active');
	},
	

	/**
	 * WhatImCurrentlyListeningTo.onLeave
	 */
	onLeave: function() {
		// A new Transition toward a new page has just started.
	},


	/**
	 * WhatImCurrentlyListeningTo.onLeaveCompleted
	 */	
	onLeaveCompleted: function() {
		// The Container has just been removed from the DOM.
	}
});


WhatImCurrentlyListeningTo.init();

module.exports = WhatImCurrentlyListeningTo;