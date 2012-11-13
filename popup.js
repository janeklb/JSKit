$(function() {

	var Filter = Backbone.View.extend({
		events: {
			"keyup": function() {
				var val = this.$el.val().toLowerCase();
				this.options.scripts.each(function(model) {
					var show = val == '' || model.get('label').toLowerCase().indexOf(val) != -1;
					model.trigger('show', show);
				});
			}
		}
	});

	var CustomScript = Backbone.View.extend({
		events: {
			'click a.add': function() {
				this.$('.add-form').show();
				return false;
			},
			'submit form': function(evt) {

				var script = Script.create({ src: this.$('input[name=src]').val() });

				// add this script so that it's accessible across all other pages
				chrome.extension.sendRequest({
					action: "addScript",
					script: script.toJSON()
				});

				this.options.scripts.add(script);

				if (this.$('input[name=autoload]').is(':checked')) {
					script.load();
				}

				evt.target.reset();
				this.$('.add-form').hide();
				return false;
			}
		},
		render: function() {

			var template = '\
<a href="javascript:void(0)" class="add">+ Add Your Own</a>\
<form class="add-form cf">\
	<input type="text" name="src" placeholder="Script URL" />\
	<label><input type="checkbox" selected="selected" name="autoload" />Autoload</label>\
	<input type="submit" value="Add" />\
</form>';
			this.$el.html(template);

			return this;
		}
	});

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
			this.model.on('change:loaded', this.render, this);
			this.model.on('show', function(show) {  this.$el.toggle(show); }, this);
		},
		render: function() {

			var label,
				text = this.model.get('label'),
				version = this.model.get('version');

			if (version) {
				text += ' <em>' + version + '</em>';
			}

			label = this.make('span', { title: this.model.get('src') }, text);

			this.$el.empty()
					.append(label);

			if (this.model.get('loaded')) {
				label.appendChild(this.make('img', {src: 'checkmark.gif'}));
			} else {
				this.$el.append(this.make('a', {'class': 'load f-r'}, 'Load'));

				if (this.model.get('src_dev')) {
					this.$el.append(this.make('a', {'class': 'loadDev f-r'}, 'Load Dev'));
				}
			}

			return this;
		}
	});

	var ScriptsView = Backbone.View.extend({
		initialize: function() {
			this.options.scripts.on('add', this.add, this);
			this.options.scripts.on('reset', this.render, this);
		},
		add: function(script) {
			this.$el.append(new ScriptView({ model: script }).render().el);
		},
		render: function() {
			this.$el.empty();
			this.options.scripts.each(this.add, this);
			return this;
		}
	});

	// Create a Scripts collection
	var scripts = new Scripts();
	// ensure that 'loaded' changes persist in the background
	// so that they can be restored
	scripts.on("change:loaded", function(script, loaded) {
		chrome.extension.sendRequest({
			action: "setLoaded",
			tabId: this.getTabId(),
			script: {
				id: script.id,
				loaded: loaded
			}
		});
	});

	// retrieve all scripts
	chrome.extension.sendRequest({
		action: "getScripts"
	}, function (data) {

		scripts.reset(data);

		// and get the loaded state for this tab
		chrome.tabs.getSelected(null, function(tab) {

			// update the tab for this collection
			scripts.setTabId(tab.id);

			// retrieve the scripts for this tab
			chrome.extension.sendRequest({
				action: "getLoaded",
				tabId: tab.id
			}, function(data) {
				for (var scriptId in data) {
					scripts.get(scriptId).set('loaded', true);
				}
			});
		});
	});

	new Filter({ el: $('#filter'), scripts: scripts }).render();
	new ScriptsView({ el: $('#scripts_list'), scripts: scripts }).render();
	new CustomScript({ el: $('#custom_script'), scripts: scripts }).render();
});
