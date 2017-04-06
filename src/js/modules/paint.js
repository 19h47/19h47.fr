module.exports = Paint;

function Paint(canvas) {
 	if (!(this instanceof Paint)) {
    	return new Paint();
	}
	console.info('Paint');

	if (!canvas || !canvas.length) {
		throw new Error('Missing selector.');
	}

	// get Canvas2D
	this.canvas = document.querySelector(canvas);
	this.context = this.canvas.getContext('2d');

	this.isDrawing = false;
	this.points = [];

	$('.js-instruction').addClass('is-active');

	
    this.setup();
    this.init.events.call(this);
}

Paint.prototype = {
	
	/**
	 * Paint.setup
	 */
	setup: function() {
		
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.context.lineWidth = 1;
		this.context.lineJoin = 'round';
		this.context.lineCap = 'round';
		this.context.strokeStyle = '#FFFFFF';

		this.$button = {
			instruction: $('.js-instruction'),
			save: $('.js-save'),
			clear: $('.js-clear'),
		}

		this.draw();
	},


	/**
	 * Paint.reset
	 */
	reset: function() {

		this.$button.instruction.addClass('is-active');	
	},


	resize: function() {
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
		events: function() {
			var _this = this;

			// listen for window resizing
			window.addEventListener('resize', $.proxy(this.resize, this));

			// save button
			this.$button.save.on('click', function () {
				
				// get the current ImageData for the canvas.
				var compositeOperation = _this.context.globalCompositeOperation;

		        // set to draw behind current content
		        _this.context.globalCompositeOperation = 'destination-over';

		        // set background color
		        _this.context.fillStyle = '#000000';

		        // draw background / rect on entire canvas
		        _this.context.fillRect(
		        	0,
		        	0, 
		        	window.innerWidth,
		        	window.innerHeight
		        );
			    
			    this.href = _this.save(_this.canvas);
			});

			// clear button
			this.$button.clear.on('click', function () {
			    
			    _this.clear(_this.context);
			    _this.reset();
			});
		}
	},


	/**
	 * Paint.draw
	 */
	draw: function() {
		console.info('Paint.draw');
		
		var _this = this;

		this.canvas.onmouseup = function() {
		  	_this.isDrawing = false;
		  	_this.points.length = 0;
		};


		this.canvas.onmousedown = function(e) {
		  	_this.isDrawing = true;

		  	_this.points.push({ 
		  		x: e.clientX, 
		  		y: e.clientY 
		  	});

		  	_this.$button.instruction.removeClass('is-active');
		};

		this.canvas.onmousemove = function(e) {
		  	if (!_this.isDrawing) return;
		  
		  	_this.points.push({ 
		  		x: e.clientX, 
		  		y: e.clientY 
		  	});
		  
		  	// _this.clear(_this.context);
   
		  	_this.stroke(_this.offsetPoints(-16));
		  	_this.stroke(_this.offsetPoints(-12));
		  	_this.stroke(_this.offsetPoints(-8));
		  	_this.stroke(_this.offsetPoints(-4));
		  	_this.stroke(_this.points);
		  	_this.stroke(_this.offsetPoints(4));
		  	_this.stroke(_this.offsetPoints(8));
		  	_this.stroke(_this.offsetPoints(12));
		  	_this.stroke(_this.offsetPoints(16));
		};
	},


	/**
	 * Paint.midPointBtw
	 */
	midPointBtw: function (p1, p2) {
	  	return {
	    	x: p1.x + (p2.x - p1.x) / 2,
	    	y: p1.y + (p2.y - p1.y) / 2
	  	};
	},


	/**
	 * Paint.clear
	 *
	 * Clear canvas for a given context
	 */
	clear: function(element) {
		return element.clearRect(
			0, 
			0, 
			this.context.canvas.width, 
			this.context.canvas.height
		);
	},


	save: function(element) {
		return dataURL = element.toDataURL('image/png');
	},

	stroke: function(points) {
	  	var _this = this;
	  	var p1 = points[0];
	  	var p2 = points[1];
	  
		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);

		for (var i = 1, len = points.length; i < len; i++) {
			// we pick the point between pi+1 & pi+2 as the
			// end point and p1 as our control point
			var midPoint = _this.midPointBtw(p1, p2);
			_this.context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i+1];
		}

		// Draw last line as a straight line while
		// we wait for the next point to be able to calculate
		// the bezier control point
		this.context.lineTo(p1.x, p1.y);
		this.context.stroke();
	},


	/**
	 * Paint.offsetPoints
	 */
	offsetPoints: function(val) {
		// console.info('Paint.offsetPoints');

	  	var _this = this;
	  	var offsetPoints = [];


	  	for (var i = 0; i < _this.points.length; i++) {
	    	offsetPoints.push({ 
	      		x: _this.points[i].x + val,
	      		y: _this.points[i].y + val
	    	});
	  	}
	  	return offsetPoints;
	}
};