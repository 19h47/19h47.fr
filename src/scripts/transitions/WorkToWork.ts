import gsap from 'gsap';

/**
 * Instant-ish transition between single work pages.
 */
export default {
	name: 'work-to-work',
	from: { namespace: ['work'] },
	to: { namespace: ['work'] },
	leave({ current }: { current: { container: HTMLElement } }) {
		return gsap.to(current.container, {
			duration: 1,
		});
	},
	enter({ next }: { next: { container: HTMLElement } }) {
		gsap.set(next.container, { clearProps: 'opacity', opacity: 1 });
		window.app.resetScroll(0, 0);
	},
};
