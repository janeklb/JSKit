var scriptCollections = {};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var tabId = request.tab.id || sender.tab.id;
	if (request.action == "getScripts") {
		if (typeof scriptCollections[tabId] == "undefined") {
			scriptCollections[tabId] = new Scripts([], {tabId: tabId});
			scriptCollections[tabId].on("reset", function(collection) {
				sendResponse(collection);
			});
			scriptCollections[tabId].fetch();
		} else {
			sendResponse(scriptCollections[tabId]);
		}
	} else if (request.action == "setScripts") {
		if (typeof scriptCollections[tabId] == "undefined") {
			throw new Error("Unable to update script for an undefined collection");
		}

		console.log("setting scripts", request.scripts);
		scriptCollections[tabId] = new Scripts(request.scripts, {tabId: tabId});
	}
});

