var $ = require('jquery');
var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var scrollMonitor = require('scrollMonitor');


/**
 * WhatInspiresMe
 */
var WhatICurrentlyListening = Barba.BaseView.extend({

	/**
	 * WhatInspiresMe.namespace
	 */
	namespace: 'what-i-currently-listening',


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
	 * WhatICurrentlyListening.onEnterCompleted
	 */
	onEnterCompleted: function() {
	    // The Transition has just finished.

	    // scrollMonitor
    	scrollMonitor.update();

    	$('.js-footer').removeClass('is-active');
	},
	

	/**
	 * WhatICurrentlyListening.onLeave
	 */
	onLeave: function() {
	    // A new Transition toward a new page has just started.
	},


	/**
	 * WhatICurrentlyListening.onLeaveCompleted
	 */	
	onLeaveCompleted: function() {
	    // The Container has just been removed from the DOM.
	}
});


WhatICurrentlyListening.init();

module.exports = WhatICurrentlyListening;