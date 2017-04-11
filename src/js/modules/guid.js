module.exports = Guid;


var $ = require('jquery');

/**
 * Guid
 */
function Guid() {
	if (!(this instanceof Guid)) {
		return new Guid();
	}

	// show/hide guides with CMD+;
	$(document).on('keydown.guid',function(e) {

		(e.metaKey || e.ctrlKey) && e.keyCode === 186 && $('.Guid').toggleClass('display-xs-none');
	});
}
