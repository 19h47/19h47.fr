/**
 * Reflect scroll edges on the document; footer reacts via CSS.
 */
export default class Watchers {
	ticking = false;

	constructor() {
		this.update();
		window.addEventListener('scroll', this.onScroll, { passive: true });
	}

	onScroll = () => {
		if (this.ticking) {
			return;
		}

		this.ticking = true;
		requestAnimationFrame(() => {
			this.update();
			this.ticking = false;
		});
	};

	update() {
		const { body } = document;
		const atTop = window.scrollY <= 0;
		const atBottom =
			window.scrollY + window.innerHeight >=
			document.documentElement.scrollHeight - 1;

		body.classList.toggle('is-at-top', atTop);
		body.classList.toggle('is-at-bottom', atBottom);
	}
}
