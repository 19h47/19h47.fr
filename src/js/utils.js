/**
 * utils
 * @type {Object}
 */
let utils = {
	
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
	},

	/**
	 * @see  http://stackoverflow.com/a/28608829/5091221
	 */
	removeClassByPrefix: function(el, prefix) {
	    var regx = new RegExp('(?:^|\\s)' + prefix + '(?!\\S)');
	    el.className = el.className.replace(regx, '');

	    return el;
	}
}

export default utils