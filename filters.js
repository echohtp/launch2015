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
				'macys':[52355,62837,62838,62839,67054,62840,62841,62843,62842]
			},
			name: 'Boy'
		},
		'girl':{
			provider:{
				'bestbuy':[],
				'macys':[55181]
			},
			name: 'Girl'
		},
		'clothes':{
			provider:{
				'bestbuy':[],
				'macys':[62205,59260,62143,22920,62838,62839,62837,52355,67054,62840,55181]
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
				'bestbuy':['cat02001','abcat0600000','cat02504','cat0014000'],
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