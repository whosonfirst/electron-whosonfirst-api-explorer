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

	alert("please write me");
	return false;
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
	delete_button.onclick = delete_settings;
	delete_button.style.display = "inline";
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
	var count = 0;

	var select = document.getElementById("settings-select");
	select.innerHTML = "";
	
	for (name in all){

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
		
		count += 1;
	}
	
	if (count){

		var option = document.createElement("option");
		option.setAttribute("value", -1);
		option.appendChild(document.createTextNode("create new settings"));

		select.appendChild(option);
		select.style.display = "inline";
	}
	
	else {

		var endpoint_el = document.getElementById("endpoint");
		var name_el = document.getElementById("name");
		
		endpoint_el.value = "https://whosonfirst-api.mapzen.com";
		name_el.value = "default";
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
