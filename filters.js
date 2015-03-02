module.exports = {
	getCategories: function(catId,provider){
		var allCats = [];
		for(var catKey in this.categories){
			var catData = this.categories[catKey];

			//this category id checked against the different filter names
			if( catData.provider[provider].indexOf(catId) >= 0 ){
				if(allCats.indexOf(catKey) < 0){
					allCats.push(catKey);
				}
			}
		}
		return allCats;
	},
	categories:{
		'boy':{
			provider:{
				'bestbuy':[],
				'macys':[]
			},
			name: 'Boy'
		},
		'girl':{
			provider:{
				'bestbuy':[],
				'macys':[]
			},
			name: 'Girl'
		},
		'clothes':{
			provider:{
				'bestbuy':[],
				'macys':[]
			},
			name: 'Clothes'
		},
		'games':{
			provider:{
				'bestbuy':[],
				'macys':[22941,62841,62842,61740]
			},
			name: 'Games'
		},
		'toys':{
			provider:{
				'bestbuy':[],
				'macys':[22941,62841,62842,61740]
			},
			name: 'Toys'		
		},
		'electronics':{
			provider:{
				'bestbuy':[],
				'macys':[62853]
			},
			name: 'Electronics'
		},
		'books':{
			provider:{
				'bestbuy':[],
				'macys':[]
			},
			name: 'Books'
		},
		'music':{
			provider:{
				'bestbuy':[],
				'macys':[]
			},
			name: 'Music'
		},
		'baby':{
			provider:{
				'bestbuy':[],
				'macys':[62843]
			},
			name: 'Baby'	
		}
	}
};