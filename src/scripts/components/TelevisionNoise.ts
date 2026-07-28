import { Piece } from '../lib/Piece';

/**
 * CRT noise canvas (404).
 *
 * @see http://codepen.io/alenaksu/pen/dGjeMZ
 *
 * Usage:
 *   <television-noise>
 *     <canvas class="fixed inset-0 h-full w-full opacity-60"></canvas>
 *   </television-noise>
 */
class TelevisionNoise extends Piece {
	#canvas: HTMLCanvasElement | null = null;
	#context: CanvasRenderingContext2D | null = null;
	#motion: MediaQueryList | null = null;
	#raf = 0;
	#resizeRaf = 0;
	#lastFrame = 0;
	#samples: HTMLCanvasElement[] = [];
	#sampleIndex = 0;
	#scanOffsetY = 0;
	#scanSize = 0;
	#scanline: HTMLCanvasElement | null = null;
	#scaleFactor = 3;
	#fps = 30;
	#sampleCount = 8;
	#frameInterval = 1000 / 30;

	constructor() {
		super('TelevisionNoise');
	}

	mount() {
		this.#canvas = this.queryOne<HTMLCanvasElement>('canvas');

		if (!this.#canvas) {
			return;
		}

		this.#context = this.#canvas.getContext('2d', {
			alpha: false,
			desynchronized: true,
		});
		this.#motion = window.matchMedia('(prefers-reduced-motion: reduce)');

		this.on('resize', window as unknown as HTMLElement, this.#scheduleResize);
		this.on(
			'visibilitychange',
			document as unknown as HTMLElement,
			this.#onVisibility,
		);
		this.#motion.addEventListener('change', this.#onMotionChange);

		this.#onResize();
		this.#start();
	}

	unmount() {
		this.off(
			'resize',
			window as unknown as HTMLElement,
			this.#scheduleResize,
		);
		this.off(
			'visibilitychange',
			document as unknown as HTMLElement,
			this.#onVisibility,
		);
		this.#motion?.removeEventListener('change', this.#onMotionChange);
		this.#stop();
		this.#motion = null;
	}

	#start() {
		if (this.#raf) {
			return;
		}

		if (this.#motion?.matches || document.hidden) {
			this.#paintStatic();
			return;
		}

		this.#lastFrame = 0;
		this.#raf = window.requestAnimationFrame(this.#render);
	}

	#stop() {
		if (this.#raf) {
			window.cancelAnimationFrame(this.#raf);
			this.#raf = 0;
		}

		if (this.#resizeRaf) {
			window.cancelAnimationFrame(this.#resizeRaf);
			this.#resizeRaf = 0;
		}
	}

	#onVisibility = () => {
		if (document.hidden) {
			this.#stop();
			return;
		}

		this.#start();
	};

	#onMotionChange = () => {
		this.#stop();
		this.#start();
	};

	#scheduleResize = () => {
		if (this.#resizeRaf) {
			return;
		}

		this.#resizeRaf = window.requestAnimationFrame(() => {
			this.#resizeRaf = 0;
			this.#onResize();
		});
	};

	#onResize = () => {
		if (!this.#canvas) {
			return;
		}

		const { offsetWidth: cssW, offsetHeight: cssH } = this.#canvas;

		if (!cssW || !cssH) {
			return;
		}

		const w = Math.max(1, Math.round(cssW / this.#scaleFactor));
		const h = Math.max(1, Math.round(cssH / this.#scaleFactor));

		this.#canvas.width = w;
		this.#canvas.height = h;
		this.#scanSize = Math.max(1, Math.round(h / 3));
		this.#frameInterval = 1000 / this.#fps;
		this.#samples = [];

		for (let i = 0; i < this.#sampleCount; i += 1) {
			this.#samples.push(this.#generateRandomSample(w, h));
		}

		this.#scanline = this.#createScanline(this.#scanSize);
		this.#paintStatic();
	};

	#paintStatic() {
		if (!this.#context || !this.#samples.length) {
			return;
		}

		this.#context.globalCompositeOperation = 'source-over';
		this.#context.drawImage(this.#samples[0], 0, 0);
	}

	#render = (now: number) => {
		this.#raf = 0;

		if (
			!this.#canvas ||
			!this.#context ||
			!this.#scanline ||
			!this.#samples.length ||
			document.hidden
		) {
			return;
		}

		if (now - this.#lastFrame < this.#frameInterval) {
			this.#raf = window.requestAnimationFrame(this.#render);
			return;
		}

		this.#lastFrame = now;

		const sample =
			this.#samples[this.#sampleIndex | 0] ?? this.#samples[0];

		this.#context.globalCompositeOperation = 'source-over';
		this.#context.drawImage(sample, 0, 0);

		this.#sampleIndex += 30 / this.#fps;

		if (this.#sampleIndex >= this.#samples.length) {
			this.#sampleIndex = 0;
		}

		this.#context.globalCompositeOperation = 'lighter';
		this.#context.drawImage(
			this.#scanline,
			0,
			this.#scanOffsetY,
			this.#canvas.width,
			this.#scanSize,
		);

		this.#scanOffsetY += this.#canvas.height / (this.#fps * 15);

		if (this.#scanOffsetY > this.#canvas.height) {
			this.#scanOffsetY = -(this.#scanSize / 2);
		}

		this.#raf = window.requestAnimationFrame(this.#render);
	};

	#createScanline(height: number) {
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = height;

		const ctx = canvas.getContext('2d');

		if (!ctx) {
			return canvas;
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, height);

		gradient.addColorStop(0, 'rgba(255,255,255,0)');
		gradient.addColorStop(0.1, 'rgba(255,255,255,0)');
		gradient.addColorStop(0.2, 'rgba(255,255,255,0.2)');
		gradient.addColorStop(0.3, 'rgba(255,255,255,0)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.1)');
		gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
		gradient.addColorStop(0.55, 'rgba(255,255,255,0.55)');
		gradient.addColorStop(0.6, 'rgba(255,255,255,0.25)');
		gradient.addColorStop(0.8, 'rgba(255,255,255,0.15)');
		gradient.addColorStop(1, 'rgba(255,255,255,0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 1, height);

		return canvas;
	}

	#generateRandomSample(w: number, h: number) {
		if (!this.#context) {
			return document.createElement('canvas');
		}

		const factor = h / 50;
		const intensity = new Float32Array(h);
		const intensityCurve = new Uint8Array((50 + factor + 1) | 0);

		for (let i = 0; i < intensityCurve.length; i += 1) {
			intensityCurve[i] = (Math.random() * 15) | 0;
		}

		for (let i = 0; i < h; i += 1) {
			const x = i / factor;
			const x0 = x | 0;

			intensity[i] =
				intensityCurve[x0] +
				(intensityCurve[x0 + 1] - intensityCurve[x0]) * (x - x0);
		}

		const imageData = this.#context.createImageData(w, h);
		const { data } = imageData;

		for (let j = 0, k = 0; j < w * h; j += 1, k += 4) {
			const color = ((36 * Math.random()) | 0) + intensity[(j / w) | 0];

			data[k] = color;
			data[k + 1] = color;
			data[k + 2] = color;
			data[k + 3] = 255;
		}

		const sample = document.createElement('canvas');
		sample.width = w;
		sample.height = h;
		sample.getContext('2d')?.putImageData(imageData, 0, 0);

		return sample;
	}
}

customElements.define('television-noise', TelevisionNoise);

export default TelevisionNoise;
