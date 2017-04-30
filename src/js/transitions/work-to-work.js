var Barba = require('barba.enhanced.js');
var Basic = require('./basic');
var TweenMax = require('TweenMax');


/**
 * WorkToWork
 */
var WorkToWork = Basic.extend({
	
	/**
	 * WorkToWork.start
	 */
	start: function() {
		// console.info('WorkToWork.start');

		Promise
			.all([this.newContainerLoading, this.exit()])
			.then()
			.then(this.enter.bind(this));
	},


	/**
	 * WorkToWork.exit
	 */
	exit: function() {
		// console.info('WorkToWork.exit');

		var deferred = Barba.Utils.deferred();
		
		TweenLite
			.fromTo(
	            this.oldContainer,
	            1,
	            {
	                // opacity: 1,
	            },
	            {
	                // opacity: 0,
	                onComplete: deferred.resolve
	            }
	        );



        return deferred.promise;
	},


	/**
	 * WorkToWork.enter
	 */
	enter: function() {
		// console.info('WorkToWork.enter');
		
		var tl = new TimelineLite({
		    callbackScope: this,
		    onComplete: this.done
		});

		tl
		    .set(this.newContainer, { clearProps: 'opacity' })
		    .set(this.oldContainer, { display: 'none' })
		    .set(this.newContainer, { opacity: 1 })
		    .call(function() {
		        // reset scroll position
		        window.app.resetScroll(0, 0);
		    });
	}
});

module.exports = WorkToWork;