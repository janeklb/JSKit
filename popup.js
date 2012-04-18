$(function() {
	
	var Script = Backbone.Model.extend();
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
		}
	});
	
	var ScriptView = Backbone.View.extend({
		tagName: 'li',
		className: 'script',
		events: {
			'click a.load': 'load',
			'click a.loadDev': 'loadDev'
		},
		initialize: function() {
			this.model.on('loaded', this.render, this);
		},
		render: function() {
			this.$el.empty();
			
			this.$el.append(this.make('span', {}, this.model.get('label')));
			this.$el.append(this.make('a', {'class': 'load f-r'}, 'Load'));
			
			if (this.model.get('src_dev'))
				this.$el.append(this.make('a', {'class': 'loadDev f-r'}, 'Load Dev'));
			
			return this;
		},
		
		load: function() {
			
			// process any dependencies
			var m = this.model;
				attributes = m.attributes;
			if (attributes.dependencies) {
				var collection = m.collection;
				_(attributes.dependencies).each(function(dependency) {
					console.log(collection.get(dependency));
//					collection.get(dependency).load();
				});
			}
			
			// attach this script to the open tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {
					action: "attachScript",
					params: attributes
				}, function() {
					m.trigger('loaded');
				});
			});
		},
		
		loadDev: function() {
			
		}
	});
	
	var ScriptsView = Backbone.View.extend({
		initialize: function() {
			this.scripts = new Scripts();
			this.scripts.on('reset', this.render, this);
			this.scripts.fetch();
		},
		
		render: function() {
			var $el = this.$el;
			$el.empty();
			this.scripts.each(function(script) {
				$el.append(new ScriptView({model: script}).render().el);
			});
			return this;
		}
	});
	
	
	
	var scriptsView = new ScriptsView({el: $('#scripts_list')});
	
	/*
	$("#load_button").click(function() {
		scriptsView.scripts.fetch();
	});
	*/
});
