var Script = Backbone.Model.extend({
	load: function(loadDev) {
		
		if (this.get('isLoaded'))
			return;
		
		var m = this;
		
		// process any dependencies
		if (m.attributes.dependencies && m.collection) {
			var collection = m.collection;
			_(m.attributes.dependencies).each(function(dependency) {
				collection.get(dependency).load();
			});
		}
		
		// attach this script to the open tab
		chrome.tabs.sendRequest(m.get('tabId'), {
			action: "attachScript",
			params: loadDev ? m.attributes.src_dev : m.attributes.src
		}, function() {
			m.set('isLoaded', true);
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

