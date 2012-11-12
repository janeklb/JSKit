var Script = Backbone.Model.extend({
	load: function(loadDev) {

		if (this.get('isLoaded')) return;

		var self = this,
			collection = this.collection;

		// process any dependencies
		_(this.get('dependencies')).each(function(dependency) {
			collection.get(dependency).load();
		});

		// attach this script to the open tab
		chrome.tabs.sendRequest(collection.getTabId(), {
			action: "attachScript",
			params: loadDev ? self.get('src_dev') : self.get('src')
		}, function() {
			self.set('isLoaded', true);
		});
	}
});

var Scripts = Backbone.Collection.extend({
	model: Script,
	url: 'scripts.json',
	parse: function(response) {
		var scripts = [], scriptData;
		for (var id in response) {
			scriptData = response[id];
			scriptData.id = id;
			scripts.push(scriptData);
		}

		return scripts;
	},
	setTabId: function(tabId) {
	    this.tabId = tabId;
	},
	getTabId: function() {
	    return this.tabId;
	}
});
