import Barba from 'vendors/barba.enhanced';

/**
 * Work
 */
export default Barba.BaseView.extend({

	namespace: 'work',


	/**
	 * Work.onEnter
	 */
	onEnter() {
		// The new Container is ready and attached to the DOM.
	},


	/**
	 * Work.onEnterCompleted
	 */
	onEnterCompleted() {
		// The Transition has just finished.
	},


	/**
	 * Work.onLeave description
	 */
	onLeave() {
		// A new Transition toward a new page has just started.
	},


	/**
	 * Work.onLeaveCompleted
	 */
	onLeaveCompleted() {
		// The Container has just been removed from the DOM.
	},
});
