module.exports = Navigation;

var $ = require('jquery');


/**
 * Navigation
 */
function Navigation() {

	// Get current url
	var currentUrl = window.location.href;

	var links = {
		all: document.querySelectorAll('.js-navigation'), 
		active: $('.js-navigation[href=\'' + currentUrl + '\']') || null
	};

	// Remove CSS class 'is-active' from all link
	Array.prototype.forEach.call(links.all, function(link) {

		link.classList.remove('is-active');
	}); 

	// Add CSS class 'is-active' from all active link
	$.each(links.active, function() {

		$(this).addClass('is-active');
	});
}