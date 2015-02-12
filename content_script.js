var API = {

	_log: function() {
		var logEntry = ["JSKit"];
		for (var i = 0, l = arguments.length; i < l; i++)
			logEntry.push(arguments[i]);

		console.log.apply(console, logEntry);
	},

	_onRequest: function(action, params, sendResponse) {
		if (typeof action == 'string'
				&& typeof this[action] == 'function') {
			this[action].call(this, params, sendResponse);
		}
	},

	buildJSTag: function(scriptSrc, notifyLoaded) {

		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = scriptSrc;
		scriptEl.onload = function() {
			API._log("loaded", scriptSrc);
			notifyLoaded();
		};
		return scriptEl;
	},

	buildCSSTag: function(scriptSrc, notifyLoaded) {
		var linkEl = document.createElement('link');
		linkEl.type = 'text/css';
		linkEl.rel = 'stylesheet';
		linkEl.href = scriptSrc;
		API._log("loaded", scriptSrc);
		notifyLoaded();
		return linkEl;
	},

	attachScript: function(scriptSrc, notifyLoaded) {
		var target = document.getElementsByTagName('head');
		if (target.length == 0)
			target = document.getElementsByTagName('body');
		if (target.length == 0)
			return;

		var isJS = scriptSrc.split('.').pop().toLowerCase() == 'js';
		var el = this[isJS ? 'buildJSTag' : 'buildCSSTag'](scriptSrc, notifyLoaded);
		target[0].appendChild(el);
	}
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	API._onRequest(request.action, request.params, sendResponse);
});

