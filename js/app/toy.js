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
			var selectedToys = vref.collection.where({'selected': true});
			var toyTmp = vref.collection.findWhere({id: $(this).data('id') })
			
			if ( selectedToys.length < 9 ){
				
				if ( toyTmp.get('selected') ){
					toyTmp.set('selected', false);
				}else{
					toyTmp.set('selected', true);
				}
				vref.collection.add(toyTmp);
				

				selectedToys = vref.collection.where({'selected': true});

				$('.select9').text('Select ' + (9 - selectedToys.length) + ' gifts for the kid to choose from:');
				vref.render();

				if ( selectedToys.length === 9){
					$('.home-toy-footer').toggle();
					$('html,body').animate({
          				scrollTop: $('.home-toy-footer').offset().top
        			}, 1000);
				}

			}else if ( selectedToys.length === 9 ){
				$('.home-toy-footer').toggle();
				$('html,body').animate({
          			scrollTop: $('.home-toy-footer').offset().top
        		}, 1000);

				if ( toyTmp.get('selected') ){
					toyTmp.set('selected', false);
					selectedToys = vref.collection.where({'selected': true});
					$('.select9').text('Select ' + (9 - selectedToys.length) + ' gifts for the kid to choose from:');
					vref.render();
				}
			}
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