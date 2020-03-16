/* global $ */

/**
 * Paint
 */
export default function Paint(canvas) {
	// console.info('Paint');

	// Feature
	// eslint-disable-next-line
	if (window.feature.matchMedia && window.matchMedia('(max-width: 992px)').matches) {
		return false;
	}

	if (!(this instanceof Paint)) {
		return new Paint();
	}

	// throw error
	if (!canvas || !canvas.length) {
		throw new Error('Missing selector.');
	}

	// get Canvas2D
	this.canvas = document.querySelector(canvas);
	this.context = this.canvas.getContext('2d');

	this.isDrawing = false;
	this.points = [];

	// pixel density, no higher than 2x for performance
	// @see https://github.com/Jam3/jam3-lesson-canvas2d
	this.pixelRatio = Math.min(2, window.devicePixelRatio);

	this.setup();
	return this.init.events.call(this);
}

Paint.prototype = {

	/**
	 * Paint.setup
	 */
	setup() {
		// console.info('Paint.setup');

		// Canvas
		this.canvas.width = Math.floor(window.innerWidth * this.pixelRatio);
		this.canvas.height = Math.floor(window.innerHeight * this.pixelRatio);

		this.context.scale(this.pixelRatio, this.pixelRatio);

		// Context
		this.context.lineWidth = 1;
		this.context.lineJoin = 'round';
		this.context.lineCap = 'round';
		this.context.strokeStyle = '#FFFFFF';

		// How many lines there will be on each side of the line.
		this.lineCount = 4;

		// Button
		this.$button = {
			instruction: $('.js-instruction'),
			save: $('.js-save'),
			clear: $('.js-clear'),
		};

		this.$button.instruction.addClass('is-active');

		this.draw();
	},


	/**
	 * Paint.reset
	 */
	reset() {
		this.$button.instruction.addClass('is-active');
	},


	/**
	 * Paint.resize
	 */
	resize() {
		this.reset();
		this.setup();
	},


	/**
	 * Paint.init
	 */
	init: {

		/**
		 * Paint.init.events
		 */
		events() {
			// listen for window resizing
			window.addEventListener('resize', $.proxy(this.resize, this));

			// save button
			this.$button.save.on('click.paint', e => {
				// get the current ImageData for the canvas.
				// var compositeOperation = this.context.globalCompositeOperation;

				// set to draw behind current content
				this.context.globalCompositeOperation = 'destination-over';

				// set background color
				this.context.fillStyle = '#000000';

				// draw background / rect on entire canvas
				this.context.fillRect(
					0,
					0,
					window.innerWidth,
					window.innerHeight,
				);

				// eslint-disable-next-line
				e.currentTarget.href = this.save(this.canvas);

				this.context.globalCompositeOperation = 'source-over';
			});

			// clear button
			this.$button.clear.on('click.paint', () => {
				this.clear(this.context);
				this.reset();
			});
		},
	},


	/**
	 * Paint.draw
	 */
	draw() {
		// console.info('Paint.draw');

		document.onmouseup = () => {
			this.isDrawing = false;
			this.points.length = 0;
		};


		document.onmousedown = e => {
			this.isDrawing = true;

			this.points.push({
				x: e.clientX,
				y: e.clientY,
			});

			this.$button.instruction.removeClass('is-active');
		};

		document.onmousemove = e => {
			if (!this.isDrawing) return;

			this.points.push({
				x: e.clientX,
				y: e.clientY,
			});

			for (let i = 0; i < (this.lineCount + 1) * this.lineCount; i += this.lineCount) {
				// After
				this.stroke(this.offsetPoints(i + this.lineCount));

				// Before
				this.stroke(this.offsetPoints((i + this.lineCount) * -1));
			}

			this.stroke(this.points);
		};
	},


	/**
	 * Paint.clear
	 *
	 * Clear a given context
	 *
	 * @param 	context
	 */
	clear(context) {
		return context.clearRect(
			0,
			0,
			context.canvas.width,
			context.canvas.height,
		);
	},


	/**
	 * Paint.save
	 */
	save(element) {
		return element.toDataURL('image/png');
	},


	/**
	 * Paint.stroke
	 */
	stroke(points) {
		let p1 = points[0];
		let p2 = points[1];

		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);

		points.forEach((point, index) => {
			// we pick the point between pi+1 & pi+2 as the
			// end point and p1 as our control point
			const midPoint = this.middlePointBetween(p1, p2);

			// https://www.w3schools.com/tags/canvas_quadraticcurveto.asp
			this.context.quadraticCurveTo(
				p1.x,
				p1.y,
				midPoint.x,
				midPoint.y,
			);

			p1 = points[index];
			p2 = points[index + 1];
		}, this);

		// Draw last line as a straight line while
		// we wait for the next point to be able to calculate
		// the bezier control point
		this.context.lineTo(p1.x, p1.y);
		this.context.stroke();
	},


	/**
	 * Paint.middlePointBetween
	 */
	middlePointBetween(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2,
		};
	},

	/**
	 * Paint.offsetPoints
	 */
	offsetPoints(val) {
		// console.info('Paint.offsetPoints');
		const offsetPoints = [];

		this.points.forEach(point => {
			offsetPoints.push({
				x: point.x + val,
				y: point.y + val,
			});
		});

		return offsetPoints;
	},
};
