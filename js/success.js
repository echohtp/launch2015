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
			console.log(giftSnap.child('from_name').val());
			giftSnap.child('toys').forEach(function(toySnap){
				var t = new Toy(toySnap.exportVal());
				t.set('selected', false);
				console.log('adding a toy');
				toyCollection.add(t);
			});

			console.log(toyCollection);
			toysView.render();
			$('.gifts-header').append('<h1>Great, ' + giftSnap.child('from_name').val() + '!</h1><h4>You sent these gift choices to ' + giftSnap.child('recp_name').val() + ':</h4>');
		});

	}


	giftInit();
});