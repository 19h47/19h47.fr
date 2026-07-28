/**
 * App
 */
export default class App {
	#scroll = { left: 0, top: 0 };

	#preventTouchMove = (e: TouchEvent) => {
		e.preventDefault();
	};

	get #isTouch() {
		return document.documentElement.classList.contains('touch');
	}

	disableScroll() {
		this.#scroll.left =
			document.documentElement.scrollLeft || document.body.scrollLeft;
		this.#scroll.top =
			document.documentElement.scrollTop || document.body.scrollTop;

		document.documentElement.style.overflow = 'hidden';

		this.resetScroll(this.#scroll.left, this.#scroll.top);

		if (this.#isTouch) {
			document.addEventListener('touchmove', this.#preventTouchMove, {
				passive: false,
			});
		}
	}

	enableScroll(position?: number | boolean) {
		let nextPosition: number | boolean | undefined = position;

		if (typeof nextPosition === 'undefined') {
			nextPosition = this.#scroll.top;
		}

		const resumeScroll = !(typeof nextPosition === 'boolean' && !nextPosition);

		document.documentElement.style.overflow = 'visible';

		if (resumeScroll) {
			this.resetScroll(this.#scroll.left, nextPosition as number);
		}

		if (this.#isTouch) {
			document.removeEventListener('touchmove', this.#preventTouchMove);
		}
	}

	resetScroll(positionX?: number | string, positionY?: number | string) {
		if (typeof positionX !== 'undefined') {
			this.#scroll.left = parseInt(String(positionX), 10);
		}

		if (typeof positionY !== 'undefined') {
			this.#scroll.top = parseInt(String(positionY), 10);
		}

		window.scrollTo(this.#scroll.left, this.#scroll.top);
	}

	addState(state: string) {
		document.body.classList.add(state);
	}

	removeState(state: string) {
		document.body.classList.remove(state);

		return Promise.resolve();
	}
}
