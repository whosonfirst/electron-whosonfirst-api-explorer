const config = require("./mapzen.whosonfirst.config.js");
const api = require("./mapzen.whosonfirst.api.js");
const spec = require("./mapzen.whosonfirst.api.spec.js");
const explorer = require("./mapzen.whosonfirst.api.explorer.js");
const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

const ipcRenderer = require('electron').ipcRenderer;

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

if (! config.has("api_key")){
	explorer.draw_settings();
	return;
}

partyparrot.start("fetching API data");

var cb = function(){
	partyparrot.stop();
	show_m.click();
};

spec.init(api, cb);

