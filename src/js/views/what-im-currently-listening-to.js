var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var classes = require('dom-classes');
var select = require('dom-select');


/**
 * WhatImCurrentlyListeningTo
 */
var WhatImCurrentlyListeningTo = Barba.BaseView.extend({

	/**
	 * WhatImCurrentlyListeningTo.namespace
	 */
	namespace: 'what-im-currently-listening-to',


	/**
	 * WhatImCurrentlyListeningTo.onEnter
	 */
	onEnter: function() {
		
		var Lastfm = new Modules.Lastfm('.Lastfm', {
			limit: 50,
			user: 'Bsurde',
			api: {
				key: '34ee8634c2620b37bb06c0910c946200',
				secret: '47d74ac88537e2963cd91c187f7636aa'
			}
		});

		Lastfm.deferred.then(function() {});
	},


	/**
	 * WhatImCurrentlyListeningTo.onEnterCompleted
	 */
	onEnterCompleted: function() {
		// The Transition has just finished.

		classes.remove(select('.js-footer'), 'is-active');
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

module.exports = WhatImCurrentlyListeningTo;