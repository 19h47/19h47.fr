var functions = {
	
	/**
	 * Get right transitionend event name regarding browser support.
	 * From Modernizr.
	 */
	whichTransitionEvent: function() {
		var transition;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		};

		for (transition in transitions) {
			if (el.style[transition] !== undefined) {
				return transitions[transition];
			}
		}
	}
};

module.exports = functions;