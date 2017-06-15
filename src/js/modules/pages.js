module.exports = Pages;

var config = require('../config');
var $ = require('jquery');
var Mustache = require('mustache');

function Pages(element) {
	if (!(this instanceof Pages)) {
		return new Pages();
	}

	this.$element = $(element).find('.js-page');

	if (!this.$element || !this.$element.length) {
		return;
	}

	this.setup();
}


/**
 * Pages
 */
Pages.prototype = {
	
	/**
	 * Pages.setup
	 */
	setup: function() {
		// console.info('Pages.setup');

		this.get.url(this.get.postSlug.call(this, this.$element))
			.then($.proxy(this.construct, this))
			.done($.proxy(this.append, this));
	},


	/**
	 * Pages.get
	 */
	get: {

		/**
		 * Pages.get.url
		 */
		url: function(slug) {

			return $.get({
				url: config.api + 'pages/', 
				data: {slug: slug},
				dataType: 'json'
			});
		},

		/**
		 * Pages.get.postSlug
		 */
		postSlug: function(element) {
			return element.attr('data-post-slug');
		}
	},


	/**
	 * Pages.construct
	 */
	construct: function(response) {
		var post;

		return post = {
			title: response[0].title.rendered,
			content: response[0].content.rendered
		};
	},


	/**
	 * Pages.append
	 */
	append: function(post) {

		// console.dir(post);

		var template = {
			title: $('#page-title').html(),
			content: $('#page-content').html()
		};
		
		Mustache.parse(template.title);
		Mustache.parse(template.content);

		var htmlTitle = Mustache.render(template.title, {title: post.title});
		var htmlContent = Mustache.render(template.content, {content: post.content});

		this.$element.find('.js-title').append(htmlTitle);
		this.$element.find('.js-content').append(htmlContent);

	}
};
