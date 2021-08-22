/* global $ */
import Barba from 'vendors/barba.enhanced';

// Modules
import App from 'modules/App';
import Navigation from 'modules/Navigation';
import Watchers from 'modules/Watchers';

// Transitions
import Basic from 'transitions/Basic';
import WorkToWork from 'transitions/WorkToWork';

// Views
import FrontPage from 'views/FrontPage';
import Page from 'views/Page';
import WhatInspiresMe from 'views/WhatInspiresMe';
import NotFound from 'views/NotFound';
import WhatImCurrentlyListeningTo from 'views/WhatImCurrentlyListeningTo';
import Work from 'views/Work';
import CurriculumVitae from 'views/CurriculumVitae';

FrontPage.init();
Page.init();
WhatInspiresMe.init();
NotFound.init();
WhatImCurrentlyListeningTo.init();
Work.init();
CurriculumVitae.init();

const classes = require('dom-classes');
const style = require('dom-style');
const config = require('./config');


// eslint-disable-next-line
console.log('%c🔥 Scooby doo wah, scooby doo wee, like a jazz player, I improvise wisely 🔥', 'background-color:#000;color:#fff;padding:0.5em 1em;');


// create App
window.app = new App();
// add state to App while current page is loading
window.app.addState('page--is-loading');

// Navigation
// eslint-disable-next-line
const navigation = new Navigation();


// Watchers
// eslint-disable-next-line
const watchers = new Watchers();


// Barba
Barba.Dispatcher.on('linkClicked', (HTMLElement, MouseEvent) => {
	// console.dir(HTMLElement);
	if ('work' !== HTMLElement.dataset.namespace) {
		config.transition.removeAttribute('style');
	}

	// We are going to a single work
	if (classes.contains(HTMLElement, 'js-to-work-single')) {
		// eslint-disable-next-line
		const color = MouseEvent.target.dataset.color;

		style(config.transition, 'background-color', color);
	}
});


Barba.Dispatcher.on('initStateChange', () => {
	// add state to App to tell new page is loading
	window.app.addState('page--is-loading');

	// disable scroll between transitions
	window.app.disableScroll();
});


Barba.Dispatcher.on('newPageReady', (currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) => {
	// Add namespace as class to body
	const bodyClass = $(newPageRawHTML).find('.barba-container').attr('data-namespace');

	document.body.dataset.context = bodyClass || '';

	const $navLink = $('.js-work-navigation');

	if ($navLink) {
		// eslint-disable-next-line
		$navLink.each(function () {
			// eslint-disable-next-line
			const color = this.dataset.color;

			this.addEventListener('mouseover', () => {
				// console.dir(HTMLElementContainer);
				// eslint-disable-next-line
				HTMLElementContainer.style.backgroundColor = color;

				style(config.transition, 'background-color', color);
			});

			this.addEventListener('mouseleave', () => {
				// eslint-disable-next-line
				HTMLElementContainer.style.backgroundColor = '';
			});

			// this.addEventListener('click', function() {});
		});
	}

	// eslint-disable-next-line
	new Navigation();
});

// eslint-disable-next-line
Barba.Dispatcher.on('transitionCompleted', function () {
	// ensure scroll is enabled and reset it
	window.app.enableScroll(0);

	// remove previous state from App
	window.app.removeState('page--is-loading');

	// $('.js-footer').addClass('is-active');
});

// eslint-disable-next-line
Barba.Pjax.getTransition = function () {
	const previousStatus = Barba.Pjax.History.prevStatus();
	const currentStatus = Barba.Pjax.History.currentStatus();

	if (!currentStatus.namespace) {
		// set future namespace before it's loaded
		Barba.Pjax.History.setCurrentNamespace();
	}

	if ('work' === previousStatus.namespace && 'work' === currentStatus.namespace) {
		return WorkToWork;
	}

	return Basic;
};


// Intialize Barba
Barba.Pjax.start();

// enable prefetching
Barba.Prefetch.init();
