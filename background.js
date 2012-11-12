var scriptCollections = {};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var tabId = request.tabId;

	if (!tabId) {
	    throw "Unable to determine requesting tab source";
	}

	if (typeof scriptCollections[tabId] == "undefined") {
        scriptCollections[tabId] = new Scripts();
        scriptCollections[tabId].setTabId(tabId);
	}

	if (request.action == "getScripts") {
		if (scriptCollections[tabId].length == 0) {
		    scriptCollections[tabId].on('reset', function() {
		        sendResponse(this.toJSON());
		        scriptCollections[tabId].off('reset');
		    });
			scriptCollections[tabId].fetch();
		} else {
			sendResponse(scriptCollections[tabId].toJSON());
		}
	} else if (request.action == "setScripts") {
        scriptCollections[tabId].reset(request.scripts);
	}
});

