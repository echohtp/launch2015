var Hapi = require('hapi');
var Backbone = require('backbone');
var _ = require('lodash');
var Firebase = require('firebase');
var Colors = require('colors');

var macys = require('./retailers/macys.js');
var bestbuy = require('./retailers/bestbuy.js');

var sparkpost = require('sparkpost')({key: '120e87395578ee692606850f732e756169b85c53'});

var sOptions = {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 3000
};


var server = new Hapi.Server();
var fbRef = new Firebase('https://toypic.firebaseio.com/');

server.connection(sOptions);



server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: {
        directory: {
            path: './img'
        }
    }
});

server.route({
    method: 'GET',
    path: '/js/{param*}',
    handler: {
        directory: {
            path: './js'
        }
    }
});

server.route({
    method: 'GET',
    path: '/fonts/{param*}',
    handler: {
        directory: {
            path: './fonts'
        }
    }
});

server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: './css'
        }
    }
});

server.route({
	method: 'GET',
	path: '/success/{code}',
	handler: function(request, reply){
		reply.file ('success.html');
	}
});

server.route({
	method: 'GET',
	path: '/done/{code}',
	handler: function(request, reply){
		reply.file ('done.html');
	}
});


server.route({
    method: 'GET',
    path: '/search/{term}',
    handler: function(request,reply){
		var sT = request.params.term || false;
        ///this is just going to pull out from FB
        //sidestep above logic
        var allProductsOutput = [];

        if(sT){
	        fbRef.child('products').once('value',function(productsSnap){


	        	if( sT === 'all' ){

		        	productsSnap.forEach(function(fullProductSnap){
		        		allProductsOutput.push( fullProductSnap.val() );
		        	});
		        	reply(allProductsOutput);

	        	}else{

			        fbRef.child('filters').child(sT).once('value',function(filterSnap){
			        	var allProducts = [];
			        	filterSnap.forEach(function(pSnap){
			        		allProducts.push(pSnap.key());
			        	});

			        	productsSnap.forEach(function(fullProductSnap){
			        		if( allProducts.indexOf( fullProductSnap.key() ) >= 0 ){
			        			allProductsOutput.push( fullProductSnap.val() );
			        		}
			        	});
			        	reply(allProductsOutput);

			        });
		    	}

	        });
    	}else{
    		reply({error:true,message:'need to specify filter term'});
    	}

		var pullRetailerData = function(){
	        if(sT){
              //  bestbuy.search(sT,function(bdata){
                //    console.log('back from best buy search');
                    macys.search(sT,function(){
                    	console.log('back from macys');
                    });
                //});
	        }else{
	            return { 
	            	error:true, 
	            	message:'no retariler data'
	            };
	        }
        }

      //pullRetailerData();

    }
});

server.route({
	method: 'POST',
	path: '/gift/',
	handler: function(request, reply){
		console.log(request.payload);
		var trans = {};
		trans.campaign = 'Launch2015';
		trans.from = 'gifts@toypic.club';
		trans.subject = request.payload.from_name + ' sent you a gift!';

		// Add some content to your email

		trans.html = '<html><body style="text-align:center"><h1>' + request.payload.from_name  + ' sent you a gift!</h1><p>Someone loves you and sent you a present!</p><br /><a style="background: yellow ; color: rgb(150, 108, 218) ; padding: 6px 25px ; font-size: 25px ; font-weight: bold ; font-family: "montserrat", arial, sans-serif ; text-decoration: none" href="http://toypic.club/gift/{{present_key}}">Choose your gift</a></body></html>';
		trans.text = 'Someone sent you a gift!\r\nSomeone loves you and sent you a present! Visit the url below to redeem: http://toypic.club/gift/{{present_key}}';

		trans.substitutionData = {present_key: request.payload.redeem_code, from: request.payload.from_name};

		// Pick someone to receive your email
		trans.recipients = [{ address: { name: request.payload.recp_name, email: request.payload.email_to } }];

		// Send it off into the world!
		sparkpost.transmission.send(trans, function(err, res) {
		  if (err) {
		    console.log('Whoops! Something went wrong');
		    console.log(err);
		  } else {
		    console.log('Woohoo! You selected some gifts!! ' + trans.recipients[0].address.email);
		    reply('success!');
		  }
		});
	}
});

server.route({
	method: 'GET',
	path: '/gift/{code}',
	handler: function(request, reply){
		reply.file('gift.html');
	}
});

server.route({
	method: 'POST',
	path: '/gift/{code}/{product_id}',
	handler: function(request, reply){
		console.log(request.params.code);
		console.log(request.params.product_id);
		
		
		fbRef.child('gifts').child(request.params.code).once('value', function(giftSnap){
			fbRef.child('products').child(request.params.product_id).once('value', function(toySnap){
				var trans = {};
				trans.campaign = 'Launch2015';
				trans.from = 'gifts@toypic.club';
				trans.subject = 'Heres the gift to buy!	';	

				// Add some content to your email
				trans.html = '<html><body><h1>The gift has been selected!</h1><a href="' + toySnap.child('url').val() + '">' + toySnap.child('url').val() + '</a></body></html>';
				trans.text = 'The gift has been selected!\r\n' + toySnap.child('url').val() + '\r\nHappy gift giving!';
				//trans.substitutionData = {present_key: request.payload.redeem_code};

				// Pick someone to receive your email
				trans.recipients = [{ address: { name: giftSnap.child('email_from').val() , email: giftSnap.child('email_from').val() } }];

				// Send it off into the world!
				sparkpost.transmission.send(trans, function(err, res) {
				  if (err) {
				    console.log('Whoops! Something went wrong');
				    console.log(err);
				  } else {
				    console.log('Woohoo! Gift selected and emailed! ' + giftSnap.child('email_from').val());
				  }
				});
			});
		});
		reply('success');


	}
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        reply.file('index.html');
    }
});


server.start(function() {
    console.log('Server started: http://' + sOptions.host + ':' + sOptions.port);

    // something to setup the server backbone stuffs
});


