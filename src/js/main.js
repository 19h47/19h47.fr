var $ = require('jquery');
var AOS = require('aos');
var Barba = require('barba.enhanced.js');

require('./vendors/randomize_text');

// Modules
var Modules = require('./modules/index.js');


// Transitions
var Transitions = require('./transitions/index');


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


/**
 * Animate on Scroll
 *
 * @see  https://github.com/michalsnik/aos
 */
// AOS.init();

// Barba
Barba.Dispatcher.on('initStateChange', function() {
	
	// add state to App to tell new page is loading
	window.app.addState('page--is-loading');
	
	// disable scroll between transitions
	window.app.disableScroll();
});


Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {    
	// Add namespace as class to body
	var bodyClass = $(newPageRawHTML).find('.barba-container').attr('data-namespace');

	$('body').attr('data-context', bodyClass || '');

	$('title').randomizeText({
		refreshRate: 1,
		timePerLetter: 25,
		maxRandomTries: 5,
	});

	Modules.Navigation();
});


Barba.Dispatcher.on('transitionCompleted', function() {

	// ensure scroll is enabled and reset it
	window.app.enableScroll(0);

	// remove previous state from App
	window.app.removeState('page--is-loading');

	$('.js-footer').addClass('is-active');
});


Barba.Pjax.getTransition = function() {
	// var previousStatus = Barba.Pjax.History.prevStatus();
	// var currentStatus = Barba.Pjax.History.currentStatus();

	return Transitions.Basic;
};


// Intialize Barba
Barba.Pjax.start();