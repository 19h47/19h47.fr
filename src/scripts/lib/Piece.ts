import { Piece as BasePiece } from 'piecesjs';

/**
 * Piece with a typed single-element query.
 */
export class Piece extends BasePiece {
	protected queryOne<T extends Element>(selector: string): T | null {
		const result = this.$(selector);

		if (!result || result instanceof NodeList) {
			return null;
		}

		return result as T;
	}
}
