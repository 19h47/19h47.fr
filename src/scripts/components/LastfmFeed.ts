import { Piece } from '../lib/Piece';

type LastfmData = {
	html?: string;
	playcount?: number | string;
};

type RestError = {
	message?: string;
};

/**
 * Last.fm feed web component (REST → Timber HTML).
 *
 * First paint can be SSR’d into `.response` (and playcount); mount then
 * hydrates and soft-refreshes from `src` so recent scrobbles stay current.
 * Server cache TTL stays short because scrobbles change often.
 *
 * Usage:
 *   <lastfm-feed class="block" src="/wp-json/19h47/v1/lastfm" limit="50">
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

		// SSR paints first; always soft-refresh so scrobbles stay current
		// (hydrate alone used to skip AJAX forever for the visit).
		const hydrated = this.#hydrateFromDom();

		void this.#load({ silent: hydrated });
	}

	unmount() {
		this.#abort?.abort();
		this.#abort = null;
	}

	get limit() {
		const value = Number(this.getAttribute('limit'));

		return Number.isFinite(value) && value > 0 ? Math.min(value, 200) : 50;
	}

	#hydrateFromDom(): boolean {
		if (!this.#response?.children.length) {
			return false;
		}

		const playcountAttr = this.getAttribute('data-playcount');

		if (this.#playcount && playcountAttr != null && playcountAttr !== '') {
			this.#playcount.textContent = Number(playcountAttr).toLocaleString();
		}

		this.#setLoading(false);
		this.#loader?.classList.remove('is-loading');

		return true;
	}

	async #load({ silent = false }: { silent?: boolean } = {}) {
		if (this.#loading) {
			return;
		}

		this.#loading = true;

		if (!silent) {
			this.classList.add('is-loading');
			this.#loader?.classList.add('is-loading');
		}

		try {
			const data = await this.#fetch();

			// Full recent list (not paginated) — always replace.
			if (data.html && this.#response) {
				this.#response.innerHTML = data.html.replace(/>\s+</g, '><');
			}

			if (this.#playcount && data.playcount != null) {
				this.#playcount.textContent = Number(
					data.playcount,
				).toLocaleString();
				this.setAttribute('data-playcount', String(data.playcount));
			}
		} catch (error) {
			console.error('[lastfm-feed]', error);
		} finally {
			this.#setLoading(false);
		}
	}

	async #fetch(): Promise<LastfmData> {
		const url = new URL(this.getAttribute('src') ?? '', document.baseURI);

		url.searchParams.set('limit', String(this.limit));

		const response = await fetch(url, { signal: this.#abort?.signal });
		const payload = (await response.json()) as LastfmData & RestError;

		if (!response.ok) {
			throw new Error(payload.message || 'Unable to load Last.fm tracks.');
		}

		return payload;
	}

	#setLoading(isLoading: boolean) {
		this.#loading = isLoading;
		this.classList.toggle('is-loading', isLoading);
		this.#loader?.classList.toggle('is-loading', isLoading);
	}
}

customElements.define('lastfm-feed', LastfmFeed);

export default LastfmFeed;
