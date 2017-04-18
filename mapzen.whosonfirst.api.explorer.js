(function(f){

        if (typeof exports === "object" && typeof module !== "undefined"){
		module.exports = f();
        }
	
        else if (typeof define === "function" && define.amd){
		define([],f);
        }
	
        else {
		var g;
		
		if (typeof window!=="undefined") {
			g=window;
		} else if (typeof global!=="undefined") {
			g=global;
		} else if (typeof self!=="undefined") {
			g=self;
		} else {
			g=this;
		}
		
        }
	
}(function(){

	var _api = undefined;
	var _spec = undefined;

	var self = {

		'init': function(api, spec) {
			_api = api;
			_spec = spec;
		},
		
		'draw_methods_list': function(){

			self.clear_all();
			
			var methods = _spec.methods();
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

			var ul = document.createElement("ul");
			
			for (var i = 0; i < count; i++) {
				
				var name = names[i];
				
				var m = lookup[name];
				var desc = m["description"];
				
				var h3 = document.createElement("h3");
				h3.setAttribute("data-method-name", name);
				h3.appendChild(document.createTextNode(name));

				h3.onclick = function(e){
					var el = e.target;
					var method = el.getAttribute("data-method-name");
					self.draw_method(method);
				};
					
				var p = document.createElement("p");
				p.setAttribute("class", "try-me");
				p.setAttribute("data-method-name", name);				
				p.appendChild(document.createTextNode(desc));

				p.onclick = function(e){
					var el = e.target;
					var method = el.getAttribute("data-method-name");
					self.draw_method_explore(method);
				};
				
				var li = document.createElement("li");
				li.setAttribute("class", "sidebar-item");
				
				li.appendChild(h3);
				li.appendChild(p);
				
				ul.appendChild(li);
			}

			self.clear_main();
			self.draw_sidebar(ul);
		},

		'draw_errors_list': function(){

			var errors = _spec.errors();
			var count = errors.length;
			
			var ul = document.createElement("ul");
			
			for (var i = 0; i < count; i++) {
				
				var err = errors[i];
				
				var code = err["code"];
				var desc = err["message"];
				
				var h3 = document.createElement("h3");
				h3.setAttribute("data-error-code", code);
				h3.appendChild(document.createTextNode(code));

				h3.onclick = function(e){
					var el = e.target;
					var code = el.getAttribute("data-error-code");

					self.draw_error(code);
				};
					
				var p = document.createElement("p");
				p.appendChild(document.createTextNode(desc));
				
				var li = document.createElement("li");
				li.setAttribute("class", "sidebar-item");
				
				li.appendChild(h3);
				li.appendChild(p);
				
				ul.appendChild(li);
			}

			self.clear_sidebar();
			self.draw_main(ul);
		},

		'draw_formats_list': function(){

			var formats = _spec.formats();
			var count = formats.length;
			
			formats.sort();

			var ul = document.createElement("ul");
			
			for (var i = 0; i < count; i++) {
				
				var name = formats[i];
				
				var h3 = document.createElement("h3");
				h3.setAttribute("data-format-name", name);
				h3.appendChild(document.createTextNode(name));

				h3.onclick = function(e){
					var el = e.target;
					var format = el.getAttribute("data-format-name");
					self.draw_format(format);
				};
					
				var li = document.createElement("li");
				li.setAttribute("class", "sidebar-item");
				
				li.appendChild(h3);				
				ul.appendChild(li);
			}

			self.clear_sidebar();			
			self.draw_main(ul);
		},

		'draw_method': function(method_name) {

			var method = undefined;
			
			var methods = _spec.methods();
			var count = methods.length;

			for (var i=0; i < count; i++) {
				
				var m = methods[i];
				
				if (m["name"] == method_name){
					method = m;
					break;
				}
			}
				
			var root = document.createElement("div");

			var h3 = document.createElement("h3");
			h3.setAttribute("class", "try-me");
			h3.setAttribute("data-method-name", method_name);			
			h3.setAttribute("title", "Take this API method for a spin");
			h3.appendChild(document.createTextNode(method_name));

			/*
			var try_me_top = self.tryme_button(method_name, "");
			h3.appendChild(try_me_top);
			*/

			h3.onclick = function(e){
				var el = e.target;
				var method = el.getAttribute("data-method-name");
				self.draw_method_explore(method);
			};
			
			var desc = document.createElement("p");

			root.appendChild(h3);
			root.appendChild(desc);

			// parameters
			
			var params_header = document.createElement("h3");
			params_header.appendChild(document.createTextNode("Parameters"));
			
			root.appendChild(params_header);

			var params = m["parameters"];
			var params_count = params.length;

			if (params_count){
				
				var params_p = document.createElement("p");
				params_p.setAttribute("class", "caveat");
				params_p.appendChild(document.createTextNode("Required parameters are indicated by a \"*\" following their name."));

				root.appendChild(params_p);
				
				var params_list = document.createElement("ul");

				var params_lookup = {};
				var params_names = [];

				for (var p=0; p < params_count; p++){

					var param = params[p];
					var param_name = param["name"];

					params_lookup[param_name] = param;
					params_names.push(param_name);
				}

				params_names.sort();
				
				for (var p=0; p < params_count; p++){

					var name = params_names[p];
					var param = params_lookup[name];
					
					var desc = param["description"];					
					
					var param_name = document.createElement("code");

					if (param["required"]){
						param_name.setAttribute("class", "api-param-required");
					}
					
					param_name.appendChild(document.createTextNode(name));

					var param_desc = document.createElement("span");
					param_desc.appendChild(document.createTextNode(desc));
					
					var item = document.createElement("li");
					
					item.appendChild(param_name);
					item.appendChild(param_desc);					

					if (param["example"]){

						var example = document.createElement("span");
						example.setAttribute("class", "api-param-example");

						example.appendChild(document.createTextNode(param["example"]));
						item.appendChild(example);
					}
					
					params_list.appendChild(item);
				}

				root.appendChild(params_list);
			}

			else {

				var p = document.createElement("p");
				p.setAttribute("class", "caveat");
				p.appendChild(document.createTextNode("This API method has no parameters."));

				root.appendChild(p);
			}

			// errors
			
			var errors_header = document.createElement("h3");
			errors_header.appendChild(document.createTextNode("Errors"));

			root.appendChild(errors_header);

			var errors = m["errors"];
			var errors_count = errors.length;

			if (errors_count){

				var errors_list = document.createElement("ul");
				
				for (var e=0; e < errors_count; e++){

					var err = errors[e];
					var item = document.createElement("li");

					var code = document.createElement("code");
					code.appendChild(document.createTextNode(err["code"]));

					var desc = document.createElement("span");
					desc.appendChild(document.createTextNode(err["description"]));

					item.appendChild(code);
					item.appendChild(desc);

					errors_list.appendChild(item);
				}

				root.appendChild(errors_list);
			}

			else {

				var msg = "This API method does not define any custom error codes. For the list of error codes common to all API methods please consult the default error codes documentation.";
				
				var p = document.createElement("p");
				p.appendChild(document.createTextNode(msg));

				root.appendChild(p);					
			}

			// notes

			var notes = m["notes"];

			if (notes){
				
				var notes_count = notes.length;

				var notes_header = document.createElement("h3");
				notes_header.appendChild(document.createTextNode("Notes"));

				root.appendChild(notes_header);

				for (var n=0; n < notes_count; n++){

					var note = notes[n];

					var p = document.createElement("p");
					p.appendChild(document.createTextNode(note));

					root.appendChild(p);
				}

				// The following output formats are disallowed for this API method:
			}

			// try me (again)

			var hr = document.createElement("hr");
			root.appendChild(hr);
			
			var try_me_bottom = self.tryme_button(method_name);
			root.appendChild(try_me_bottom);
		
			self.draw_main(root);
		},

		'draw_method_explore': function(name){

			var method = undefined;
			
			var methods = _spec.methods();
			var count = methods.length;

			for (var i=0; i < count; i++) {
				
				var m = methods[i];
				
				if (m["name"] == name){
					method = m;
					break;
				}
			}
				
			var root = document.createElement("div");

			var h2 = document.createElement("h2");
			h2.setAttribute("class", "docs");
			h2.setAttribute("data-method-name", name);
			h2.setAttribute("title", "Return to method documentation");
			
			h2.appendChild(document.createTextNode(name));

			h2.onclick = function(e){
				var el = e.target;
				var method_name = el.getAttribute("data-method-name");
				self.draw_method(method_name);
			};
						
			var desc = document.createElement("p");

			root.appendChild(h2);
			root.appendChild(desc);

			//

			var modify_req = self.modify_button();
			var modify_res = self.modify_button();			
			
			var req = document.createElement("div");
			req.setAttribute("id", "api-request");

			var req_header = document.createElement("h4");
			req_header.appendChild(document.createTextNode("Request"));
			
			var res = document.createElement("div");
			res.setAttribute("id", "api-response");

			var res_header = document.createElement("h4");
			res_header.appendChild(document.createTextNode("Response"));

			req_header.appendChild(modify_req);

			// this should also go _under_ the response
			res_header.appendChild(modify_res);
			
			req.appendChild(req_header);
			res.appendChild(res_header);

			var req_body = document.createElement("pre");
			req_body.setAttribute("id", "api-request-body");

			var res_body = document.createElement("pre");
			res_body.setAttribute("id", "api-response-body");
			
			req.appendChild(req_body);
			res.appendChild(res_body);			

			
			root.appendChild(req);
			root.appendChild(res);			

			//
			
			var form = document.createElement("form");
			form.setAttribute("id", "api-form");
			form.setAttribute("data-method-name", name);
			form.setAttribute("class", "form");
			
			var params = m["parameters"];
			var params_count = params.length;

			if (params_count){
				
				var params_list = document.createElement("ul");

				var params_lookup = {};
				var params_names = [];

				for (var p=0; p < params_count; p++){

					var param = params[p];
					var name = param["name"];

					params_lookup[name] = param;
					params_names.push(name);
				}

				params_names.sort();
				
				for (var p=0; p < params_count; p++){

					var name = params_names[p];
					var param = params_lookup[name];
					
					var desc = param["description"];					

					var group = document.createElement("div");
					group.setAttribute("class", "form-group");

					var label = document.createElement("label");
					label.setAttribute("for", name);
					label.appendChild(document.createTextNode(name));
					
					var input = document.createElement("input");
					input.setAttribute("class", "form-control");					
					input.setAttribute("type", "text");
					input.setAttribute("name", name);
					input.setAttribute("id", "input-" + name);					
					input.setAttribute("value", "");
					input.setAttribute("placeholder", desc);

					group.appendChild(label);
					group.appendChild(input);

					if (param["example"]){
						var example = document.createElement("small");
						example.setAttribute("class", "api-form-example");
						example.setAttribute("data-input-id", name);			

						example.onclick = function(e){
							
							var el = e.target;
							var ex = el.innerText;
							
							var id = "input-" + el.getAttribute("data-input-id");
							var input = document.getElementById(id);
							
							if (input){
								input.setAttribute("value", ex);
							}
						};
					
						example.appendChild(document.createTextNode(param["example"]));
						group.appendChild(example);
					}
					
					form.appendChild(group);
				}
			}

			else {

				var p = document.createElement("p");
				p.appendChild(document.createTextNode("This API method has no parameters."));
				
				form.appendChild(p);
			}

			// 
			
			var submit = document.createElement("button");
			submit.setAttribute("type", "submit");
			submit.setAttribute("class", "btn btn-default make-it-so");			
			submit.appendChild(document.createTextNode("Make it so!"));

			var onsubmit = function(){
				self.do_method_explore();
				return false;
			};

			submit.onclick = onsubmit;			
			form.onsubmit = onsubmit;

			var hr = document.createElement("hr");

			form.appendChild(hr);
			form.appendChild(submit);
			root.appendChild(form);

			self.draw_main(root);
		},

		'do_method_explore': function(){
			
			var form = document.getElementById("api-form");
			var data = new FormData(form);

			var method = form.getAttribute("data-method-name");

			var get_endpoint = _api.get_handler("endpoint");
			var get_auth = _api.get_handler("authentication");
			
			var endpoint = get_endpoint();
			var api_key = get_auth();
			
			var curl = "curl -X GET '" + endpoint;

			var q = [ 
				"method=" + method,
				"api_key=" + "mapzen-xxxxxx",
			];

			for (var pair of data.entries()) {

				if (pair[1] != ""){
					q.push(pair[0] + "=" + pair[1]);
				}
			}

			curl += "?" + q.join("&");
			curl += "'";
			
			var req_body = document.getElementById("api-request-body");
			req_body.appendChild(document.createTextNode(curl));

			var req = document.getElementById("api-request");
			req.style.display = "block";			

			form.style.display = "none";

			if (! navigator.onLine){

				var msg = "Can't execute API request because you are offline.";
			
				var res_body = document.getElementById("api-response-body");
				res_body.appendChild(document.createTextNode(msg));

				var res = document.getElementById("api-response");
				res.style.display = "block";			
				
				return;
			}
			
			var on_response = function(rsp){

				var str = JSON.stringify(rsp, undefined, 2);
				
				var res_body = document.getElementById("api-response-body");
				res_body.appendChild(document.createTextNode(str));

				var res = document.getElementById("api-response");
				res.style.display = "block";			
			};

			_api.execute_method(method, data, on_response, on_response);
		},
		
		'draw_error': function(code){
			console.log("draw code");
		},

		'draw_format': function(format){
			console.log("draw format");
		},
		
		'draw_sidebar': function(list) {

			self.clear_sidebar();
			
			var el = document.getElementById("sidebar");			
			el.appendChild(list);
			return true;
		},

		'draw_main': function(content) {

			self.clear_main();
			
			var el = document.getElementById("main");
			el.appendChild(content);
			return true;			
		},

		'clear_sidebar': function() {
			var el = document.getElementById("sidebar");
			el.innerHTML = "";
		},

		'clear_main': function() {
			var el = document.getElementById("main");
			el.innerHTML = "";
		},

		'clear_all': function(){

			self.clear_sidebar();			
			self.clear_main();
		},

		'tryme_button': function(method, copy){

			if (copy == undefined){
				copy = "Take this API for a spin";
			}
		
			var try_me = document.createElement("button");
			try_me.setAttribute("class", "btn btn-default try-me");			
			try_me.setAttribute("data-method-name", method);
			try_me.appendChild(document.createTextNode(copy));

			try_me.onclick = function(e){
				var el = e.target;
				var method = el.getAttribute("data-method-name");
				self.draw_method_explore(method);
			};

			return try_me;
		},

		'modify_button': function(){

			var modify = document.createElement("button");
			modify.setAttribute("class", "btn btn-default btn-sm modify-me");
			modify.appendChild(document.createTextNode("modify this request"));

			modify.onclick = function(){

				var req = document.getElementById("api-request");
				var res = document.getElementById("api-response");
				var form = document.getElementById("api-form");

				var req_body = document.getElementById("api-request-body");
				var res_body = document.getElementById("api-response-body");
				
				req_body.innerHTML = "";
				res_body.innerHTML = "";

				req.style.display = "none";
				res.style.display = "none";

				form.style.display = "block";
			};

			return modify;
		},
	};
	
	return self;
}));
		
