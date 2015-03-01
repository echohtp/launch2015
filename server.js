var Hapi = require('hapi');
var Backbone = require('backbone');
var _ = require('lodash');
var Firebase = require('firebase');
var Colors = require('colors');

var macys = require('./retailers/macys.js');
var bestbuy = require('./retailers/bestbuy.js');

var sparkpost = require('sparkpost')({key: '120e87395578ee692606850f732e756169b85c53'});

var sOptions = {
    host: 'localhost',
    port: 2015
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
    path: '/search/{term}',
    handler: function(request,reply){
        var sT = request.params.term || false;
        if(sT){
            var results = [];
            macys.search(sT,function(mdata){
                console.log('back from macys search');
                bestbuy.search(sT,function(bdata){
                    console.log('back from best buy search');
                    reply(mdata.concat(bdata));
                });
            });
        }else{
            reply('error, no search term');
        }
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
		trans.subject = 'Someone sent you a gift!';

		// Add some content to your email
		trans.html = '<html><body><h1>Someone sent you a gift!</h1><p>Someone loves you and sent you a present! Click the link below to redeem:</p><a href="http://toypic.club/gift/{{present_key}}">http://toypic.club/gift/{{present_key}}</a></body></html>';
		trans.text = 'Someone sent you a gift!\r\nSomeone loves you and sent you a present! Visit the url below to redeem: http://toypic.club/gift/{{present_key}}';
		trans.substitutionData = {present_key: request.payload.redeem_code};

		// Pick someone to receive your email
		trans.recipients = [{ address: { name: request.payload.recp_name, email: request.payload.email_to } }];

		// Send it off into the world!
		sparkpost.transmission.send(trans, function(err, res) {
		  if (err) {
		    console.log('Whoops! Something went wrong');
		    console.log(err);
		  } else {
		    console.log('Woohoo! You selected some gifts!! ' + trans.recipients[0].address.email);
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


