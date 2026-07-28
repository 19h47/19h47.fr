/**
 * Single work — prev/next hover tints the page + transition overlay.
 */
export default {
	namespace: 'work',

	afterEnter({ next }: { next: { container: HTMLElement } }) {
		const { container } = next;
		const transition = document.querySelector<HTMLElement>('.js-transition');

		container
			.querySelectorAll<HTMLElement>('.js-work-navigation')
			.forEach((link) => {
				const { color } = link.dataset;

				link.addEventListener('pointerenter', () => {
					container.style.backgroundColor = color || '';
					if (transition) {
						transition.style.backgroundColor = color || '';
					}
				});

				link.addEventListener('pointerleave', () => {
					container.style.backgroundColor = '';
				});
			});
	},
};
