var $ = require('jquery');
var Barba = require('barba.enhanced.js');
/**
 * Basic
 */
var Basic = Barba.BaseTransition.extend({
	
	/**
	 * Basic.start
	 */
	start: function() {
		// console.info('Basic.start');

		// As soon the loading is finished and the old page is faded out, let's 
		// fade the new page
		Promise
			.all([this.newContainerLoading, this.fade.out()])
			.then(this.fade.in.bind(this));
	},


	/**
	 * Basic.fade
	 */
	fade: {

		/**
		 * Basic.fade.out
		 */
		out: function() {
			// console.info('Basic.fade.out');

			return $(this.oldContainer).animate({ opacity: 0 }, 800).promise();
		},


		/**
		 * Basic.fade.in
		 */
		in: function() {
			// console.info('Basic.fade.in');

			var _this = this;
			var $el = $(this.newContainer);

			window.app.resetScroll(0, 0);
			
			$(this.oldContainer).hide();

			$el.css({
				visibility : 'visible',
				opacity : 0
			});

			$el.animate({ opacity: 1 }, 800, function() {

				_this.done();
			});
		}
	}
});

module.exports = Basic;