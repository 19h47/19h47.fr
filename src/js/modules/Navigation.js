/* global $ */
require('polyfill-nodelist-foreach');

/**
 * Navigation
 *
 */
export default function Navigation() {
	// Get current url
	const currentUrl = window.location.href;

	const links = {
		all: document.querySelectorAll('.js-navigation'),
		active: $(`.js-navigation[href='${currentUrl}']`) || null,
	};

	// Remove CSS class 'is-active' from all link
	links.all.forEach(link => {
		link.classList.remove('is-active');
	});

	// Add CSS class 'is-active' from all active link
	$.each(links.active, () => {
		$(this).addClass('is-active');
	});
}
