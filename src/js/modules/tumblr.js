module.exports = Tumblr;

var $ = require('jquery');
var Mustache = require('mustache');

function Tumblr(element) {
	if (!(this instanceof Tumblr)) {
		return new Tumblr();
	}

	this.$element = $(element);

	if (!this.$element || !this.$element.length) {
		return;
	}

	this.deferred = new $.Deferred();
     
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
		};
		
		var KEY = 'T1ta3DzmFPU36KjYWsoJcvjl8kSPybrqagZsRp8sXWpUIlxQ98';
		var USER = '19h47';
		var URL = 'http://api.tumblr.com/v2/blog/';

		this.API = {
			KEY: KEY,
			USER: USER,
			URL: {
				info: URL + USER + '.tumblr.com/info?api_key=' + KEY,
				posts: URL + USER + '.tumblr.com/posts?api_key=' + KEY,
			}
		};
		
		this.$response = this.$element;
		this.button = this.$response.find('.load-more');
		this.loader = this.$response.find('.js-loader');

		this.more.show.call(this);
		this.initEvents();
	},


	/**
	 * Tumblr.initEvents
	 */
	initEvents: function() {
		this.button
			.on('click.tumblr', $.proxy(function() {

				this.lock.on.call(this);
				this.more.show.call(this);

			}, this));
	},


	/**
	 * Tumblr.more
	 */
	more: {

		/**
		 * Tumblr.more.show
		 */
		show: function() {
			
			this.more.load.call(this)
				.then($.proxy(this.construct, this))
				.then($.proxy(this.append, this))
				.then($.proxy(this.update, this))
				.done(this.deferred.promise());				
		},


		/**
		 * Tumblr.more.load
		 */
		load: function() {

			this.lock.on.call(this);
			
			var url = this.API.URL.posts;

			return $.get({
				url: url  + '&offset=' + this.posts.offset, 
				dataType: 'jsonp'
			});
		}
	},


	/**
	 * Tumblr.lock
	 */
	lock: {

		/**
		 * Tumblr.lock.off
		 */
		off: function() {
			// console.info('Tumblr.lock.off');

			// remove loading state to loader if exists
			this.loader.length && 
			this.loader
				.removeClass('is-loading');

			// remove loading state to button if exists
			this.button.length && 
			this.button
				.removeClass('is-loading disabled')
				.prop('disabled', false);

			// add loading state to ajax container if exists
			this.$response.length &&
			this.$response.removeClass('is-loading');
		},


		/**
		 * Tumblr.lock.on
		 */
		on: function() {
			// console.info('Tumblr.lock.on');
			
			// add loading state to loader if exist
			this.loader.length && 
			this.loader
				.addClass('is-loading');

			// add loading state to button if exists
			this.button.length && 
			this.button
				.addClass('is-loading disabled')
				.prop('disabled', true);

			// add loading state to ajax container if exists
			this.$response.length &&
			this.$response.addClass('is-loading');
		}
	},


	/**
	 * Tumblr.construct
	 */
	construct: function(posts) {

		// Stock total posts
		this.posts.count = posts.response.total_posts;

		posts = posts.response.posts;

		var response = '';
		var template = this.$response.find('#post').html();
		
		Mustache.parse(template);

		posts.forEach(function(post) {
			response += Mustache.render(template, {
				image: post.photos[0].original_size.url,
				src: post.source_url || post.post_url,
				summary: post.summary
			});
		});

		return response;
	},


	/**
	 * Tumblr.append
	 */
	append: function(html) {

		this.$response
			.find('.response')
			.append(html.replace(/>\s+</g,'><'));

		$.proxy(this.lock.off, this);
	},


	/**
	 * Tumblr.update
	 */
	update: function() {

		// Ensure everything is unlocked
		this.lock.off.call(this);

		this.posts.offset += this.posts.per_page;
		
		this.$response
			.find('.load-more')
			.attr('data-count', this.posts.count - this.posts.offset)
			.toggle(this.posts.offset <= this.posts.count);	

		return this.deferred.resolve();	
	}
};