console.log ('toypic started');

var Model = Backbone.Model.extend({
	defaults: {
		name: 'Default',
		image: 'img/teddy.png',
		price: '$100.00',
		provider: 'bestbuy',
		selected: false,
		url: '',
		images:[],
		store:'',
		category:[]
	}
});

var mCollection = Backbone.Collection.extend({
	model: Model
});

var toyCollection = new mCollection();

var tView = Backbone.View.extend({
	initialize: function(){
		console.log('setup toy view');
	},

	render: function(){
		console.log('render toy view');
		var template = _.template( $('#template_toy').html() );

		_.each([0,1,2], function(i){
			console.log('t1');
			var toy = toyCollection.at(i);
			console.log(toy);
			var template = _.template( $('#template_toy').html() );
			var html = template({toy: toy});
			$('.toy-row-1').append(html);
		});

		_.each([3,4,5], function(i){
			console.log('t2');
			var toy = toyCollection.at(i);
			console.log(toy);
			var template = _.template( $('#template_toy').html() );
			var html = template({toy: toy});
			$('.toy-row-2').append(html);
		});

		_.each([6,7,8], function(i){
			console.log('t3');
			var toy = toyCollection.at(i);
			console.log(toy);
			var template = _.template( $('#template_toy').html() );
			var html = template({toy: toy});
			$('.toy-row-3').append(html);
		});
	}
});

var fbRef = new Firebase('https://toypic.firebaseio.com/');

var current_keywords = [];

_.each([1,2,3,4,5,6,7,8,9], function(){
	var t = new Model();
	console.log('adding a toy');
	toyCollection.add(t);
});

var toyView = new tView();



$(function(){

	//setup event handlers
	$('#btn_add_keyword').click(function(event){
		event.preventDefault();
		console.log('keyword btn clikced');

		if ( $('#input_keyword').val() !== '' ){
			console.log('we have a keyword: ' + $('#input_keyword').val() );
			
			var keyword = $('#input_keyword').val();
			$('#input_keyword').val('');

			current_keywords.push(keyword);

			var template = _.template( $('#template_keywords_list').html() );
			var html = template( current_keywords );

			$('#selected_keywords').html(html);
		}
	});

	toyView.render();

});
