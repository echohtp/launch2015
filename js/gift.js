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
			$('.gifts-header').append('<h1>Pick your gift, ' + giftSnap.child('recp_name').val() + '!</h1>');

			$('.gift-toy').click(function(event){
				var dataId = $(this).data('id');
				var sToy = toyCollection.findWhere({'id': dataId});
				var template = _.template( $('#template_selected_toy').html() );
				var html = template ( { toy: sToy } );
				$('.gifts-header > h1').html("This one?");
				$('.gift-choices').html(html);
				$('#btn_get_it').toggle();
				$('#btn_confirm').toggle();
				$('#btn_cancel').toggle();
			});

		});


		$('#btn_confirm').click(function(){
			var selectedToy = toyCollection.findWhere({'selected': true});
			$.post('/gift/' + redeem_code + '/' + selectedToy.get('id') )
			 .done(function(){
			 	var url = 'http://toypic.club/done/' + redeem_code;
					window.location.replace(url);
			 });
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