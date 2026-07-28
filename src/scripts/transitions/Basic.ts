import gsap from 'gsap';

/**
 * Default fade transition.
 */
export default {
	name: 'basic',
	leave({ current }: { current: { container: HTMLElement } }) {
		return gsap.to(current.container, {
			opacity: 0,
			duration: 1,
		});
	},
	enter({ next }: { next: { container: HTMLElement } }) {
		window.app.resetScroll(0, 0);

		return gsap.fromTo(
			next.container,
			{ opacity: 0 },
			{ opacity: 1, duration: 1 },
		);
	},
};
