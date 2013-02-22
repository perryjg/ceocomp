$(function() {
	var uri = 'https://www.googleapis.com/fusiontables/v1/query?',
	    sql = 'SELECT * FROM 1blTk47WOEXzoTtQ4tcBrZG2kghsSn76funlZeoE',
	    key = 'AIzaSyBAdk_bBWujZ5QWc89-lVue40LuqZ73fMo',
	    opt = '&alt=csv'

	var src = uri +
	         'sql=' + sql +
	         '&key=' + key +
	          opt;

	response = d3.csv(
		src,
		function(data) {
			var IncomeModel = Backbone.Model.extend({
				initialize: function() {
					this.on( 'change:income', function() {
						this.set('wage', (this.get('income') /52 /40).toFixed(2) );
						//console.log("Income changed");
						ceoList.reset(data);
					});
				}
			});

			var incomeModel = new IncomeModel({
				income: 38780,
				wage: (38780 / 40 / 52).toFixed(2)
			});


			var Ceo = Backbone.Model.extend({
				initialize : function() {
					this.attributes.hourly = accounting.formatMoney( (parseFloat(this.attributes.compensation.replace(/[$,]/g, ''))/52/40).toFixed(2) );
					this.attributes.lifetimes = Math.ceil(parseFloat(this.attributes.compensation.replace(/[$,]/g, ''))/(incomeModel.get('income') * 42));
				}
			});


			var CeoList = Backbone.Collection.extend({
				model: Ceo,
				comparator: function(ceo) {
					return 1 - parseFloat(ceo.get('compensation').replace(/[$,]/g, ''));
				}
			});


			CeoView = Backbone.View.extend({
				tagName: 'article',
				className: 'ceo',
				template: _.template( $("#ceo-tmplt").html() ),
				render: function() {
					var attributes = this.model.toJSON();
					this.$el.html( this.template( attributes ) );
					return this;
				}
			});


			CeoListView = Backbone.View.extend({
				tagName: 'section',
				template: _.template( $("#ceolist-tmpl").html() ),
				initialize: function() {
					this.collection.on('reset', this.addAll, this);
				},
				addAll: function() {
					this.$el.html( this.template( incomeModel.toJSON() ));
					this.collection.forEach( this.addCeo, this );
					//console.log("Collection reset")
				},
				addCeo: function(ceo) {
					var ceoView = new CeoView({ model: ceo });
					this.$el.append(ceoView.render().el);
				},
				render: function() {
					this.addAll();
				}
			});

			var ceoList = new CeoList();
			var ceoListView = new CeoListView({ collection: ceoList });
			ceoList.reset(data);
			$('#content').html( ceoListView.el );


			var IncomeView = Backbone.View.extend({
				id: 'salary_entry',
				template: _.template( 'Enter your <b>annual</b> salary: ' + $("#income-tmplt").html() ),

				events: {
					'keypress .inpt' : 'enterIncome',
					'click .btn'     : 'updateIncome'
				},
				render: function() {
					var attributes = this.model.toJSON();
					this.$el.html( this.template( this.model.toJSON() ) );
					return this;
				},
				updateIncome: function() {
					incomeModel.set({ 'income': this.$('.inpt').val() });
				},
				enterIncome: function(e) {
					if ( e.keyCode ===13 ) {
						//console.log(e.keyCode);
						incomeModel.set({ 'income': this.$('.inpt').val() });
					}
				}
			});

			incomeView = new IncomeView({ model: incomeModel });
			incomeView.render();
			$("div#input").append( incomeView.el );
		}
	);
});
