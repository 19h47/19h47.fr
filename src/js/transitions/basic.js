var $ = require('jquery');
var Barba = require('barba.enhanced.js');


var BasicTransition = Barba.BaseTransition.extend({
    
	/**
	 * BasicTransition.start
	 */
    start: function() {

        this.newContainerLoading
        	.then(this.finish.bind(this));
      },


    /**
     * BasicTransition.finish
     */
	finish: function() {

		document.body.scrollTop = 0;
		
		this.done();
	}
});

module.exports = BasicTransition;