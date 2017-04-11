var $ = require('jquery');
var Barba = require('barba.enhanced.js');

var Basic = Barba.BaseTransition.extend({
	
	start: function() {

		// As soon the loading is finished and the old page is faded out, let's fade the new page
		Promise
			.all([this.newContainerLoading, this.fadeOut()])
			.then(this.fadeIn.bind(this));
	},


	fadeOut: function() {

		return $(this.oldContainer).animate({ opacity: 0 }).promise();
	},

	
	fadeIn: function() {

		var _this = this;
		var $el = $(this.newContainer);

		window.app.resetScroll(0, 0);
		
		$(this.oldContainer).hide();

		$el.css({
			visibility : 'visible',
			opacity : 0
		});

		$el.animate({ opacity: 1 }, 400, function() {

			_this.done();
		});
	}
});

module.exports = Basic;