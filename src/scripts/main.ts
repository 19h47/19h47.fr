import { load } from 'piecesjs';

import Watchers from './modules/Watchers';
import guid from './modules/guid';

load('black-board', () => import('./components/BlackBoard.ts'));
load('black-board-button', () => import('./components/BlackBoardButton.ts'));
load('television-noise', () => import('./components/TelevisionNoise.ts'));
load('tumblr-feed', () => import('./components/TumblrFeed.ts'));
load('lastfm-feed', () => import('./components/LastfmFeed.ts'));

new Watchers();
guid();
