import Barba from 'Vendors/barba.enhanced';
import Television from 'Modules/Television';

const classes = require('dom-classes');
const select = require('dom-select');

export default Barba.BaseView.extend({

	namespace: '404',


	/**
	 * NotFound.onEnter
	 */
	onEnter() {
		// The new Container is ready and attached to the DOM.
		// eslint-disable-next-line
		new Television('#television');
	},


	onEnterCompleted() {
		// The Transition has just finished.
		classes.add(select('.js-footer'), 'is-active');
	},

	onLeave() {
		// A new Transition toward a new page has just started.
	},


	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});
