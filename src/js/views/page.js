import Barba from 'Vendors/barba.enhanced';

import Pages from 'Modules/Pages';

/**
 * Page
 */

export default Barba.BaseView.extend({

	namespace: 'page',

	/**
	 * Page.onEnter
	 */
	onEnter() {
		// The new Container is ready and attached to the DOM.
		// eslint-disable-next-line
		new Pages(
			this.container,
			{
				namespace: this.namespace,
			},
		);
	},


	onEnterCompleted() {
		// The Transition has just finished.

		// classes.remove(select('.js-footer'), 'is-active');
	},


	onLeave() {
		// A new Transition toward a new page has just started.
	},


	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});
