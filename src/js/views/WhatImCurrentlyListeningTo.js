import Barba from 'Vendors/barba.enhanced';
import Lastfm from 'Modules/Lastfm';

const classes = require('dom-classes');
const select = require('dom-select');


/**
 * WhatImCurrentlyListeningTo
 */
const WhatImCurrentlyListeningTo = Barba.BaseView.extend({

	/**
	 * WhatImCurrentlyListeningTo.namespace
	 */
	namespace: 'what-im-currently-listening-to',


	/**
	 * WhatImCurrentlyListeningTo.onEnter
	 */
	onEnter() {
		// eslint-disable-next-line
		const lastfm = new Lastfm('.Lastfm', {
			limit: 50,
			user: 'Bsurde',
			api: {
				key: '34ee8634c2620b37bb06c0910c946200',
				secret: '47d74ac88537e2963cd91c187f7636aa',
			},
		});
	},


	/**
	 * WhatImCurrentlyListeningTo.onEnterCompleted
	 */
	onEnterCompleted() {
		// The Transition has just finished.
		classes.remove(select('.js-footer'), 'is-active');
	},


	/**
	 * WhatImCurrentlyListeningTo.onLeave
	 */
	onLeave() {
		// A new Transition toward a new page has just started.
	},


	/**
	 * WhatImCurrentlyListeningTo.onLeaveCompleted
	 */
	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});

export default WhatImCurrentlyListeningTo;
