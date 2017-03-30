var Barba = require('barba.js');

Barba.Dispatcher.on('linkClicked', function(el) {
    // store namespace of page to load for later usage
    var ns = Barba.Pjax.Dom.getNamespace(el);
    if (ns) {
        Barba.Pjax.History.storeNamespace(ns);
    }

    // store from_link flag for later usage
    Barba.Pjax.History.storeFromLink(true);
});

Barba.Dispatcher.on('initStateChange', function(currentStatus) {
    if (!currentStatus.namespace) {
        // set namespace of future before it's load
        Barba.Pjax.History.setCurrentNamespace();
    }
    if (!currentStatus.from_link) {
        // set from_link flag of future before it's load
        Barba.Pjax.History.setCurrentFromLink();
    }
});

/**
 * Retrieve namespace from a stored url in history
 * @memberOf Barba.Pjax.Dom
 * @param  {String} url
 * @return {String}
 */
Barba.HistoryManager.getNamespace = function(url) {
    // console.log('Barba.HistoryManager.getNamespace', url);
    if (!this.history.length) {
        return;
    }

    var namespace = undefined;

    this.history.forEach(function(state, i) {
        if (!namespace && url === state.url) {
            namespace = state.namespace;
        }
    });

    return namespace;
};

/**
 * Store a namespace for current status to be added
 * @param {String} namespace
 */
Barba.HistoryManager.storeNamespace = function(namespace) {
    // console.log('Barba.HistoryManager.storeNamespace', namespace);
    this._namespace = namespace;
};

/**
 * Store from_link flag for current status to be added
 * @param {Boolean} from_link
 */
Barba.HistoryManager.storeFromLink = function(from_link) {
    // console.log('Barba.HistoryManager.storeFromLink', from_link);
    this._from_link = from_link;
};

/**
 * Store a namespace for current status to be added
 * @param {String} namespace
 */
Barba.HistoryManager.setCurrentNamespace = function() {
    // console.log('Barba.HistoryManager.setCurrentNamespace');
    if (typeof this._namespace === 'undefined') {
        return;
    }

    var currentStatus = this.currentStatus();
    if (!currentStatus) {
        return;
    }

    if (!this._namespace) {
        // try to retrieve namespace from a previous state
        this._namespace = this.getNamespace(currentStatus.url);
    }

    currentStatus.namespace = this._namespace;
    // delete last stored namespace
    this._namespace = null;
};

/**
 * Store a from_link flag for current status to be added
 * @param {Boolean} from_link
 */
Barba.HistoryManager.setCurrentFromLink = function() {
    // console.log('Barba.HistoryManager.setCurrentFromLink');
    if (typeof this._from_link === 'undefined') {
        return;
    }

    var currentStatus = this.currentStatus();
    if (!currentStatus) {
        return;
    }

    currentStatus.from_link = this._from_link;
    // delete last stored from_link
    this._from_link = null;
};


module.exports = Barba;