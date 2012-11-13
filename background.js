
// storing 'loaded' state of scripts per tab
var loadedScripts = {};
// storing a database of all available scripts
var scriptsDB = new Scripts();
scriptsDB.fetch();

function getLoadedScripts(context) {
	if (context.tabId) {
		if (typeof loadedScripts[context.tabId] == "undefined") {
			loadedScripts[context.tabId] = {};
		}
		return loadedScripts[context.tabId];
	}
	throw "Unable to get scripts without a tab id";
}

var API = {
	getLoaded: function(request, sendResponse) {
		sendResponse(getLoadedScripts(request));
	},
	setLoaded: function(request) {
		var loaded = getLoadedScripts(request);
		if (request.script.loaded) {
			loaded[request.script.id] = true;
		} else {
			delete loaded[request.script.id];
		}
	},
	getScripts: function(request, sendResponse) {
		sendResponse(scriptsDB.toJSON());
	},
	addScript: function(request) {
		scriptsDB.add(new Script(request.script));
	}
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (typeof API[request.action] == 'function') {
		API[request.action].call(API, request, sendResponse);
	} else {
		throw "Unable to process request " + request.action;
	}
});

