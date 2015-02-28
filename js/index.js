require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery.min',
		'underscore': 'lib/underscore',
		'backbone': 'lib/backbone',
		'firebase': 'lib/firebase', 
		'bootstrap':'lib/bootstrap.min',

		'toy':'app/toy'
    },
    shim:{
    	'bootstrap':{
    		deps:['jquery']
    	},
    	'backbone':{
    		deps:['underscore']
    	},
    	'toy':{
    		deps:['backbone']
    	}
    }
});

require(['jquery','underscore','backbone','bootstrap','firebase','toy'],function(){

	console.log ('toypic started');

	var toyCollection = new Toys();
	var toysView = new ToyGallery({
			el: 'home-search-results',
			collection:toyCollection
		});

	//var fbRef = new Firebase('https://toypic.firebaseio.com/');

	var current_keywords = [];

	_.each([1,2,3,4,5,6,7,8,9], function(){
		var t = new Toy();
		console.log('adding a toy');
		toyCollection.add(t);
	});

	var indexInit = function(){
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

		toysView.render();
	}


	indexInit();
});