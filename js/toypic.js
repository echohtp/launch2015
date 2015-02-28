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

var current_keywords = [];

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

	$('#range_price').change(function(event){
		$('#badge_price').text('$' + $('#range_price').val() );
	});

});