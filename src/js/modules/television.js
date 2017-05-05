// http://codepen.io/alenaksu/pen/dGjeMZ

module.exports = Television;


/**
 * Television
 *
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
	setup: function() {

		var self = this;

		this.canvas = document.querySelector(this.element);
		
		var context = this.canvas.getContext('2d');
		var scaleFactor = 2.5; // Noise size
		var samples = [];
		var sampleIndex = 0;
		var scanOffsetY = 0;
		var scanSize = 0;
		var FPS = 50;
		var scanSpeed = FPS * 15; // 15 seconds from top to bottom
		var SAMPLE_COUNT = 10;

		window.onresize = function() {

			self.canvas.width = self.canvas.offsetWidth / scaleFactor;
			self.canvas.height = self.canvas.width / (self.canvas.offsetWidth / self.canvas.offsetHeight);
			scanSize = (self.canvas.offsetHeight / scaleFactor) / 3;

			samples = [];

			for(var i = 0; i < SAMPLE_COUNT; i++) {
				samples.push(generateRandomSample(context, self.canvas.width, self.canvas.height));
			}
		};

		function generateRandomSample(context, w, h) {	
			var intensity = [];
			var intensityCurve = [];
			// var random = 0;
			var factor = h / 50;
			var i;

			for (i = 0; i < Math.floor(h / factor) + factor; i++) {
				
				intensityCurve.push(Math.floor(Math.random() * 15));
			}

			for (i = 0; i < h; i++) {
				
				var value = self.interpolate(
					i/factor, 
					Math.floor(i / factor), 
					intensityCurve[Math.floor(i / factor)], 
					Math.floor(i / factor) + 1, 
					intensityCurve[Math.floor(i / factor) + 1]
				);
				
				intensity.push(value);
			}

			var imageData = context.createImageData(w, h);

			for(i = 0; i < (w * h); i++) {
				var k = i * 4;
				var color = Math.floor(36 * Math.random());
				// Optional: add an intensity curve to try to simulate scan lines
				color += intensity[Math.floor(i / w)];
				imageData.data[k] = imageData.data[k + 1] = imageData.data[k + 2] = color;
				imageData.data[k + 3] = 255;
			}
			return imageData;
		} 

		function render() {
			
			context.putImageData(
				samples[Math.floor(sampleIndex)], 
				0, 
				0
			);

			sampleIndex += 30 / FPS; // 1/FPS == 1 second
			
			if (sampleIndex >= samples.length) sampleIndex = 0;

			var gradient = context.createLinearGradient(0, scanOffsetY, 0, scanSize + scanOffsetY);

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

			window.setTimeout(function() {
				window.requestAnimationFrame(render);
			}, 1000 / FPS);
		}
		window.onresize();

		window.requestAnimationFrame(render);
	},


	interpolate: function(x, x0, y0, x1, y1) {
		return y0 + (y1 - y0)*((x - x0)/(x1 - x0));
	}
};
