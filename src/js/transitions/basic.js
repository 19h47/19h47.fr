var $ = require('jquery');
var Barba = require('barba.enhanced.js');
var TweenMax = require('TweenMax');


/**
 * Basic
 */
var Basic = Barba.BaseTransition.extend({
	
	/**
	 * Basic.start
	 */
	start: function() {
		// console.info('Basic.start');

		Promise
			.all([this.exit(), this.newContainerLoading])
			.then(this.enter.bind(this));
	},


	/**
	 * Basic.fade.out
	 */
	exit: function() {
		// console.info('Basic.fade.out');

		var deferred = Barba.Utils.deferred();

		TweenLite.fromTo(
            this.oldContainer,
            1,
            {
                opacity: 1,
            },
            {
                opacity: 0,
                onComplete: deferred.resolve
            }
        );

        return deferred.promise;
	},


	/**
	 * Basic.fade.in
	 */
	enter: function() {
		// console.info('Basic.fade.in');

		var tl = new TimelineLite({
            callbackScope: this,
            onComplete: this.done
        });

        tl
            .set(this.newContainer, { clearProps: 'opacity, visibility' })
            .set(this.oldContainer, { display: 'none' })
            .call(function() {
                // reset scroll position
                window.app.resetScroll(0, 0);
            })
            .fromTo(
                this.newContainer,
                1,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                }
            );
	}
});

module.exports = Basic;