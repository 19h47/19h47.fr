import { Piece } from '../lib/Piece';

type TumblrAjaxData = {
	html?: string;
	total_posts?: number;
	next_offset?: number;
	has_more?: boolean;
};

type WpAjaxResponse<T> = {
	success: boolean;
	data: T & { message?: string };
};

/**
 * Tumblr feed web component (AJAX → admin-ajax → Timber HTML).
 *
 * Usage:
 *   <tumblr-feed class="block" per-page="20">
 *     <div class="js-loader"></div>
 *     <section class="response"></section>
 *     <button class="load-more" type="button">Load more <span data-count></span></button>
 *   </tumblr-feed>
 */
class TumblrFeed extends Piece {
	#offset = 0;
	#total = 0;
	#loading = false;
	#response: HTMLElement | null = null;
	#button: HTMLButtonElement | null = null;
	#count: HTMLElement | null = null;
	#loader: HTMLElement | null = null;
	#abort: AbortController | null = null;

	constructor() {
		super('TumblrFeed');
	}

	mount() {
		this.#offset = 0;
		this.#total = 0;
		this.#loading = false;
		this.#response = this.queryOne<HTMLElement>('.response');
		this.#button = this.queryOne<HTMLButtonElement>('.load-more');
		this.#count = this.#button?.querySelector('[data-count]') ?? null;
		this.#loader = this.queryOne<HTMLElement>('.js-loader');
		this.#abort = new AbortController();

		if (this.#button) {
			this.on('click', this.#button, this.#onLoadMore);
		}

		void this.#loadMore();
	}

	unmount() {
		if (this.#button) {
			this.off('click', this.#button, this.#onLoadMore);
		}

		this.#abort?.abort();
		this.#abort = null;
	}

	get perPage() {
		const value = Number(this.getAttribute('per-page'));

		return Number.isFinite(value) && value > 0 ? Math.min(value, 20) : 20;
	}

	#onLoadMore = () => {
		void this.#loadMore();
	};

	async #loadMore() {
		if (this.#loading) {
			return;
		}

		this.#setLoading(true);

		try {
			const data = await this.#fetch();

			this.#total = data.total_posts ?? this.#total;
			this.#offset =
				typeof data.next_offset === 'number'
					? data.next_offset
					: this.#offset + this.perPage;

			if (data.html) {
				this.#response?.insertAdjacentHTML(
					'beforeend',
					data.html.replace(/>\s+</g, '><'),
				);
			}

			this.#updateButton(Boolean(data.has_more));
		} catch (error) {
			console.error('[tumblr-feed]', error);
		} finally {
			this.#setLoading(false);
		}
	}

	async #fetch(): Promise<TumblrAjaxData> {
		const { ajax_url: ajaxUrl, nonce } = window.theme || {};

		if (!ajaxUrl || !nonce) {
			throw new Error('Theme config missing (window.theme).');
		}

		const url = new URL(ajaxUrl);

		url.searchParams.set('action', 'tumblr_posts');
		url.searchParams.set('nonce', nonce);
		url.searchParams.set('offset', String(this.#offset));
		url.searchParams.set('per_page', String(this.perPage));

		const response = await fetch(url.toString(), {
			signal: this.#abort?.signal,
		});
		const payload = (await response.json()) as WpAjaxResponse<TumblrAjaxData>;

		if (!payload.success) {
			throw new Error(
				payload.data?.message || 'Unable to load Tumblr posts.',
			);
		}

		return payload.data;
	}

	#setLoading(isLoading: boolean) {
		this.#loading = isLoading;
		this.classList.toggle('is-loading', isLoading);
		this.#loader?.classList.toggle('is-loading', isLoading);

		if (this.#button) {
			this.#button.classList.toggle('is-loading', isLoading);
			this.#button.classList.toggle('disabled', isLoading);
			this.#button.disabled = isLoading;
		}
	}

	#updateButton(hasMore: boolean) {
		if (!this.#button) {
			return;
		}

		const remaining = Math.max(0, this.#total - this.#offset);

		if (this.#count) {
			this.#count.textContent = String(remaining);
		}

		this.#button.hidden = !hasMore;
	}
}

customElements.define('tumblr-feed', TumblrFeed);

export default TumblrFeed;
