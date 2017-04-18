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
				p.appendChild(document.createTextNode(desc));
				
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

			self.clear_main();
			self.draw_sidebar(ul);
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

			self.clear_main();			
			self.draw_sidebar(ul);
		},

		'draw_method': function(name) {

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

			var h3 = document.createElement("h3");
			h3.appendChild(document.createTextNode(name));

			var desc = document.createElement("p");

			root.appendChild(h3);
			root.appendChild(desc);

			var try_me = document.createElement("button");
			try_me.setAttribute("class", "btn btn-default");			
			try_me.setAttribute("data-method-name", name);
			try_me.appendChild(document.createTextNode("Take this API for a spin"));

			try_me.onclick = function(e){
				var el = e.target;
				var method = el.getAttribute("data-method-name");
				self.draw_method_explore(method);
			};
			
			root.appendChild(try_me);

			// parameters
			
			var params_header = document.createElement("h3");
			params_header.appendChild(document.createTextNode("Parameters"));

			root.appendChild(params_header);

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
					
					var param_name = document.createElement("code");
					param_name.appendChild(document.createTextNode(name));

					var param_desc = document.createElement("span");
					param_desc.appendChild(document.createTextNode(desc));
					
					var item = document.createElement("li");
					item.appendChild(param_name);
					item.appendChild(param_desc);					

					params_list.appendChild(item);
				}

				root.appendChild(params_list);
			}

			else {

				var p = document.createElement("p");
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

			// example

			var example_header = document.createElement("h3");
			example_header.appendChild(document.createTextNode("Example request"));
			
			root.appendChild(example_header);

			// try me (again)
			
			root.appendChild(try_me);
		
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
			h2.appendChild(document.createTextNode(name));

			var desc = document.createElement("p");

			root.appendChild(h2);
			root.appendChild(desc);

			var form = document.createElement("form");
			form.setAttribute("id", "explore");
			form.setAttribute("data-method-name", name);
			form.setAttribute("class", "form");
			
			//
			
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
						example.setAttribute("class", "api-param-example");
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

			// 
			
			var submit = document.createElement("button");
			submit.setAttribute("type", "submit");
			submit.setAttribute("class", "btn btn-default");			
			submit.appendChild(document.createTextNode("Make it so!"));

			var onsubmit = function(){
				self.do_method_explore();
				return false;
			};

			submit.onclick = onsubmit;			
			form.onsubmit = onsubmit;
			
			form.appendChild(submit);
			root.appendChild(form);

			self.draw_main(root);
		},

		'do_method_explore': function(){
			
			var form = document.getElementById("explore");
			var data = new FormData(form);

			var method = form.getAttribute("data-method-name");

			var on_success = function(rsp){
				console.log(rsp);
			};

			var on_error = function(){
				console.log("error");
			};

			_api.execute_method(method, data, on_success, on_error);
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
		
	};
	
	return self;
}));
		
