//test various api endpoints
'use strict';


//baby girl cat 
//boys 52355,62837,62838,62839,67054,62840,62841,62843,62842
//girls 55181
//kids 
//kids 62205,59260,62143
///8-10 years 22920
//gadgets 62853
//learning toys 22941

module.exports = {
		search: function( searchTerm, searchCallback ){
			var http = require('http');
			var _ = require('lodash');
			var Firebase = require('firebase');
			var Backbone = require('backbone');
			var Filters = require('../filters.js');

			var Toy = Backbone.Model.extend({
				defaults: {
					name: 'Default',
					image: 'img/teddy.png',
					price: '$100.00',
					provider: 'bestbuy',
					selected: false,
					url: '',
					id: null,
					images:[],
					store:'',
					category:[]
				}
			});
			var ToyCollection = Backbone.Collection.extend({model:Toy});
			var searchResults = new ToyCollection();

			searchResults.on('add',function(model){
				//console.log('added:');
			//	console.log(model.get('cid'));
			});

			var kidsCategories = [
				52355,62837,62838,62839,67054,62840,62841,62843,62842,55181
			];
			var ranCatFlag = 0;

			var macysOutput = function(){
				if('function' === typeof searchCallback){
					console.log('cat flat at ' + ranCatFlag );

					if(ranCatFlag >= (kidsCategories.length-1)){
						searchCallback( searchResults.toJSON() );
					}else{
						console.log('NOT YET! length is: ' + kidsCategories.length);
						//console.log(searchResults);
					}
				}
			};

			var parseMacysCategoryResults = function(results, catId, callback){
				var objectResults = JSON.parse(results);
				var catCheck = objectResults.category || false;
				//console.log(catCheck);
				if(!catCheck){
					console.log('bad data came back, ignoring it');
				}else{

					var productResults = objectResults.category[0].product || [];

					var toypicRef = new Firebase('https://toypic.firebaseio.com/');	
					//NEED SOME SANITY CHECKS HERE

					//console.log(productResults);
					_.forEach(productResults.product, function(obj){
						var prodId = 'macys_' + obj.id;
						//console.log(prodId);

					console.log(obj.summary.producttype);
					console.log(catId);
						//go through array of images
						var allImages = [];
						_.forEach(obj.image,function(d,i){
							var url = d.imageurl || false;
							if( url ){
								allImages.push(url);
							}
						});
						
						//sort pricing
						var price = false;
						var priceCheck = obj.price;
						if(priceCheck.was){
							price = priceCheck.was.value;	
						}
						if(priceCheck.regular){
							price = priceCheck.regular.value;
						}
						if(priceCheck.current){
							price = priceCheck.current.value;
						}
						if(priceCheck.everydayvalue){
							price = priceCheck.everydayvalue.value;
						}
						if(priceCheck.sale){
							price = priceCheck.sale.value;
						}

						var productCategories = Filters.getCategories(catId,'macys') || [];
						//console.log(productCategories);
						if(obj.id && obj.summary.name && price){
							var prodObj = {
								id: prodId,
								name: obj.summary.name,
								image: obj.image[0].imageurl,
								price: price,
								provider: 'macys',
								selected: false,
								url: obj.summary.producturl,
								images: allImages,
								store:'',
								category:productCategories
							};
							
							searchResults.add(prodObj);

							toypicRef.child('products').child(prodId).set(prodObj);	
							for(var catInd in productCategories){
								var catName = productCategories[catInd];
								toypicRef.child('filters').child(catName).child(prodId).set(true);	
							}

						}else{
							console.log('cooodnt add to collection cause it was missing stuff');
							//console.log(priceCheck);
						}
					});

					ranCatFlag++;
					if('function' === typeof callback){
						callback();
					}
				}
			};

/*
			var parseMacysProductResults = function( results, callback ){
				//var resultKeys = _.keys(results);
				var objectResults = JSON.parse(results);

				//console.log(objectResults.searchresultgroups);
				var productOutput = [];
				productResults = objectResults.searchresultgroups[0].products.product;
					
			//	var productsRef = new Firebase('https://toypic.firebaseio.com/products');	
				//NEED SOME SANITY CHECKS HERE
				_.forEach(productResults, function(obj){
					var prodId = 'macys_' + obj.id;
					
					//go through array of images
					var allImages = [];
					_.forEach(obj.image,function(d,i){
						var url = d.imageurl || false;
						if( url ){
							allImages.push(url);
						}
					});

					var prodObj = {
						id: prodId,
						name: obj.summary.name,
						image: obj.image[0].imageurl,
						price: obj.price.regular.value,
						provider: 'macys',
						selected: false,
						url: obj.summary.producturl,
						images: allImages,
						store:'',
						category:[]
					};

					productOutput.push(prodObj);

					productsRef.child(prodId).set(prodObj);	
				});

				if('function' === typeof callback){
					callback(productOutput);
				}
			};

*/

			var runCategorySearch = function( catId ){
				var req = null;

				var macysOptions = {
					hostname: 'api.macys.com',
					path: '/v3/catalog/category/' + catId + '/browseproducts',
					//path:'/v4/catalog/search?searchphrase=' + term,
					headers: {
						'X-Macys-Webservice-Client-Id': 'Launch2015',
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method:'GET'
				};

				console.log(macysOptions.hostname + macysOptions.path);
				var macysCallback = function(response){

					var results ='';
					response.on('data',function(d){
						results += d;
					});

					response.on('end',function(){
						//parseMacysProductResults( results, macysOutput );
						parseMacysCategoryResults( results, catId, macysOutput );
					});
				};

				var reqGet = http.get(macysOptions, macysCallback );
				
				reqGet.on('error',function(err){
					//console.log(err);
				});

				reqGet.end();
			};

/*
			var searchMacys = function( term ){
				var req = null;

				var macysOptions = {
					hostname: 'api.macys.com',
					path: '/v3/catalog/category/62853/browseproducts',
					//path:'/v4/catalog/search?searchphrase=' + term,
					headers: {
						'X-Macys-Webservice-Client-Id': 'Launch2015',
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method:'GET'
				};

				console.log(macysOptions.hostname + macysOptions.path);
				var macysCallback = function(response){

					var results ='';
					response.on('data',function(d){
						results += d;
					});

					response.on('end',function(){
						//parseMacysProductResults( results, macysOutput );
						parseMacysCategoryResults( results, macysOutput );
					});
				};

				var reqGet = http.get(macysOptions, macysCallback );
				
				reqGet.on('error',function(err){
					//console.log(err);
				});

				reqGet.end();
			};
*/

			console.log('search called for: ' + searchTerm);
			for(var catIndex in kidsCategories){
				var catId = kidsCategories[catIndex] || false;
				if( catId ){
					runCategorySearch(catId);
				}
			}
			
		}
};