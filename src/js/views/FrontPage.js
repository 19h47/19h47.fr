import Paint from 'Modules/Paint';

import Barba from 'Vendors/barba.enhanced';

export default Barba.BaseView.extend({

	namespace: 'front-page',

	/**
	 * FrontPage.onEnter
	 */
	onEnter() {
		// console.info('FrontPage.onEnter');
		// The new Container is ready and attached to the DOM.
		// eslint-disable-next-line
		new Paint('#canvas');
	},
});
