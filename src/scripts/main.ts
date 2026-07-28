import { load } from 'piecesjs';
import barba from '@barba/core';
import prefetch from '@barba/prefetch';

import App from './modules/App';
import Navigation from './modules/Navigation';
import Watchers from './modules/Watchers';
import guid from './modules/guid';

import Basic from './transitions/Basic';
import WorkToWork from './transitions/WorkToWork';

import Work from './views/Work';

console.log(
	'%c🔥 Scooby doo wah, scooby doo wee, like a jazz player, I improvise wisely 🔥',
	'background-color:#000;color:#fff;padding:0.5em 1em;',
);

const loadPieces = (ctx: Document | Element = document) => {
	load('black-board', () => import('./components/BlackBoard.ts'), ctx);
	load(
		'black-board-button',
		() => import('./components/BlackBoardButton.ts'),
		ctx,
	);
	load(
		'television-noise',
		() => import('./components/TelevisionNoise.ts'),
		ctx,
	);
	load('tumblr-feed', () => import('./components/TumblrFeed.ts'), ctx);
	load('lastfm-feed', () => import('./components/LastfmFeed.ts'), ctx);
};

const isLinkTrigger = (trigger: unknown): trigger is HTMLElement =>
	Boolean(
		trigger &&
			typeof trigger !== 'string' &&
			typeof (trigger as HTMLElement).classList?.contains === 'function',
	);

window.app = new App();
window.app.addState('page--is-loading');

Navigation();
new Watchers();
guid();
loadPieces();

const transition = document.querySelector<HTMLElement>('.js-transition');

const finishLoading = () => {
	window.app.enableScroll(0);
	void window.app.removeState('page--is-loading');
};

barba.use(prefetch);

barba.hooks.before(({ trigger }) => {
	window.app.addState('page--is-loading');
	window.app.disableScroll();

	if (!isLinkTrigger(trigger)) {
		return;
	}

	if (trigger.dataset.namespace !== 'work') {
		transition?.removeAttribute('style');
	}

	if (trigger.classList.contains('js-to-work-single')) {
		const color =
			trigger.dataset.color ||
			trigger.querySelector<HTMLElement>('[data-color]')?.dataset.color;

		if (color && transition) {
			transition.style.backgroundColor = color;
		}
	}
});

barba.hooks.beforeEnter(({ next }) => {
	document.body.dataset.context = next.namespace || '';
	Navigation();
});

barba.hooks.afterEnter(({ next }) => {
	loadPieces(next.container);
	finishLoading();
});

// First paint: afterEnter may not run depending on Barba version/config.
barba.hooks.once(({ next }) => {
	if (next?.namespace) {
		document.body.dataset.context = next.namespace;
	}

	loadPieces(next?.container ?? document);
	finishLoading();
});

barba.init({
	views: [Work],
	transitions: [WorkToWork, Basic],
});
