const classes = require('dom-classes');
const select = require('dom-select');

/**
 * Guid
 */
export default function () {
	// show/hide guides with CMD+;
	document.addEventListener('keydown', (e) => {
		// eslint-disable-next-line
		(e.metaKey || e.ctrlKey) && e.keyCode === 186 && classes.toggle(select('.Guid'), 'display-xs-none');
	});
}
