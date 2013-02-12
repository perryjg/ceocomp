$(function() {
	var uri = 'https://www.googleapis.com/fusiontables/v1/query?',
	    sql = 'SELECT * FROM 1blTk47WOEXzoTtQ4tcBrZG2kghsSn76funlZeoE',
	    key = 'AIzaSyBAdk_bBWujZ5QWc89-lVue40LuqZ73fMo',
	    opt = 'alt=csv'

	src = uri +
	     'sql=' + sql +
	     '&key=' + key +
	     '&' + opt;

	response = d3.csv(
		src,
		function(data) {
			var Ceo = Backbone.Model.extend({});
			var CeoList = Backbone.Collection.extend({
				model: Ceo
			});
			ceoList = new CeoList();
			ceoList.reset(data);
			console.log(ceoList);
		}
	);
});
