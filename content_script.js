
var API = {
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
			console.log(this);
		};
		target[0].appendChild(scriptEl);

		console.log("attached", script);
	}
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	API._onRequest(request.action, request.params, sendResponse);
});

