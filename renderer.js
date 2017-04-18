const config = require("./mapzen.whosonfirst.config.js");
const api = require("./mapzen.whosonfirst.api.js");
const spec = require("./mapzen.whosonfirst.api.spec.js");
const explorer = require("./mapzen.whosonfirst.api.explorer.js");
const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

/*

https://medium.com/@ccnokes/how-to-securely-store-sensitive-information-in-electron-with-node-keytar-51af99f1cfc4
https://github.com/atom/node-keytar

Sigh... (20170418/thisisaaronland)

Uncaught Error: The module
'electron-whosonfirst-api-explorer/node_modules/keytar/build/Release/keytar.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 51. This version of Node.js requires
NODE_MODULE_VERSION 53. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or`npm install`).

const keytar = require('keytar')	
api_key = keytar.getPassword("whosonfirst", "api_explorer")
*/

api.set_handler('authentication', function(){
	return config.api_key()
});

partyparrot.start("fetching API data");

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
