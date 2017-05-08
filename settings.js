// https://github.com/nathanbuchar/electron-settings/wiki/API-documentation
const settings = require('electron-settings');

function save_settings(){

	var api_key = document.getElementById("api_key");
	api_key = api_key.value;
	
	var endpoint = document.getElementById("endpoint");
	endpoint = endpoint.value;
	
	var name = document.getElementById("name");
	name = name.value;

	var config = {
		"api_key": api_key,
		"endpoint": endpoint
	};

	settings.set(name, config);
		
	reload_settings();
	return false;
}

function delete_settings(){

	var name = document.getElementById("name");
	name = name.value;

	var msg = "Are you sure you want to remove the API settings named '" + name + "' ?";
	
	if (! confirm(msg)){
		return false;
	}

	settings.delete(name);
	reload_settings();
}

function load_settings(name){
	
	var config = settings.get(name);

	var name_el = document.getElementById("name");
	name_el.setAttribute("disabled", "disabled");
	name_el.value = name;
	
	var endpoint_el = document.getElementById("endpoint");
	endpoint_el.value = config.endpoint;
	
	var key_el = document.getElementById("api_key");		
	key_el.value = config.api_key;	
	
	var delete_button = document.getElementById("settings-remove");
	delete_button.style.display = "inline";

	delete_button.onclick = function(){

		try {
			delete_settings();
		} catch (e) {
			console.log(e);
		}

		return false;
	};
}

function new_settings(){

	var name_el = document.getElementById("name");
	name_el.removeAttribute("disabled");
	name_el.value = "";
	
	var endpoint_el = document.getElementById("endpoint");
	endpoint_el.value = "";
	
	var key_el = document.getElementById("api_key");
	key_el.value = "";	
}

function reload_settings(){

	var all = settings.getAll();
	var configs = [];

	for (name in all){
		configs.push(name);
	}

	configs.sort();

	var count = configs.length;

	var select = document.getElementById("settings-select");
	select.innerHTML = "";

	if (count) {

		for (var i=0; i < count; i++){

			var name = configs[i];

			var option = document.createElement("option");
			option.setAttribute("value", name);
			option.appendChild(document.createTextNode(name));
			
			select.appendChild(option);
			select.onchange = function(e){
				
				var el = e.target;
				var name = el.options[el.selectedIndex].value;
				
				if (name == -1){
					new_settings();
					return;
				}
				
				load_settings(name);
			};
		}

		var option = document.createElement("option");
		option.setAttribute("value", -1);
		option.appendChild(document.createTextNode("create new settings"));
		
		select.appendChild(option);	
		select.style.display = "inline";
		
		load_settings(configs[0]);
	}
	
	else {

		var endpoint_el = document.getElementById("endpoint");
		var name_el = document.getElementById("name");
		
		endpoint_el.value = "https://whosonfirst-api.mapzen.com";
		name_el.value = "default";

		select.style.display = "none";		
	}
	
	var save_button = document.getElementById("settings-save");
	save_button.onclick = function(){

		try {
			save_settings();
		} catch (e) {
			console.log(e);
		}

		return false;
	}
}

reload_settings();
