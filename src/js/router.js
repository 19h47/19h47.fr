var Vue = require('vue');
var VueRouter = require('vue-router');

// Templates
var templates = {
	Foo: require('./templates/foo.vue'),
	Bar: require('./templates/bar.vue')
}

Vue.use(VueRouter);


var routes = [
	{ path: '/foo', component: templates.Foo },
  	{ path: '/bar', component: templates.Bar }
];

var router = new VueRouter({
  	routes: routes
});

var app = new Vue({
  	router
}).$mount('#app');