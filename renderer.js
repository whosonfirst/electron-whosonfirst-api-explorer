// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

const config = require("./mapzen.whosonfirst.config.js");
const api = require("./mapzen.whosonfirst.api.js");
const spec = require("./mapzen.whosonfirst.api.spec.js");
const explorer = require("./mapzen.whosonfirst.api.explorer.js");

api.set_handler('authentication', function(){
	return config.api_key()
});

partyparrot.start("Fetching API data...");

var cb = function(){

	partyparrot.stop();

	explorer.init(api, spec);
	
	var show_m = document.getElementById("show-methods");
	show_m.onclick = function(){ explorer.draw_methods_list(); };

	var show_e = document.getElementById("show-errors");
	show_e.onclick = function(){ explorer.draw_errors_list(); };

	var show_f = document.getElementById("show-formats");
	show_f.onclick = function(){ explorer.draw_formats_list(); };

	show_m.click();
};

spec.init(api, cb);
