import { Piece } from '../lib/Piece';

/**
 * External control for <black-board>.
 *
 * Usage:
 *   <black-board-button action="clear">
 *     <button type="button">Clear</button>
 *   </black-board-button>
 *
 *   <black-board-button action="save">
 *     <a href="#">Save</a>
 *   </black-board-button>
 */
class BlackBoardButton extends Piece {
	#control: HTMLElement | null = null;

	constructor() {
		super('BlackBoardButton');
	}

	mount() {
		// Bind the real control — not this host. `display: contents` on the
		// custom element makes host listeners unreliable across browsers.
		this.#control = this.queryOne<HTMLElement>('a, button');

		if (!this.#control) {
			return;
		}

		this.on('click', this.#control, this.#onClick);
	}

	unmount() {
		if (this.#control) {
			this.off('click', this.#control, this.#onClick);
		}

		this.#control = null;
	}

	#onClick = (e: Event) => {
		const action = this.getAttribute('action');

		if (!action) {
			return;
		}

		if (action === 'clear') {
			this.call('clear', null, 'BlackBoard');
			return;
		}

		if (action !== 'save') {
			return;
		}

		e.preventDefault();

		const url = this.call('save', null, 'BlackBoard') as string | null;

		if (!url) {
			return;
		}

		const link = document.createElement('a');
		link.href = url;
		link.download = '19h47.png';
		link.rel = 'noopener';
		document.body.appendChild(link);
		link.click();
		link.remove();
	};
}

customElements.define('black-board-button', BlackBoardButton);

export default BlackBoardButton;
