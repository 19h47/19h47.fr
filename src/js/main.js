var $ = require('jquery');
var Barba = require('barba.enhanced.js');
var select = require('dom-select');
var classes = require('dom-classes');
var style = require('dom-style');
var config = require('./config');
// var singleRandomText = require('./vendors/randomize_text');

// Modules
var Modules = require('./modules/index.js');


// Transitions
var Transitions = require('./transitions/index');

console.log('%c🔥 Scooby doo wah, scooby doo wee, like a jazz player, I improvise wisely 🔥', 'background-color:#000;color:#fff;padding:0.5em 1em;' );

// Views
require('./views/index');

// create App
window.app = new Modules.App();
// add state to App while current page is loading
window.app.addState('page--is-loading');

// Navigation
Modules.Navigation();

// Watchers
Modules.Watchers();


// Barba
Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {
	// console.dir(HTMLElement);
	if (HTMLElement.dataset.namespace != 'work') {
		config.transition.removeAttribute('style');
	};
	
	// We are going to a single work
	if (classes.contains(HTMLElement, 'js-to-work-single')) {

		var color = MouseEvent.target.dataset.color;

		style(config.transition, 'background-color', color);
	}
});


Barba.Dispatcher.on('initStateChange', function() {
	
	// add state to App to tell new page is loading
	window.app.addState('page--is-loading');

	
	// disable scroll between transitions
	window.app.disableScroll();
});


Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {    
	// Add namespace as class to body
	var bodyClass = $(newPageRawHTML).find('.barba-container').attr('data-namespace');

	select('body').dataset.context = bodyClass || '';


	var $navLink = $('.js-work-navigation');


	if ($navLink) {

		$navLink.each(function(index) {

			var color = this.dataset.color;

			this.addEventListener('mouseover', function() {

				// console.dir(HTMLElementContainer);

				HTMLElementContainer.style.backgroundColor = color;

				style(config.transition, 'background-color', color);
			});

			this.addEventListener('mouseleave', function() {

				HTMLElementContainer.style.backgroundColor = '';
			});

			// this.addEventListener('click', function() {});
		});
	}

	// $('title').randomizeText({
	// 	refreshRate: 1,
	// 	timePerLetter: 25,
	// 	maxRandomTries: 5,
	// });

	Modules.Navigation();
});


Barba.Dispatcher.on('transitionCompleted', function() {

	// ensure scroll is enabled and reset it
	window.app.enableScroll(0);

	// remove previous state from App
	window.app.removeState('page--is-loading');

	// $('.js-footer').addClass('is-active');
});


Barba.Pjax.getTransition = function() {
	var previousStatus = Barba.Pjax.History.prevStatus();
	var currentStatus = Barba.Pjax.History.currentStatus();

	if (!currentStatus.namespace) {
        // set future namespace before it's loaded
        Barba.Pjax.History.setCurrentNamespace();
    }

	if (previousStatus.namespace === 'work' && currentStatus.namespace === 'work') {

	    return Transitions.WorkToWork;
    }

	return Transitions.Basic;
};


// Intialize Barba
Barba.Pjax.start();

// enable prefetching
Barba.Prefetch.init();