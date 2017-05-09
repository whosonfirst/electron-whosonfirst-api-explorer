const settings = require('electron').remote.require('electron-settings');

function get_configs(){

	var configs = settings.get("configs");

	if (! configs){
		configs = {};
	}

	return configs;
}

// Y U NO WORK?

function set_named_config(name, config){

	var configs = get_configs();
	configs[name] = config;

	console.log("SET " + name);
	console.log(configs);
	
	settings.set("configs", configs);
}

function get_named_config(name){

	var configs = get_configs();
	return configs[name];
}

function remove_named_config(name){

	var configs = get_configs();
	del(configs[name]);

	settings.set("configs", configs);	
}

function save_settings(){

	var api_key = document.getElementById("api_key");
	api_key = api_key.value;
	
	var endpoint = document.getElementById("endpoint");
	endpoint = endpoint.value;
	
	var name = document.getElementById("name");
	name = name.value;

	api_key = api_key.trim();
	endpoint = endpoint.trim();
	name = name.trim();

	// PLEASE VALIDATE ME HERE...
	
	var config = {
		"api_key": api_key,
		"endpoint": endpoint
	};

	set_named_config(name, config);

	var is_default = document.getElementById("default");

	if (is_default.checked){
		settings.set("default", name);
	}

	else if (settings.get("default") == name){
		settings.set("default", null);
	}

	else {}

	settings.set("current", name);
	
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

	remove_named_config(name);
	reload_settings();
}

function load_settings(name){
	
	var config = get_named_config(name);
	console.log(name);
	console.log(config);
	
	var name_el = document.getElementById("name");
	name_el.setAttribute("disabled", "disabled");
	name_el.value = name;
	
	var endpoint_el = document.getElementById("endpoint");
	endpoint_el.value = config.endpoint;
	
	var key_el = document.getElementById("api_key");		
	key_el.value = config.api_key;	

	var is_default = document.getElementById("default");
	is_default.checked = (settings.get("default") == name) ? true : false;
	
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

	var is_default = document.getElementById("default");
	is_default.checked = false;
}

function reload_settings(){

	console.log("RELOAD");
	
	var configs = get_configs();
	var config_names = [];

	console.log(configs);
	for (name in configs){
		console.log(name);
		config_names.push(name);
	}

	config_names.sort();
	console.log(config_names);

	var default_config = settings.get("default");
	
	var count = config_names.length;

	var select = document.getElementById("settings-select");
	select.innerHTML = "";

	if (count) {

		for (var i=0; i < count; i++){

			var name = config_names[i];

			var option = document.createElement("option");
			option.setAttribute("value", name);
			option.appendChild(document.createTextNode(name));

			if (name == default_config){
				option.setAttribute("selected", "selected");
			}
			
			select.appendChild(option);
			select.onchange = function(e){
				
				var el = e.target;
				var name = el.options[el.selectedIndex].value;
				
				if (name == -1){
					new_settings();
					return;
				}
				
				load_settings(name);

				settings.set("current", name);
			};
		}

		var option = document.createElement("option");
		option.setAttribute("value", -1);
		option.appendChild(document.createTextNode("create new settings"));
		
		select.appendChild(option);	
		select.style.display = "inline";

		if (default_config){
			load_settings(default_config);
		}

		else {
			load_settings(config_names[0]);
		}
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

// console.log(settings.getAll())
