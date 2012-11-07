$(function() {
	
	var ScriptView = Backbone.View.extend({
		tagName: 'li',
		className: 'script',
		events: {
			// bind load buttons
			'click a.load': function() { this.model.load(false); },
			'click a.loadDev': function() { this.model.load(true); }
		},
		initialize: function() {
			// refresh on loaded events
			this.model.on('change:isLoaded', this.render, this);
		},
		render: function() {
			this.$el.empty();
			
			var label = this.make('span', {title: 'version:' + this.model.get('version')}, this.model.get('label'));
			this.$el.append(label);
			
			if (this.model.get('isLoaded')) {
				label.appendChild(this.make('img', {src: 'checkmark.gif'}));
			} else {
				this.$el.append(this.make('a', {'class': 'load f-r'}, 'Load'));
				
				if (this.model.get('src_dev'))
					this.$el.append(this.make('a', {'class': 'loadDev f-r'}, 'Load Dev'));
			}
			
			return this;
		}
	});
	
	var ScriptsView = Backbone.View.extend({
		initialize: function() {

			var that = this;
			
			chrome.tabs.getSelected(null, function(tab) {
				chrome.extension.sendRequest({
					action: "getScripts",
					tab: tab
				},
				function(scripts) {
					that.scripts = new Scripts(scripts, {tabId: tab.id});
					that.scripts.on("change:isLoaded", function() {
						chrome.extension.sendRequest({
							action: "setScripts",
							tab: tab,
							scripts: scripts
						});
					});
					that.render();
				});
			});
		},
		
		render: function() {
			var el = this.el;
			this.$el.empty();
			this.scripts.each(function(script) {
				el.appendChild(new ScriptView({model: script}).render().el);
			});
			return this;
		}
	});
	
	new ScriptsView({el: $('#scripts_list')});
});
