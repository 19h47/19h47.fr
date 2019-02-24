import Mustache from 'mustache';

const config = require('../config');

function Pages(element) {
	if (!(this instanceof Pages)) {
		return new Pages();
	}

	this.$element = $(element).find('.js-page');

	if (!this.$element || !this.$element.length) {
		return false;
	}

	return this.setup.call(this);
}


/**
 * Pages
 */
Pages.prototype = {

	/**
	 * Pages.setup
	 */
	// eslint-disable-next-line
	setup() {
		// console.info('Pages.setup');
		this
			.get.url(this.get.postSlug(this.$element))
			.then(this.construct)
			.done(this.append.bind(this));
	},


	/**
	 * Pages.get
	 */
	get: {

		/**
		 * Pages.get.url
		 */
		url(slug) {
			return $.get({
				url: `${config.api}pages/`,
				data: { slug },
				dataType: 'json',
			});
		},

		/**
		 * Pages.get.postSlug
		 */
		postSlug(element) {
			return element.attr('data-post-slug');
		},
	},


	/**
	 * Pages.construct
	 */
	construct(response) {
		const post = {
			title: response[0].title.rendered,
			content: response[0].content.rendered,
		};

		return post;
	},


	/**
	 * Pages.append
	 */
	append(post) {
		// console.dir(post);
		const template = {
			title: $('#page-title').html(),
			content: $('#page-content').html(),
		};

		Mustache.parse(template.title);
		Mustache.parse(template.content);

		const htmlTitle = Mustache.render(template.title, { title: post.title });
		const htmlContent = Mustache.render(template.content, { content: post.content });

		this.$element.find('.js-title').append(htmlTitle);
		this.$element.find('.js-content').append(htmlContent);
	},
};

export default Pages;
