import { Piece } from '../lib/Piece';

type Point = { x: number; y: number };

/**
 * School blackboard — click-drag-draw canvas.
 *
 * Usage:
 *   <black-board empty>
 *     <canvas class="fixed inset-0 z-[1] h-full w-full"></canvas>
 *   </black-board>
 *
 * Commands via PiecesJS:
 *   this.call('clear', null, 'BlackBoard')
 *   this.call('save', null, 'BlackBoard') → PNG data URL
 */
class BlackBoard extends Piece {
	#canvas: HTMLCanvasElement | null = null;
	#context: CanvasRenderingContext2D | null = null;
	#isDrawing = false;
	#points: Point[] = [];
	#lineCount = 4;
	#pixelRatio = 1;

	constructor() {
		super('BlackBoard');
	}

	mount() {
		this.#canvas = this.queryOne<HTMLCanvasElement>('canvas');

		if (!this.#canvas) {
			return;
		}

		// Match front-page wrapper visibility (`hidden md:block` → 768px).
		if (window.matchMedia('(max-width: 767px)').matches) {
			return;
		}

		this.#context = this.#canvas.getContext('2d');
		this.#pixelRatio = Math.min(2, window.devicePixelRatio);
		this.#setup();
		this.toggleAttribute('empty', true);

		this.on('resize', window as unknown as HTMLElement, this.#onResize);
		this.on('pointerup', document as unknown as HTMLElement, this.#onPointerUp);
		this.on(
			'pointerdown',
			document as unknown as HTMLElement,
			this.#onPointerDown,
		);
		this.on(
			'pointermove',
			document as unknown as HTMLElement,
			this.#onPointerMove,
		);
	}

	unmount() {
		this.off('resize', window as unknown as HTMLElement, this.#onResize);
		this.off(
			'pointerup',
			document as unknown as HTMLElement,
			this.#onPointerUp,
		);
		this.off(
			'pointerdown',
			document as unknown as HTMLElement,
			this.#onPointerDown,
		);
		this.off(
			'pointermove',
			document as unknown as HTMLElement,
			this.#onPointerMove,
		);

		this.#isDrawing = false;
		this.#points = [];
	}

	clear() {
		if (!this.#context) {
			return;
		}

		this.#context.clearRect(
			0,
			0,
			this.#context.canvas.width,
			this.#context.canvas.height,
		);
		this.toggleAttribute('empty', true);
	}

	save(): string | null {
		if (!this.#context || !this.#canvas) {
			return null;
		}

		this.#context.globalCompositeOperation = 'destination-over';
		this.#context.fillStyle = '#000000';
		this.#context.fillRect(0, 0, window.innerWidth, window.innerHeight);

		const url = this.#canvas.toDataURL('image/png');

		this.#context.globalCompositeOperation = 'source-over';

		return url;
	}

	#setup = () => {
		if (!this.#canvas || !this.#context) {
			return;
		}

		this.#canvas.width = Math.floor(window.innerWidth * this.#pixelRatio);
		this.#canvas.height = Math.floor(window.innerHeight * this.#pixelRatio);
		this.#context.setTransform(1, 0, 0, 1, 0, 0);
		this.#context.scale(this.#pixelRatio, this.#pixelRatio);
		this.#context.lineWidth = 1;
		this.#context.lineJoin = 'round';
		this.#context.lineCap = 'round';
		this.#context.strokeStyle = '#FFFFFF';
	};

	#onResize = () => {
		this.#setup();
		this.toggleAttribute('empty', true);
	};

	#onPointerUp = () => {
		this.#isDrawing = false;
		this.#points.length = 0;
	};

	#onPointerDown = (e: PointerEvent) => {
		if (e.button != null && e.button !== 0) {
			return;
		}

		this.#isDrawing = true;
		this.#points.push({ x: e.clientX, y: e.clientY });
		this.toggleAttribute('empty', false);
	};

	#onPointerMove = (e: PointerEvent) => {
		if (!this.#isDrawing) {
			return;
		}

		this.#points.push({ x: e.clientX, y: e.clientY });

		for (
			let i = 0;
			i < (this.#lineCount + 1) * this.#lineCount;
			i += this.#lineCount
		) {
			this.#stroke(this.#offsetPoints(i + this.#lineCount));
			this.#stroke(this.#offsetPoints((i + this.#lineCount) * -1));
		}

		this.#stroke(this.#points);
	};

	#stroke(points: Point[]) {
		if (!this.#context || points.length < 2) {
			return;
		}

		let p1 = points[0];
		let p2 = points[1];

		this.#context.beginPath();
		this.#context.moveTo(p1.x, p1.y);

		for (let index = 0; index < points.length; index += 1) {
			const midPoint = {
				x: p1.x + (p2.x - p1.x) / 2,
				y: p1.y + (p2.y - p1.y) / 2,
			};

			this.#context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[index];
			p2 = points[index + 1] || p1;
		}

		this.#context.lineTo(p1.x, p1.y);
		this.#context.stroke();
	}

	#offsetPoints(val: number) {
		return this.#points.map((point) => ({
			x: point.x + val,
			y: point.y + val,
		}));
	}
}

customElements.define('black-board', BlackBoard);

export default BlackBoard;
