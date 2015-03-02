require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery.min',
		'underscore': 'lib/underscore',
		'backbone': 'lib/backbone',
		'firebase': 'lib/firebase', 
		'bootstrap':'lib/bootstrap.min',

		'toy':'app/toy',
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

	/// TO BE CHANGGED
	//// FOR TESTING
	console.log ('toypic started');

	var toyCollection = new Toys();
	var toysView = new ToyGallery({
		el: '.home-search-results',
		collection:toyCollection
	});

	var fbRef = new Firebase('https://toypic.firebaseio.com/');

	var current_keywords = [];


	////////
	////////

	var indexInit = function(){
		//pull the assets
		$.get('/search/toys',function(res){

			res.forEach(function(toyData){
				var t = new Toy(toyData);
				toyCollection.add(t);
			});
			
			toysView.render();
		});

		$('div.refine-area > div > div > label').click(function(){
			var term = $(this).find('input').val() || false;

			if(term){

				$.get('/search/' + term,function(res){
					//console.log(res);
					if(res.length > 0 ){
						var saveToys = [];
						toyCollection.each(function(toy){
							var toyCheck = toy || false;
							
							if(toyCheck){
								if(toy.get('selected')){
									saveToys.push(toy.toJSON());
								}
							}	
											
						});
						toyCollection.reset(saveToys);	

						res.forEach(function(toyData){
							var t = new Toy(toyData);
							toyCollection.add(t);
						});

						toysView.render();	
					}else{
						console.log('no results for term so leaving alone');
					}
				});
			}
		});



	var sendGift = function(){
		var redeem_code = Math.random().toString(36).slice(2);
		var selected_toys = new Toys();
		
		toyCollection.each(function(toy){
			if (toy.get('selected')){
				selected_toys.add(toy);
			}
		});



		console.log('writing to: ' + redeem_code);
		console.log(selected_toys.length);

		if ( $('#input_child_name').val() && $('#input_recieve_email').val() && $('#input_sender_email').val() && $('#input_sender_name').val() ){
			fbRef.child('gifts').child(redeem_code).child('from_name').set( $('#input_sender_name').val() );
			fbRef.child('gifts').child(redeem_code).child('email_from').set( $('#input_sender_email').val() );
			fbRef.child('gifts').child(redeem_code).child('email_to').set( $('#input_recieve_email').val() );
			fbRef.child('gifts').child(redeem_code).child('recp_name').set( $('#input_child_name').val() );
			fbRef.child('gifts').child(redeem_code).child('toys').set(selected_toys.toJSON());

			$.post('/gift/', { "redeem_code": redeem_code, "email_to": $('#input_recieve_email').val(), "email_from": $('#input_sender_email').val(), "recp_name" : $('#input_child_name').val(), "from_name": $('#input_sender_name').val() })
				.done(function(){
					var url = 'http://toypic.club/success/' + redeem_code;
					window.location.replace(url);
				});

		}else {
			alert('Missing some data!');
		}
		
	}

		//event handler to click the gift and change state



		//


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

		$('#btn_send_gift').click(function(event){
			sendGift();
		});
	}


	indexInit();
});