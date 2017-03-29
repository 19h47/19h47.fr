module.exports = Tumblr;

var $ = require('jquery');
var fn = require('../functions.js');


function Tumblr(element) {
 	if (!(this instanceof Tumblr)) {
    	return new Tumblr();
	}

	$element = $(element);

	if (!$element || !$element.length) {
		return;
	}

	this.setup();
}

Tumblr.prototype = {


	/**
	 * Tumblr.setup
	 */
	setup: function() {

		this.posts = {
			offset: 0,
			per_page: 20,
			count: null
		}
		
		var KEY = 'T1ta3DzmFPU36KjYWsoJcvjl8kSPybrqagZsRp8sXWpUIlxQ98';

		this.API = {
			KEY: KEY,
			URL: {
				info: 'http://api.tumblr.com/v2/blog/19h47.tumblr.com/info?api_key=' + KEY,
				posts: 'http://api.tumblr.com/v2/blog/19h47.tumblr.com/posts?api_key=' + KEY,
			}
		}
		
		this.$response = $element;

		this.showmore();
		this.initEvents();
	},


	/**
	 * Tumblr.initEvents
	 */
	initEvents: function() {
		this.$response.find('.load-more')
			.on('click.tumblr', $.proxy(function() {
				this.showmore();

			}, this));
	},


	/**
	 * Tumblr.showmore
	 */
	showmore: function() {
		this.loadmore()
			.then($.proxy(this.construct, this))
			.then($.proxy(this.append, this))
			.done($.proxy(this.update, this));
	},


	/**
	 * Tumblr.loadmore
	 */
	loadmore: function() {
		
		var url = this.API.URL.posts;

		return $.get({
			url: url  + '&offset=' + this.posts.offset, 
			dataType: 'jsonp'
		});
	},


	/**
	 * Tumblr.construct
	 */
	construct: function(posts) {

  		// Stock total posts
  		this.posts.count = posts.response.total_posts;

  		var posts = posts.response.posts;

  		var response = '';

  		for (var i in posts) {
 			var post = posts[i];

			// response += '';
			response += '<div class="Tumblr__post">';
			

			response += '<div class="Tumblr__image" style="background-image: url(\'' + post.photos[0].original_size.url +'\');">';

			if ( post.source_url ) {

				response += '<a class="Tumblr__caption" href="' + post.source_url + '" target="_blank">';
				response += '</a>';
			}
			
			response += '</div>';


			response += '</div>';
		}

		return response;
	},


	/**
	 * Tumblr.append
	 */
	append: function(html) {

		this.$response.find('.response').append(html.replace(/>\s+</g,'><'));
	},


	/**
	 * Tumblr.update
	 */
	update: function() {
		this.posts.offset += this.posts.per_page;
		
		this.$response
			.find('.load-more')
			.attr('data-count', this.posts.count - this.posts.offset)
			.toggle(this.posts.offset <= this.posts.count);
	}
}