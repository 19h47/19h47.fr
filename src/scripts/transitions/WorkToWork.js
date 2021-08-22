import Barba from 'vendors/barba.enhanced';

import gsap from 'gsap';

import Basic from 'transitions/Basic';


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

		gsap
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

		const tl = gsap.timeline({
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
