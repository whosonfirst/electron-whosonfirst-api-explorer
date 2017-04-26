const config = require("./mapzen.whosonfirst.api.config.js");
const api = require("./mapzen.whosonfirst.api.js");
const spec = require("./mapzen.whosonfirst.api.spec.js");

const explorer = require("./mapzen.whosonfirst.api.explorer.js");
const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

const ipcRenderer = require('electron').ipcRenderer;

const electron = require('electron');
const app = electron.app || electron.remote.app;
const udata = app.getPath("userData");

window.addEventListener("offline", function(e){
	var el = document.getElementById("network-status");
	el.setAttribute("class", "offline");
});

window.addEventListener("online", function(e){
	var el = document.getElementById("network-status");
	el.setAttribute("class", "online");
});

config.init(udata);
explorer.init(config, api, spec);

var show_s = document.getElementById("show-settings");
show_s.onclick = function(){ explorer.draw_settings(); };
	
var show_m = document.getElementById("show-methods");
show_m.onclick = function(){ explorer.draw_methods_list(); };

var show_e = document.getElementById("show-errors");
show_e.onclick = function(){ explorer.draw_errors_list(); };

var show_f = document.getElementById("show-formats");
show_f.onclick = function(){ explorer.draw_formats_list(); };

var print_b = document.getElementById("print-button");
print_b.onclick = function(){ ipcRenderer.send('renderer', 'print'); };

if (config.has("api_key")){

	api.set_handler('authentication', function(){
		return config.get("api_key");
	});	
}

else {

	var el = document.getElementById("show-settings");
	explorer.add_warning(el);
}

partyparrot.start("fetching API data");

var cb = function(){
	
	partyparrot.stop();

	if (spec.loaded()){
		show_m.click();
		return;
	}

	if (! config.has("api_key")){
		explorer.draw_settings();
		return;
	}

	alert("INVISIBLE ERROR CAT HISSES AT YOU. HISSSSSS. HISSSSSSSSSSSSSS");
};

spec.init(api, cb);

