var Script = Backbone.Model.extend({
	load: function(loadDev) {

		if (this.get('loaded')) {
			return;
		}

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
			self.set('loaded', true);
		});
	}
}, {
	create: function(attrs) {
		if (!attrs.src) {
			throw "Unable to create a script without a source";
		}
		if (!attrs.label) {
			attrs.label = attrs.src.substring(attrs.src.lastIndexOf('/') + 1);
		}
		if (!attrs.id) {
			attrs.id = attrs.label + (new Date()).getTime();
		}
		return new Script(attrs);
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
