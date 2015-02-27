console.log ('toypic started');

var Model = Backbone.Model.extend({
	defaults: {
		name: '',
		price: '',
		url: ''
	}
});

var mCollection = Backbone.Collection.extend({
	model: Model
});

var toyCollection = new mCollection();

var fbRef = new Firebase('https://toypic.firebaseio.com/');



