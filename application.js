var Script = Backbone.Model.extend({
	load: function(callback) {

		var self = this,
			depIds = this.get('dependencies') || [],
			collection = this.collection;

		callback = callback || function() {};

		if (this.get('loaded')) {
			callback(this);
		} else if (collection.getTabId()) {
			// setup the attach script function to fire after all deps have been loaded
			// (+1 for itself)
			var attachScript = _.after(depIds.length + 1, function() {
				chrome.tabs.sendRequest(collection.getTabId(), {
					action: "attachScript",
					params: self.get('src')
				}, function() {
					self.set('loaded', true);
					callback(this);
				});
			});

			// load all dependencies
			_(depIds).each(function(depId) {
				collection.get(depId).load(attachScript);
			});

			// and attach this script
			attachScript();
		}
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

var CDNJSScripts = Scripts.extend({
  url: 'http://api.cdnjs.com/libraries?fields=version,description,homepage',
  parse: function(response) {
    return _.map(response.results, function(data) {
        return {
            id: data.name,
            src: data.latest.replace('http:', ''),
            label: data.name,
            url: data.homepage,
            description: data.description,
            version: data.version
        };
    });
  }
});
