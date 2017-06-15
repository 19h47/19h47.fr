var Modules = require('../modules/index');
var Barba = require('barba.enhanced.js');
var classes = require('dom-classes');
var select = require('dom-select');


/**
 * CurriculumVitae
 */
var CurriculumVitae = Barba.BaseView.extend({

	/**
	 * CurriculumVitae.namespace
	 */
	namespace: 'curriculum-vitae',


	/**
	 * CurriculumVitae.onEnter
	 */
	onEnter: function() {},


	/**
	 * CurriculumVitae.onEnterCompleted
	 */
	onEnterCompleted: function() {},
	

	/**
	 * CurriculumVitae.onLeave
	 */
	onLeave: function() {},


	/**
	 * CurriculumVitae.onLeaveCompleted
	 */	
	onLeaveCompleted: function() {}
});

module.exports = CurriculumVitae;