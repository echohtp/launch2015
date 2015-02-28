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
	}
});

var ToyView = Backbone.View.extend({
	template: _.template( $('#template_toy').html() ),
	initialize: function(){
	},
	render: function(){
		this.$el.html( this.template({toy:this.model}) );
		return this.$el.html();
	}
});