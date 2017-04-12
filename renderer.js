// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const partyparrot = require("./mapzen.whosonfirst.partyparrot.js");

const config = require("./mapzen.whosonfirst.config.js");
const api = require("./mapzen.whosonfirst.api.js");

api.set_handler('authentication', function(){
	return config.api_key()
});

var success = function(rsp){

	partyparrot.stop();
	
	var ul = document.getElementById("methods");

	var methods = rsp["methods"];
	var count = methods.length;

	var lookup = {};
	var names = [];
	
	for (var i=0; i < count; i++) {

		var m = methods[i];
		var name = m["name"];

		lookup[name] = m;
		names.push(name);
	}

	names.sort();

	for (var i = 0; i < count; i++) {

		var name = names[i];

		var m = lookup[name];
		var desc = m["description"];

		var h2 = document.createElement("h2");
		h2.appendChild(document.createTextNode(name));

		var p = document.createElement("p");
		p.appendChild(document.createTextNode(desc));
		
		var li = document.createElement("li");
		li.appendChild(h2);
		li.appendChild(p);

		ul.appendChild(li);
	}
	
	console.log(rsp)
};

var method = "api.spec.methods";
var args = {};

api.execute_method(method, args, success);
partyparrot.start("Fetching API methods...");
