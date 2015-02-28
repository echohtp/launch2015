var Hapi = require('hapi');
var Backbone = require('backbone');
var _ = require('lodash');
var Firebase = require('firebase');
var Sendgrid = require('sendgrid');
var Colors = require('colors');

var macys = require('./macys.js');

var sOptions = {
    host: 'localhost',
    port: 2015
};


var server = new Hapi.Server();
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
            // var results = Macys.search(sT);
           // var macysSearch = new Macys();
            macys.search(sT,function(data){
                reply(data);
            });
        }else{
            reply('error, no search term');
        }
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


