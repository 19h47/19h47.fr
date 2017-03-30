var feature = require('feature.js');
var $ = require('jquery');
var App = require('./modules/app');
var Guid = require('./modules/guid')();
var Lastfm = require('./modules/lastfm');
var AOS = require('aos');
var Barba = require('barba.enhanced.js');
var randomizeText = require('./vendors/randomize_text');

// Transitions
var BasicTransition = require('./transitions/basic');


// Views
var WhatInspiresMe = require('./views/what-inspires-me');
var WhatICurrentlyListening = require('./views/what-i-currently-listening');


AOS.init();

// Create App
window.app = new App();


// Barba
Barba.Dispatcher.on('initStateChange', function(currentStatus) {
    
    // ensure menu is closed
    // nav.close();
    
    // add state to App to tell new page is loading
    window.app.addState('page--is-loading');
    
    // disable scroll between transitions
    window.app.disableScroll();
});


Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {    

	$('title').randomizeText({
		refreshRate: 1,
		timePerLetter: 25,
		maxRandomTries: 5,
	});

});


Barba.Dispatcher.on('transitionCompleted', function() {

	// ensure scroll is enabled and reset it
	window.app.enableScroll(0);

	// remove previous state from App
	window.app.removeState('page--is-loading');
});


Barba.Pjax.getTransition = function() {
    var previousStatus = Barba.Pjax.History.prevStatus();
    var currentStatus = Barba.Pjax.History.currentStatus();

    return BasicTransition;
};


// Intialize Barba
Barba.Pjax.start();