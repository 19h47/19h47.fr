import Barba from 'Vendors/barba.enhanced';

/**
 * Works
 */
export default Barba.BaseView.extend({

	namespace: 'works',


	/**
	 * Works.onEnter
	 */
	onEnter() {
		// The new Container is ready and attached to the DOM.
	},


	/**
	 * Works.onEnterCompleted
	 */
	onEnterCompleted() {
		// The Transition has just finished.
	},


	/**
	 * Works.onLeave description
	 */
	onLeave() {
		// A new Transition toward a new page has just started.
	},


	/**
	 * Works.onLeaveCompleted
	 */
	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});
