var $ = require('jquery');
var App = require('./modules/app');
var Guid = require('./modules/guid')();
var Lastfm = require('./modules/lastfm');

new Lastfm('.Lastfm');

// create App
window.app = new App();