let Views = {

	WhatInspiresMe: require('./what-inspires-me'),
	WhatImCurrentlyListeningTo: require('./what-im-currently-listening-to'),
	NotFound: require('./404'),
	FrontPage: require('./front-page'),
	Works: require('./works'),

	// Generic page
	Page: require('./page'),
};

// Init each view
Object.keys(Views).map(function(key) {
	Views[key].init();
});


export default Views