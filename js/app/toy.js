console.log('LOADED toy.js');

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

var Toys = Backbone.Collection.extend({
		model: Toy
});

var ToyGallery = Backbone.View.extend({
	initialize: function(){
	},
	render: function(){
		var vref = this;

		vref.$el.html( $('#gallery_view').html() );

		vref.collection.each(function(toy){
			var toyView = new ToyView({model:toy});
			toyView.render();
			vref.$el.append(toyView.$el.html());
		});
		$('.home-search-results').html( vref.$el.html() );

		$(".home-toy").click(function(event){
			console.log('toy click: ' + $(this).data('id'));
			var toyTmp = vref.collection.findWhere({id: $(this).data('id') })
			if ( toyTmp.get('selected') ){
				toyTmp.set('selected', false);
			}else{
				toyTmp.set('selected', true);
			}
			vref.collection.add(toyTmp);
			vref.render();
		});


		$(".gift-toy").click(function(event){
			console.log('toy click: ' + $(this).data('id'));
			
			vref.collection.forEach(function(toy){
				toy.set('selected', false);
			});


			var toyTmp = vref.collection.findWhere({id: $(this).data('id') })
			if ( toyTmp.get('selected') ){
				toyTmp.set('selected', false);
			}else{
				toyTmp.set('selected', true);
			}
			//vref.collection.add(toyTmp);
			vref.$el.empty();
			vref.render();
		});
	}
});

var ToyView = Backbone.View.extend({
	template: _.template( $('#template_toy').html() ),
	initialize: function(){
		this.$el.html( this.template({toy:this.model}) );
	},
	events: {
		"click .home-toy" : "selectToy"
	},
	render: function(){
		
		return this;
	},

	selectToy: function(){
		console.log('a toy was clicked');
	}
});