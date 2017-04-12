var Modules = {

	App: require('./app'),
	Guid: require('./guid')(),
	Lastfm: require('./lastfm'),
	Tumblr: require('./tumblr'),
	Watchers: require('./watchers'),
	Navigation: require('./navigation'),
	Paint: require('./paint'),
	Television: require('./television'),
	Pages: require('./pages')
};

module.exports = Modules;