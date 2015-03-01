require.config({
    baseUrl: '../js',
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
		el: '.gift-choices',
		collection:toyCollection
	});

	var redeem_code = window.location.pathname.split('/')[2]; 

	console.log(redeem_code);
	var fbRef = new Firebase('https://toypic.firebaseio.com/gifts/' + redeem_code);



	////////
	////////

	var giftInit = function(){
		//pull the assets
		console.log('giftinit');
		fbRef.once('value', function(giftSnap){
			console.log(giftSnap.child('email_to').val());
			console.log(giftSnap.child('email_from').val());
			console.log(giftSnap.child('recp_name').val());
			giftSnap.child('toys').forEach(function(toySnap){
				var t = new Toy(toySnap.exportVal());
				t.set('selected', false);
				console.log('adding a toy');
				toyCollection.add(t);
			});

			console.log(toyCollection);
			toysView.render();
			$('.gifts-header').append('<h1>Pick your gift, ' + giftSnap.child('recp_name').val() + '!</h1>')
		});



		$('#btn_get_it').click(function(event){

			if ( toyCollection.findWhere({'selected': true }) ){

			var template = _.template( $('#template_selected_toy').html() );
			var sToy = toyCollection.findWhere({'selected': true});
			var html = template ( { toy: sToy } );
			$('.gift-choices').html(html);
			$('#btn_get_it').toggle();
			$('#btn_confirm').toggle();
			$('#btn_cancel').toggle();
		}else {
			alert('Please select a gift!');
		}

		});

		$('#btn_confirm').click(function(){
			var selectedToy = toyCollection.findWhere({'selected': true});
			$.post('/gift/' + redeem_code + '/' + selectedToy.get('id') );
		});

		$('#btn_cancel').click(function(){
			toyCollection.forEach(function(toy){
				toy.set('selected', false);
			});
			$('.gift-choices').empty();
			toysView.render();
			$('#btn_get_it').toggle();
			$('#btn_confirm').toggle();
			$('#btn_cancel').toggle();
		});
	}


	giftInit();
});