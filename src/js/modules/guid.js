module.exports = Guid;

var classes = require('dom-classes');
var select = require('dom-select');

/**
 * Guid
 */
function Guid() {
	if (!(this instanceof Guid)) {
		return new Guid();
	}

	// show/hide guides with CMD+;
	document.addEventListener('keydown',function(e) {

		(e.metaKey || e.ctrlKey) && e.keyCode === 186 && classes.toggle(select('.Guid'), 'display-xs-none');
	});
}
