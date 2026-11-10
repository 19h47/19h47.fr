import { Piece } from '../lib/Piece';

type TumblrData = {
	html?: string;
	total_posts?: number;
	next_offset?: number;
	has_more?: boolean;
};

type RestError = {
	message?: string;
};

/**
 * Tumblr feed web component (REST → Timber HTML).
 *
 * First paint can be SSR’d into `.response` with data-offset / data-total /
 * data-has-more on the host; mount then hydrates and skips the first fetch.
 *
 * Usage:
 *   <tumblr-feed class="block" src="/wp-json/19h47/v1/tumblr" per-page="20">
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

		if (this.#hydrateFromDom()) {
			return;
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

	#hydrateFromDom(): boolean {
		if (!this.#response?.children.length) {
			return false;
		}

		const offsetAttr = this.getAttribute('data-offset');
		const totalAttr = this.getAttribute('data-total');
		const hasMoreAttr = this.getAttribute('data-has-more');

		this.#offset =
			offsetAttr !== null && Number.isFinite(Number(offsetAttr))
				? Number(offsetAttr)
				: this.#response.children.length;
		this.#total =
			totalAttr !== null && Number.isFinite(Number(totalAttr))
				? Number(totalAttr)
				: 0;

		const hasMore =
			hasMoreAttr === null
				? this.#offset < this.#total
				: hasMoreAttr !== 'false';

		this.#updateButton(hasMore);
		this.#setLoading(false);
		this.#loader?.classList.remove('is-loading');

		return true;
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
			this.setAttribute('data-offset', String(this.#offset));
			this.setAttribute('data-total', String(this.#total));
			this.setAttribute(
				'data-has-more',
				data.has_more ? 'true' : 'false',
			);
		} catch (error) {
			console.error('[tumblr-feed]', error);
		} finally {
			this.#setLoading(false);
		}
	}

	async #fetch(): Promise<TumblrData> {
		const url = new URL(this.getAttribute('src') ?? '', document.baseURI);

		url.searchParams.set('offset', String(this.#offset));
		url.searchParams.set('per_page', String(this.perPage));

		const response = await fetch(url, { signal: this.#abort?.signal });
		const payload = (await response.json()) as TumblrData & RestError;

		if (!response.ok) {
			throw new Error(payload.message || 'Unable to load Tumblr posts.');
		}

		return payload;
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
