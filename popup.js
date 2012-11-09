$(function() {

    var Filter = Backbone.View.extend({
        events: {
            "keyup": function() {
                var val = this.$el.val().toLowerCase();
                console.log('keyup triggered', val == '');
                this.options.collection.each(function(model) {
                    var show = val == '' || model.get('label').toLowerCase().indexOf(val) != -1;
                    model.trigger('show', show);
                });
            }
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
			this.model.on('change:isLoaded', this.render, this);
			this.model.on('show', function(show) {  this.$el.toggle(show); }, this);
		},
		render: function() {
			this.$el.empty();

			var label = this.make('span', {}, this.model.get('label') + ' <em>' + this.model.get('version') + '</em>');
			this.$el.append(label);

			if (this.model.get('isLoaded')) {
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
		    _.bindAll(this, 'setScripts', 'loadTab');
			chrome.tabs.getSelected(null, this.loadTab);
		},

		loadTab: function(tab) {

		    this.scripts = new Scripts([], {tabId: tab.id});
		    this.scripts.on("change:isLoaded", function() {
                chrome.extension.sendRequest({
                    action: "setScripts",
                    tab: tab,
                    scripts: this.toJSON()
                });
            });
            chrome.extension.sendRequest({
                action: "getScripts",
                tab: tab
            }, this.setScripts);

            // hook up the filter
            this.filter = new Filter({
                el: $('#filter'),
                collection: this.scripts
            });
		},

		setScripts: function(scripts) {
		    this.scripts.reset(scripts);
            this.render();
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
	console.log('loaded!');
});
