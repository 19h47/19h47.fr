import { Piece } from '../lib/Piece';

type LastfmAjaxData = {
	html?: string;
	playcount?: number | string;
};

type WpAjaxResponse<T> = {
	success: boolean;
	data: T & { message?: string };
};

/**
 * Last.fm feed web component (AJAX → admin-ajax → Timber HTML).
 *
 * Usage:
 *   <lastfm-feed class="block" limit="50">
 *     <div class="js-loader"></div>
 *     <div class="response"></div>
 *     <span class="playcount"></span>
 *   </lastfm-feed>
 */
class LastfmFeed extends Piece {
	#loading = false;
	#response: HTMLElement | null = null;
	#loader: HTMLElement | null = null;
	#playcount: HTMLElement | null = null;
	#abort: AbortController | null = null;

	constructor() {
		super('LastfmFeed');
	}

	mount() {
		this.#response = this.queryOne<HTMLElement>('.response');
		this.#loader = this.queryOne<HTMLElement>('.js-loader');
		this.#playcount = this.queryOne<HTMLElement>('.playcount');
		this.#abort = new AbortController();
		void this.#load();
	}

	unmount() {
		this.#abort?.abort();
		this.#abort = null;
	}

	get limit() {
		const value = Number(this.getAttribute('limit'));

		return Number.isFinite(value) && value > 0 ? Math.min(value, 200) : 50;
	}

	async #load() {
		if (this.#loading) {
			return;
		}

		this.#setLoading(true);

		try {
			const data = await this.#fetch();

			if (data.html) {
				this.#response?.insertAdjacentHTML(
					'beforeend',
					data.html.replace(/>\s+</g, '><'),
				);
			}

			if (this.#playcount && data.playcount != null) {
				this.#playcount.textContent = Number(
					data.playcount,
				).toLocaleString();
			}
		} catch (error) {
			console.error('[lastfm-feed]', error);
		} finally {
			this.#setLoading(false);
		}
	}

	async #fetch(): Promise<LastfmAjaxData> {
		const { ajax_url: ajaxUrl, nonce } = window.theme || {};

		if (!ajaxUrl || !nonce) {
			throw new Error('Theme config missing (window.theme).');
		}

		const url = new URL(ajaxUrl);

		url.searchParams.set('action', 'lastfm_recent');
		url.searchParams.set('nonce', nonce);
		url.searchParams.set('limit', String(this.limit));

		const response = await fetch(url.toString(), {
			signal: this.#abort?.signal,
		});
		const payload = (await response.json()) as WpAjaxResponse<LastfmAjaxData>;

		if (!payload.success) {
			throw new Error(
				payload.data?.message || 'Unable to load Last.fm tracks.',
			);
		}

		return payload.data;
	}

	#setLoading(isLoading: boolean) {
		this.#loading = isLoading;
		this.classList.toggle('is-loading', isLoading);
		this.#loader?.classList.toggle('is-loading', isLoading);
	}
}

customElements.define('lastfm-feed', LastfmFeed);

export default LastfmFeed;
