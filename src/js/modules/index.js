var Modules = {

	App: require('./app'),
	Guid: require('./guid')(),
	Lastfm: require('./lastfm'),
	Tumblr: require('./tumblr'),
	Footer: require('./footer'),
	Menu: require('./menu'),
	Navigation: require('./navigation'),
	Paint: require('./paint'),
	Television: require('./television'),
	Pages: require('./pages')
};

module.exports = Modules;