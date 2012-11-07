var Script = Backbone.Model.extend({
	load: function(loadDev) {

		if (this.get('isLoaded')) return;

		var model = this,
			collection = this.collection;

		// process any dependencies
		_(this.get('dependencies')).each(function(dependency) {
			collection.get(dependency).load();
		});

		// attach this script to the open tab
		chrome.tabs.sendRequest(model.get('tabId'), {
			action: "attachScript",
			params: loadDev ? model.attributes.src_dev : model.attributes.src
		}, function() {
			model.set('isLoaded', true);
		});
	}
});

var Scripts = Backbone.Collection.extend({
	model: Script,
	initialize: function(models, options) {
		this.tabId = options.tabId;
	},
	url: 'scripts.json',
	parse: function(response) {
		var scripts = [], scriptData;
		for (var id in response) {
			scriptData = response[id];
			scriptData.id = id;
			scriptData.tabId = this.tabId;
			scripts.push(scriptData);
		}
		return scripts;
	}
});

