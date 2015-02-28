//test various api endpoints
'use strict';

module.exports = {
		search: function( searchTerm, searchCallback ){
			//var OAuth = require('oauth');
			var http = require('http');
			var _ = require('lodash');

			// var oauth = new OAuth.OAuth(
			//   'http://api.macys.com/',
			//   'http://api.macys.com/',
			//   'Launch2015',
			//   'Launch2015',
			//   '1.0A',
			//   null,
			//   'HMAC-SHA1'
			// );

			var macysOutput = function(output){
				console.log(output);
				if('function' === typeof searchCallback){
					searchCallback(output);
				}
			};

			var parseMacysResults = function( results, callback ){
				//var resultKeys = _.keys(results);
				var objectResults = JSON.parse(results);

				//console.log(objectResults.searchresultgroups);
				//var productResults = [];
				var productOutput = [];
				var productResults = objectResults.searchresultgroups[0].products.product;
				
				_.forEach(productResults, function(obj){
					
					var prodObj = {
						name: obj.summary.name,
						image: obj.image[0].imageurl,
						price: obj.price.regular.value,
						provider: 'macys',
						selected: false,
						url: obj.summary.producturl,
						images:[obj.image[0].imageurl],
						store:'',
						category:[]
					};

					productOutput.push(prodObj);
				});
				
				if('function' === typeof callback){
					callback(productOutput);
				}
			};

			var searchMacys = function( term ){
				var req = null;

				var macysOptions = {
					hostname: 'api.macys.com',
					path:'/v4/catalog/search?searchphrase=' + term,
					headers: {
						'X-Macys-Webservice-Client-Id': 'Launch2015',
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method:'GET'
				};

				var macysCallback = function(response){

					var results ='';
					response.on('data',function(d){
						results += d;
					});

					response.on('end',function(){
						parseMacysResults( results, macysOutput );
					});
				};

				var reqGet = http.get(macysOptions, macysCallback );
				
				reqGet.on('error',function(err){
					//console.log(err);
				});

				reqGet.end();

			};

			console.log('search called for: ' + searchTerm);
			searchMacys(searchTerm);
		}
};