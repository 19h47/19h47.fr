var $ = require('jquery');
var App = require('./modules/app');
var Guid = require('./modules/guid')();
var Lastfm = require('./modules/lastfm');
var Tumblr = require('./modules/tumblr');
var router = require('./router');

new Lastfm('.Lastfm');
new Tumblr('.Tumblr');

// create App
window.app = new App();