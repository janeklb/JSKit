$(function() {
	
	var _scripts = {};
	$.getJSON('scripts.json', function(scripts) { _scripts = scripts; });
	
	function load_script(script_name) {
		var script = _scripts[script_name];
		if (script) {
			
			// process any dependencies
			if (script.dependencies) {
				$(script.dependencies).each(function(i, dependency_name) {
					load_script(dependency_name);
				});
			}
			
			// attach this script to the open tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {
					action: "attachScript",
					params: script
				});
			});
		}
	}

	// attach listeners
	$("#load_button").click(function() {
		var script_name = document.querySelector('#script_name').value;
		load_script(script_name);
	});
});
