/**
 * Navigation
 */
export default function Navigation() {
	const currentUrl = window.location.href;
	const links = [
		...document.querySelectorAll<HTMLAnchorElement>('.js-navigation'),
	];

	links.forEach((link) => {
		link.classList.toggle('is-active', link.href === currentUrl);
	});
}
