
var API = {
		
	_log: function() {
		if (typeof console != 'undefined') {
			
			var logEntry = ["JSKit"];
			for (var i = 0, l = arguments.length; i < l; i++)
				logEntry.push(arguments[i]);
			
			console.log.apply(console, logEntry);
		}
	},
	
	_onRequest: function(action, params, sendResponse) {
		if (typeof action == 'string' 
				&& typeof this[action] == 'function') {
			this[action].call(this, params, sendResponse);
		}
	},

	attachScript: function(script, callback) {
		var target = document.getElementsByTagName('head');
		if (target.length == 0)
			target = document.getElementsByTagName('body');
		if (target.length == 0)
			return;

		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = script.src;
		scriptEl.onload = function() {
			API._log("loaded", script.label, script.version, script.src);
		};
		target[0].appendChild(scriptEl);
	}
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	API._onRequest(request.action, request.params, sendResponse);
});

