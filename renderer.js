const config = require("./mapzen.whosonfirst.config.js");
const api = require("./mapzen.whosonfirst.api.js");
const spec = require("./mapzen.whosonfirst.api.spec.js");
const explorer = require("./mapzen.whosonfirst.api.explorer.js");
const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

api.set_handler('authentication', function(){
	return config.api_key()
});

const ipcRenderer = require('electron').ipcRenderer;

partyparrot.start("fetching API data");

var cb = function(){

	partyparrot.stop();

	explorer.init(api, spec);

	var show_k = document.getElementById("show-key");
	show_k.onclick = function(){ explorer.draw_api_key(); };
	
	var show_m = document.getElementById("show-methods");
	show_m.onclick = function(){ explorer.draw_methods_list(); };

	var show_e = document.getElementById("show-errors");
	show_e.onclick = function(){ explorer.draw_errors_list(); };

	var show_f = document.getElementById("show-formats");
	show_f.onclick = function(){ explorer.draw_formats_list(); };

	var print_b = document.getElementById("print-button");
	print_b.onclick = function(){ ipcRenderer.send('renderer', 'print'); };
	
	show_m.click();
};

spec.init(api, cb);
