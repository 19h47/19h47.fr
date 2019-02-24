const Mustache = require('mustache');

function Tumblr(element) {
	if (!(this instanceof Tumblr)) {
		return new Tumblr();
	}

	this.$element = $(element);

	if (!this.$element || !this.$element.length) {
		return false;
	}

	return this.setup();
}

Tumblr.prototype = {
	/**
	 * Tumblr.setup
	 */
	setup() {
		this.posts = {
			offset: 0,
			per_page: 20,
			count: null,
		};

		const KEY = 'T1ta3DzmFPU36KjYWsoJcvjl8kSPybrqagZsRp8sXWpUIlxQ98';
		const USER = '19h47';
		const URL = 'http://api.tumblr.com/v2/blog/';

		this.API = {
			KEY,
			USER,
			URL: {
				info: `${URL}${USER}.tumblr.com/info?api_key=${KEY}`,
				posts: `${URL}${USER}.tumblr.com/posts?api_key=${KEY}`,
			},
		};

		this.$response = this.$element;
		this.$button = this.$response.find('.load-more');
		this.$loader = this.$response.find('.js-loader');

		this.more.show.call(this);
		this.initEvents();
	},


	/**
	 * Tumblr.initEvents
	 */
	initEvents() {
		this.$button.on('click.tumblr', () => {
			this.lock.on.call(this);
			this.more.show.call(this);
		});
	},


	/**
	 * Tumblr.more
	 */
	more: {

		/**
		 * Tumblr.more.show
		 */
		show() {
			this.more.load.call(this)
				.then(this.construct.bind(this))
				.then(this.append.bind(this))
				.done(this.update.bind(this));
		},


		/**
		 * Tumblr.more.load
		 */
		load() {
			this.lock.on.call(this);

			const url = this.API.URL.posts;

			return $.get({
				url: `${url}&offset=${this.posts.offset}`,
				dataType: 'jsonp',
			});
		},
	},


	/**
	 * Tumblr.lock
	 */
	lock: {

		/**
		 * Tumblr.lock.off
		 *
		 */
		off() {
			// console.info('Tumblr.lock.off');

			// remove loading state to loader if exists
			if (this.$loader.length) {
				this.$loader.removeClass('is-loading');
			}

			// remove loading state to button if exists
			if (this.$button.length) {
				this.$button
					.removeClass('is-loading disabled')
					.prop('disabled', false);
			}

			// add loading state to ajax container if exists
			if (this.$response.length) {
				this.$response.removeClass('is-loading');
			}
		},


		/**
		 * Tumblr.lock.on
		 *
		 */
		on() {
			// console.info('Tumblr.lock.on');

			// add loading state to loader if exist
			if (this.$loader.length) {
				this.$loader.addClass('is-loading');
			}

			// add loading state to button if exists
			if (this.$button.length) {
				this.$button
					.addClass('is-loading disabled')
					.prop('disabled', true);
			}

			// add loading state to ajax container if exists
			if (this.$response.length) {
				this.$response.addClass('is-loading');
			}
		},
	},


	/**
	 * Tumblr.construct
	 */
	construct(posts) {
		// Stock total posts
		this.posts.count = posts.response.total_posts;

		const currentPosts = posts.response.posts;
		const template = this.$response.find('#post').html();

		let response = '';

		Mustache.parse(template);

		currentPosts.forEach((post) => {
			if (post.type !== 'photo') {
				return;
			}

			response += Mustache.render(template, {
				image: post.photos[0].original_size.url,
				src: post.source_url || post.post_url,
				summary: post.summary,
			});
		});

		return response;
	},


	/**
	 * Tumblr.append
	 */
	append(html) {
		this.$response
			.find('.response')
			.append(html.replace(/>\s+</g, '><'));

		return this.lock.off.call(this);
	},


	/**
	 * Tumblr.update
	 */
	update() {
		// Ensure everything is unlocked
		this.lock.off.call(this);

		this.posts.offset += this.posts.per_page;

		return this.$response
			.find('.load-more')
			.attr('data-count', this.posts.count - this.posts.offset)
			.toggle(this.posts.offset <= this.posts.count);
	},
};

module.exports = Tumblr;
