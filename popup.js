$(function() {
	
	var Script = Backbone.Model.extend({
		isLoaded: false,
		isLoadedDev: false,
		load: function(loadDev) {
			
			if (this.isLoaded)
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
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {
					action: "attachScript",
					params: loadDev ? m.attributes.src_dev : m.attributes.src
				}, function() {
					m.isLoaded = true;
					m.trigger('loaded');
				});
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
			
			var label = this.make('span', {title: 'version:' + this.model.get('version')}, this.model.get('label'));
			this.$el.append(label);
			
			if (!this.model.isLoaded) {
				this.$el.append(this.make('a', {'class': 'load f-r'}, 'Load'));
				
				if (this.model.get('src_dev'))
					this.$el.append(this.make('a', {'class': 'loadDev f-r'}, 'Load Dev'));
			} else {
				label.appendChild(this.make('img', {src: 'checkmark.gif'}));
			}
			
			return this;
		},
		load: function() {
			this.model.load(false);
		},
		loadDev: function() {
			this.model.load(true);
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
