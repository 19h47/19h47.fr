import { Piece as BasePiece, type PieceOptions } from 'piecesjs';

/**
 * Preserves light DOM under Barba container swaps.
 *
 * PiecesJS clears children when `baseHTML` is unset. That happens when an
 * already-defined custom element is constructed during HTML parse (empty)
 * before its children are attached — common after Barba transitions.
 */
export class Piece extends BasePiece {
	constructor(name?: string, options?: PieceOptions) {
		super(name, options);

		if (this.baseHTML == null) {
			this.baseHTML = '';
		}
	}

	protected queryOne<T extends Element>(selector: string): T | null {
		const result = this.$(selector);

		if (!result || result instanceof NodeList) {
			return null;
		}

		return result as T;
	}
}
