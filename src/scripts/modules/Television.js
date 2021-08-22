/**
 * Television
 * @see 	http://codepen.io/alenaksu/pen/dGjeMZ
 */
function Television(element) {
	if (!(this instanceof Television)) {
		return new Television();
	}

	this.element = element;

	if (!this.element) {
		throw new Error('Missing selector.');
	}

	this.setup();
}

Television.prototype = {

	/**
	 * Television.setup
	 */
	setup() {
		const self = this;

		this.canvas = document.querySelector(this.element);

		const context = this.canvas.getContext('2d');
		const scaleFactor = 2.5; // Noise size
		let samples = [];
		let sampleIndex = 0;
		let scanOffsetY = 0;
		let scanSize = 0;
		const FPS = 50;
		const scanSpeed = FPS * 15; // 15 seconds from top to bottom
		const SAMPLE_COUNT = 10;

		function generateRandomSample(w, h) {
			const intensity = [];
			const intensityCurve = [];
			// var random = 0;
			const factor = h / 50;

			for (let i = 0; i < Math.floor(h / factor) + factor; i += 1) {
				intensityCurve.push(Math.floor(Math.random() * 15));
			}

			for (let i = 0; i < h; i += 1) {
				const value = self.interpolate(
					i / factor,
					Math.floor(i / factor),
					intensityCurve[Math.floor(i / factor)],
					Math.floor(i / factor) + 1,
					intensityCurve[Math.floor(i / factor) + 1],
				);

				intensity.push(value);
			}

			const imageData = context.createImageData(w, h);

			for (let j = 0; j < (w * h); j += 1) {
				const k = j * 4;
				let color = Math.floor(36 * Math.random());

				// Optional: add an intensity curve to try to simulate scan lines
				color += intensity[Math.floor(j / w)];
				// eslint-disable-next-line
				imageData.data[k] = imageData.data[k + 1] = imageData.data[k + 2] = color;
				imageData.data[k + 3] = 255;
			}
			return imageData;
		}

		window.onresize = () => {
			self.canvas.width = self.canvas.offsetWidth / scaleFactor;
			self.canvas.height = self.canvas.width / (self.canvas.offsetWidth / self.canvas.offsetHeight);
			scanSize = (self.canvas.offsetHeight / scaleFactor) / 3;

			samples = [];

			for (let i = 0; i < SAMPLE_COUNT; i += 1) {
				samples.push(generateRandomSample(self.canvas.width, self.canvas.height));
			}
		};

		function render() {
			context.putImageData(
				samples[Math.floor(sampleIndex)],
				0,
				0,
			);

			sampleIndex += 30 / FPS; // 1/FPS == 1 second

			if (sampleIndex >= samples.length) sampleIndex = 0;

			const gradient = context.createLinearGradient(0, scanOffsetY, 0, scanSize + scanOffsetY);

			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.1, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.2, 'rgba(255,255,255,0.2)');
			gradient.addColorStop(0.3, 'rgba(255,255,255,0.0)');
			gradient.addColorStop(0.45, 'rgba(255,255,255,0.1)');
			gradient.addColorStop(0.5, 'rgba(255,255,255,1.0)');
			gradient.addColorStop(0.55, 'rgba(255,255,255,0.55)');
			gradient.addColorStop(0.6, 'rgba(255,255,255,0.25)');
			gradient.addColorStop(0.8, 'rgba(255,255,255,0.15)');
			gradient.addColorStop(1, 'rgba(255,255,255,0)');

			context.fillStyle = gradient;
			context.fillRect(0, scanOffsetY, self.canvas.width, scanSize + scanOffsetY);
			context.globalCompositeOperation = 'lighter';

			scanOffsetY += (self.canvas.height / scanSpeed);

			if (scanOffsetY > self.canvas.height) scanOffsetY = -(scanSize / 2);

			window.setTimeout(() => {
				window.requestAnimationFrame(render);
			}, 1000 / FPS);
		}
		window.onresize();

		window.requestAnimationFrame(render);
	},


	interpolate(x, x0, y0, x1, y1) {
		return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
	},
};

module.exports = Television;
