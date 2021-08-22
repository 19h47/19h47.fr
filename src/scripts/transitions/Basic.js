import Barba from 'vendors/barba.enhanced';

import gsap from 'gsap';


/**
 * Basic
 */
const Basic = Barba.BaseTransition.extend({

	/**
	 * Basic.start
	 */
	start() {
		// console.info('Basic.start');

		Promise
			.all([this.exit(), this.newContainerLoading])
			.then(this.enter.bind(this));
	},


	/**
	 * Basic.fade.out
	 */
	exit() {
		// console.info('Basic.fade.out');

		const deferred = Barba.Utils.deferred();

		gsap
			.fromTo(
				this.oldContainer,
				1,
				{
					opacity: 1,
				},
				{
					opacity: 0,
					onComplete: deferred.resolve,
				},
			);

		return deferred.promise;
	},


	/**
	 * Basic.fade.in
	 */
	enter() {
		// console.info('Basic.fade.in');
		const tl = gsap.timeline({
			callbackScope: this,
			onComplete: this.done,
		});

		tl
			.set(this.newContainer, { clearProps: 'opacity' })
			.set(this.oldContainer, { display: 'none' })
			.call(() => {
				// reset scroll position
				window.app.resetScroll(0, 0);
			})
			.fromTo(
				this.newContainer,
				1,
				{
					opacity: 0,
				},
				{
					opacity: 1,
				},
			);
	},
});

export default Basic;
