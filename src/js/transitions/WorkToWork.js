import Barba from 'Vendors/barba.enhanced';

import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';

import Basic from 'Transitions/Basic';


/**
 * WorkToWork
 */
const WorkToWork = Basic.extend({
	/**
	 * WorkToWork.start
	 */
	start() {
		// console.info('WorkToWork.start');

		Promise
			.all([this.newContainerLoading, this.exit()])
			.then(this.enter.bind(this));
	},


	/**
	 * WorkToWork.exit
	 */
	exit() {
		// console.info('WorkToWork.exit');

		const deferred = Barba.Utils.deferred();

		TweenLite
			.fromTo(
				this.oldContainer,
				1,
				{
					// opacity: 1,
				},
				{
					// opacity: 0,
					onComplete: deferred.resolve,
				},
			);

		return deferred.promise;
	},


	/**
	 * WorkToWork.enter
	 */
	enter() {
		// console.info('WorkToWork.enter');

		const tl = new TimelineLite({
			callbackScope: this,
			onComplete: this.done,
		});

		tl
			.set(this.newContainer, { clearProps: 'opacity' })
			.set(this.oldContainer, { display: 'none' })
			.set(this.newContainer, { opacity: 1 })
			.call(() => {
				// reset scroll position
				window.app.resetScroll(0, 0);
			});
	},
});

export default WorkToWork;
