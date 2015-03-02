//test various api endpoints
'use strict';
//http://api.remix.bestbuy.com/v1/stores(region=ut)?format=json&show=storeId,city,region&apiKey=YourAPIKey

/*
KIDS AND TEENS
{
id: "abcat0013000",
name: "Teens"
},
{
id: "abcat0014000",
name: "Kids"
},

*/
module.exports = {
		search:  function(searchTerm, searchCallback){

			var http = require('http');
			var _ = require('lodash');
			var Firebase = require('firebase');
			var Filters = require('../filters.js');

			var bestbuyOutput = function(output){
				if('function' === typeof searchCallback){
					searchCallback(output);
				}
			};

			var parseBestBuyResults = function( results,catId, callback ){
				//var resultKeys = _.keys(results);
				var objectResults = JSON.parse(results);

				//console.log(objectResults.searchresultgroups);
				//var productResults = [];
				var productOutput = [];
				var productResults = objectResults.products;
				
				var toypicRef = new Firebase('https://toypic.firebaseio.com');	
				//NEED SOME SANITY CHECKS HERE
				var allCatData = {};
				_.forEach(productResults, function(obj){
					var prodId = 'bestbuy_' + obj.productId;
				//	console.log(obj.categoryPath);
					//go through array of images
					var allImages = [
						obj.image,
						obj.largeFrontImage,
						obj.mediumImage,
						obj.largeImage
					];

					var productCategories = [];
					for(var cat in obj.categoryPath){
						var halfCats = Filters.getCategories( obj.categoryPath[cat].id, 'bestbuy') || [];
						productCategories = _.union(halfCats,productCategories);
					} 
					console.log(prodId);
					var prodObj = {
						id: prodId,
						name: obj.name,
						image: obj.image,
						price: obj.regularPrice,
						provider: 'bestbuy',
						selected: false,
						url: obj.url,
						images: allImages,
						store:'',
						category: productCategories
					};

					productOutput.push(prodObj);

					toypicRef.child('products').child(prodId).set(prodObj);	

					for(var catInd in productCategories){
						var catName = productCategories[catInd];
						console.log('writing to filters:');
						console.log(catName);
						toypicRef.child('filters').child(catName).child(prodId).set(true);	
					}
				});

				if('function' === typeof callback){
					callback(productOutput);
				}
			};

			var searchBestBuy = function( term ){
				var req = null;
				var bestbuyOptions = {
					hostname: 'api.remix.bestbuy.com',
					path:'/v1/products(categoryPath.id=cat02504|categoryPath.id=cat0014000)?format=json&apiKey=9knwkdsgvnta5a4uu8af7y4h&pageSize=20',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method:'GET'
				};

				console.log(bestbuyOptions.hostname + bestbuyOptions.path);

				var bestbuyCallback = function(response){

					var results ='';
					response.on('data',function(d){
						results += d;
					});

					response.on('end',function(){
						parseBestBuyResults(results, bestbuyOutput)
					});
				};

				var reqGet = http.get(bestbuyOptions, bestbuyCallback );
				
				reqGet.on('error',function(err){
					//console.log(err);
				});

				reqGet.end();

			};

			console.log('bestbuy search called for: ' + searchTerm);
			searchBestBuy(searchTerm);
		},
};