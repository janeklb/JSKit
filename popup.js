
var _scripts = {
	jquery: {
		src: "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",
		version: "1.7.2"
	}
};


function load_script() {

	var script_name = document.querySelector('#script_name').value;
	var script = _scripts[script_name];
	if (!script)
		return;

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {action: "attachScript", params: script});
	});
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#load_button').addEventListener('click', load_script);
});

