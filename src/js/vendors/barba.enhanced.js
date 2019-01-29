import Barba from 'barba.js';


Barba.Dispatcher.on('linkClicked', (el) => {
	// store namespace of page to load for later usage
	const ns = Barba.Pjax.Dom.getNamespace(el);

	if (ns) {
		Barba.Pjax.History.storeNamespace(ns);
	}

	// store from_link flag for later usage
	Barba.Pjax.History.storeFromLink(true);
});


Barba.Dispatcher.on('initStateChange', (currentStatus) => {
	if (!currentStatus.namespace) {
		// set namespace of future before it's load
		Barba.Pjax.History.setCurrentNamespace();
	}

	// eslint-disable-next-line
	if (!currentStatus.from_link) {
		// set from_link flag of future before it's load
		Barba.Pjax.History.setCurrentFromLink();
	}
});


/**
 * Retrieve namespace from a stored url in history
 *
 * @memberOf Barba.Pjax.Dom
 * @param  {String} url
 * @return {String}
 */
// eslint-disable-next-line
Barba.HistoryManager.getNamespace = function(url) {
	// console.log('Barba.HistoryManager.getNamespace', url);
	if (!this.history.length) {
		return;
	}

	let namespace = null;

	this.history.forEach((state) => {
		if (!namespace && url === state.url) {
			// eslint-disable-next-line
			namespace = state.namespace;
		}
	});
	// eslint-disable-next-line
	return namespace;
};


/**
 * Store a namespace for current status to be added
 * @param {String} namespace
 */
// eslint-disable-next-line
Barba.HistoryManager.storeNamespace = function(namespace) {
	// console.log('Barba.HistoryManager.storeNamespace', namespace);
	// eslint-disable-next-line
	this._namespace = namespace;
};


/**
 * Store from_link flag for current status to be added
 * @param {Boolean} from_link
 */
// eslint-disable-next-line
Barba.HistoryManager.storeFromLink = function(from_link) {
	// console.log('Barba.HistoryManager.storeFromLink', from_link);
	// eslint-disable-next-line
	this._from_link = from_link;
};


/**
 * Store a namespace for current status to be added
 * @param {String} namespace
 */
// eslint-disable-next-line
Barba.HistoryManager.setCurrentNamespace = function() {
	// console.log('Barba.HistoryManager.setCurrentNamespace');
	// eslint-disable-next-line
	if (typeof this._namespace === 'undefined') {
		return;
	}

	const currentStatus = this.currentStatus();

	if (!currentStatus) {
		return;
	}

	// eslint-disable-next-line
	if (!this._namespace) {
		// try to retrieve namespace from a previous state
		// eslint-disable-next-line
		this._namespace = this.getNamespace(currentStatus.url);
	}

	// eslint-disable-next-line
	currentStatus.namespace = this._namespace;
	// delete last stored namespace
	// eslint-disable-next-line
	this._namespace = null;
};


/**
 * Store a from_link flag for current status to be added
 * @param {Boolean} from_link
 */
// eslint-disable-next-line
Barba.HistoryManager.setCurrentFromLink = function() {
	// console.log('Barba.HistoryManager.setCurrentFromLink');
	// eslint-disable-next-line
	if (typeof this._from_link === 'undefined') {
		return;
	}

	const currentStatus = this.currentStatus();

	if (!currentStatus) {
		return;
	}

	// eslint-disable-next-line
	currentStatus.from_link = this._from_link;
	// delete last stored from_link
	// eslint-disable-next-line
	this._from_link = null;
};


export default Barba;
