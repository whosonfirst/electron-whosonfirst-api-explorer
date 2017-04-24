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

	var _parrot = require("./mapzen.whosonfirst.partyparrot.js");
	
	var self = {

		'init': function(api, spec) {
			_api = api;
			_spec = spec;
		},

		'draw_settings': function(){

			self.clear_all();
			self.toggle_print_button(false);

			var root = document.createElement("div");
			
			var h3 = document.createElement("h3");
			h3.appendChild(document.createTextNode("API Explorer Settings"));
			root.appendChild(h3);

			var p = document.createElement("p");
			p.appendChild(document.createTextNode("THIS DOES NOT WORK YET"));
			root.appendChild(p);
			
			
			var form = document.createElement("form");
			form.setAttribute("id", "key-form");

			var key_group = self.input_group_prefs("API key", "api_key", "mapzen-xxxxxx", "");
			form.appendChild(key_group);

			var ep_group = self.input_group_prefs("API endpoint", "api_endpoint", "https://whosonfirst-api.mapzen.com", "https://whosonfirst-api.mapzen.com");
			form.appendChild(ep_group);
			
			var submit = document.createElement("button");
			submit.setAttribute("type", "submit");
			submit.setAttribute("class", "btn btn-default submit-button");			
			submit.appendChild(document.createTextNode("Save"));

			var onsubmit = function(){
				// https://github.com/whosonfirst/electron-whosonfirst-api-explorer/issues/12
				alert("please implement me");
				return false;
			};

			submit.onclick = onsubmit;
			form.onsubmit = onsubmit;

			// to do add a remove key button
			
			form.appendChild(submit);
			
			root.appendChild(form);
			
			self.draw_main(root);
		},
		
		'draw_methods_list': function(){
			
			self.toggle_print_button(false);
			
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

			var root = document.createElement("div");
			root.appendChild(ul);
			
			var reload = self.reload_button(self.draw_methods_list);
			reload.setAttribute("title", "reload API methods");
			root.appendChild(reload);

			self.clear_all();			
			self.draw_sidebar(root);
		},

		'draw_errors_list': function(){

			self.toggle_print_button(false);
			
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

				/*
				h3.onclick = function(e){
					var el = e.target;
					var code = el.getAttribute("data-error-code");

					self.draw_error(code);
				};
				*/
				
				var p = document.createElement("p");
				p.appendChild(document.createTextNode(desc));
				
				var li = document.createElement("li");
				li.setAttribute("class", "sidebar-item");
				
				li.appendChild(h3);
				li.appendChild(p);
				
				ul.appendChild(li);
			}

			var root = document.createElement("div");
			root.appendChild(ul);
			
			var reload = self.reload_button(self.draw_errors_list);
			reload.setAttribute("title", "reload API errors");
			root.appendChild(reload);

			self.clear_sidebar();			
			self.draw_main(root);
		},

		'draw_formats_list': function(){

			self.toggle_print_button(false);
			
			var formats = _spec.formats();
			var count = formats.length;
			
			formats.sort();

			var ul = document.createElement("ul");
			
			for (var i = 0; i < count; i++) {
				
				var name = formats[i];
				
				var h3 = document.createElement("h3");
				h3.setAttribute("data-format-name", name);
				h3.appendChild(document.createTextNode(name));
				
				var li = document.createElement("li");
				li.setAttribute("class", "sidebar-item");
				
				li.appendChild(h3);				
				ul.appendChild(li);
			}

			self.clear_sidebar();

			var root = document.createElement("div");
			root.appendChild(ul);
			
			var reload = self.reload_button(self.draw_formats_list);
			reload.setAttribute("title", "reload API formats");
			root.appendChild(reload);
			
			self.draw_main(root);
		},

		'draw_method': function(method_name) {

			self.toggle_print_button(true);
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
			
			var required_header = document.createElement("h4");
			required_header.appendChild(document.createTextNode("Required parameters"));

			root.appendChild(required_header);
			
			var required_table = self.params_table();

			// We need to do this to prevent m["parameters"] from being updated
			// globally and printing the 'method' and 'api_key' parameters in
			// explore mode. I don't love it either... (20170422/thisisaaronland)
			
			var params = new Array();
			var _count = m["parameters"].length;

			if (_count){
			
				for (var c = 0; c <= _count; c++){

					// Why do I need to do this?
					
					var p = m["parameters"][c];
					console.log(p);
					
					if (p){
						params.push(p);
					}
				}		
			}
			
			// these should be returned as part of the API response itself
			
			params.push({"name": "method", "description": "The name of the API method.", "example": method_name, "required": true});
			params.push({"name": "api_key", "description": "A valid API key.", "example": "mapzen-xxxxxx", "required": true});			
				    
			var params_count = params.length;
		
			var required_params_lookup = {};
			var required_params_names = [];
			var required_params_count = 0;
			
			var optional_params_lookup = {};
			var optional_params_names = [];
			var optional_params_count = 0;
			
			if (params_count){
				
				for (var p=0; p < params_count; p++){

					var param = params[p];
					var param_name = param["name"];

					if (param["required"]){
						required_params_lookup[param_name] = param;
						required_params_names.push(param_name);
					}

					else {
						optional_params_lookup[param_name] = param;
						optional_params_names.push(param_name);
					}
				}

				required_params_names.sort();
				optional_params_names.sort();				

				required_params_count = required_params_names.length;				
				optional_params_count = optional_params_names.length;
			}

			if (required_params_count){
				
				for (var p=0; p < required_params_count; p++){

					var name = required_params_names[p];
					var param = required_params_lookup[name];		

					var param_row = self.table_row(name, param["description"], param["example"], param["required"]);
					required_table.appendChild(param_row);
				}
			}
			
			root.appendChild(required_table);

			if (optional_params_count){
					
				var optional_header = document.createElement("h4");
				optional_header.appendChild(document.createTextNode("Optional parameters"));
				
				root.appendChild(optional_header);
				
				var optional_table = self.params_table();
				
				for (var p=0; p < optional_params_count; p++){
					
					var name = optional_params_names[p];
					var param = optional_params_lookup[name];		
					
					var param_row = self.table_row(name, param["description"], param["example"], param["required"]);
					optional_table.appendChild(param_row);
				}
				
				root.appendChild(optional_table);					
			}

			// this: https://github.com/whosonfirst/electron-whosonfirst-api-explorer/issues/20
			
			var common_header = document.createElement("h4");
			common_header.appendChild(document.createTextNode("Common parameters"));

			root.appendChild(common_header);
			
			var common_table = self.params_table();
			
			// extras

			if (method["extras"]){

				var extras_row = self.table_row("extras","A comma-separated list of extra properties to include with each response.", "wof:path,mz:uri,name:", false);
				common_table.appendChild(extras_row);
			}

			// pagination

			if ((method["paginated"]) && (method["pagination"] == "cursor")){

				var cursor_row = self.table_row("cursor", "A valid API pagination cursor.", "", false);
				common_table.appendChild(cursor_row);

				var perpage_row = self.table_row("per_page", "The number of results to return per page.", 10, false);
				common_table.appendChild(perpage_row);
			}

			else if ((method["paginated"]) && (method["pagination"] == "mixed")){

				var cursor_row = self.table_row("cursor", "A valid API pagination cursor.", "", false);
				common_table.appendChild(cursor_row);

				var page_row = self.table_row("page", "The page of results to return.", 1, false);
				common_table.appendChild(page_row);

				var perpage_row = self.table_row("per_page", "The number of results to return per page.", 10, false);
				common_table.appendChild(perpage_row);				
			}

			else if (method["paginated"]){

				var page_row = self.table_row("page", "The page of results to return.", 1, false);
				common_table.appendChild(page_row);

				var perpage_row = self.table_row("per_page", "The number of results to return per page.", 10, false);
				common_table.appendChild(perpage_row);				
			}

			else {}

			// format

			var format_desc = document.createElement("div");
			format_desc.appendChild(document.createTextNode("How you'd like API responses to be formatted."));		

			if ((method["disallow_formats"]) && (method["disallow_formats"].length)){

				var disallow = method["disallow_formats"];
				var disallow_count = disallow.length;
				
				format_desc.appendChild(document.createTextNode(" The following output formats are disallowed for this API method: "));
				
				var list = document.createElement("ul");
				list.setAttribute("class", "list-inline disallowed-formats");
				
				for (var d=0; d < disallow_count; d++){

					var fmt = disallow[d];
					item = document.createElement("li");
					item.appendChild(document.createTextNode(fmt));
					list.appendChild(item);
				}
				
				format_desc.appendChild(list);
			}

			format_desc.appendChild(document.createTextNode(" The default format is "));
			
			var span = document.createElement("span");
			span.setAttribute("class", "default-format");
			span.appendChild(document.createTextNode(_spec.default_format()));

			format_desc.appendChild(span);
			format_desc.appendChild(document.createTextNode("."));

			var format_row = self.table_row("format", format_desc, _spec.default_format(), false);
			common_table.appendChild(format_row);

			root.appendChild(common_table);
			
			// errors
			
			var errors_header = document.createElement("h3");
			errors_header.appendChild(document.createTextNode("Errors"));

			root.appendChild(errors_header);

			var errors = m["errors"];
			var errors_count = 0;

			for (var k in errors){
				errors_count = 1;
				break;
			}
			
			if (errors_count){

				var errors_table = document.createElement("table");
				errors_table.setAttribute("class", "table");

				var errors_header = document.createElement("tr");

				var code_header = document.createElement("th");
				code_header.appendChild(document.createTextNode("Code"));

				var desc_header = document.createElement("th");
				desc_header.appendChild(document.createTextNode("Description"));

				errors_header.appendChild(code_header);
				errors_header.appendChild(desc_header);				

				errors_table.appendChild(errors_header);
				
				for (var code in errors){

					var details = errors[code];

					var row = document.createElement("tr");
					
					var code_cell = document.createElement("td");
					code_cell.setAttribute("class", "api-error-code");					
					code_cell.appendChild(document.createTextNode(code));

					var desc_cell = document.createElement("td");
					desc_cell.appendChild(document.createTextNode(details["message"]));

					row.appendChild(code_cell);
					row.appendChild(desc_cell);

					errors_table.appendChild(row);
				}

				var button = document.createElement("button");
				button.setAttribute("class", "btn btn-default btn-sm error-codes");				
				button.appendChild(document.createTextNode("common error codes"));

				button.onclick = function(){
					self.draw_errors_list();
				};
				
				var p = document.createElement("p");
				p.appendChild(document.createTextNode("In addition to the "));
				p.appendChild(button);
				p.appendChild(document.createTextNode(" this API method defines the following custom error responses:"));

				root.appendChild(p);
				root.appendChild(errors_table);
			}

			else {

				var button = document.createElement("button");
				button.setAttribute("class", "btn btn-default btn-sm error-codes");
				button.appendChild(document.createTextNode("default error codes"));

				button.onclick = function(){
					self.draw_errors_list();
				};
				
				var p = document.createElement("p");
				p.appendChild(document.createTextNode("This API method does not define any custom error codes. For the list of error codes common to all API methods please consult the "));
				p.appendChild(button);
				p.appendChild(document.createTextNode(" documentation."));

				
				root.appendChild(p);					
			}

			// notes

			var has_notes = false;
			
			var notes = m["notes"];
			var disallow = m["disallow_formats"];			
						
			if ((notes) || (disallow)){

				// this kind of hoop-jumping should not be necessary
				// but still is because... computers?
				
				var notes_count = (notes) ? notes.length : 0;
				var disallow_count = (disallow) ? disallow.length : 0;

				// see above inre: hoop-jumping
				
				if ((notes_count) || (disallow_count)){
									
					var notes_header = document.createElement("h3");
					notes_header.appendChild(document.createTextNode("Notes"));
					
					root.appendChild(notes_header);
					
					for (var n=0; n < notes_count; n++){
						
						var note = notes[n];
						
						var p = document.createElement("p");
						p.appendChild(document.createTextNode(note));
						root.appendChild(p);
					}

					if (disallow_count){

						var p = document.createElement("p");
						
						p.appendChild(document.createTextNode("The following output formats are disallowed for this API method: "));
						
						var list = document.createElement("ul");
						list.setAttribute("class", "list-inline disallowed-formats");
						
						for (var d=0; d < disallow_count; d++){
							var fmt = disallow[d];
							item = document.createElement("li");
							item.appendChild(document.createTextNode(fmt));
							list.appendChild(item);
						}

						p.appendChild(list);
						root.appendChild(p);
					}
				}
			}

			// try me (again)

			// var hr = document.createElement("hr");
			// root.appendChild(hr);
			
			var try_me_bottom = self.tryme_button(method_name);
			try_me_bottom.setAttribute("class", try_me_bottom.getAttribute("class") + " try-me-bottom");
			root.appendChild(try_me_bottom);
		
			self.draw_main(root);
		},

		'draw_method_explore': function(name){

			self.toggle_print_button(false);
			
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

			var required_params_lookup = {};
			var required_params_names = [];
			var required_params_count = 0;
			
			var optional_params_lookup = {};
			var optional_params_names = [];
			var optional_params_count = 0;
			
			if (params_count){
				
				for (var p=0; p < params_count; p++){

					var param = params[p];
					var param_name = param["name"];

					if (param["required"]){
						required_params_lookup[param_name] = param;
						required_params_names.push(param_name);
					}

					else {
						optional_params_lookup[param_name] = param;
						optional_params_names.push(param_name);
					}
				}

				required_params_names.sort();
				optional_params_names.sort();				

				required_params_count = required_params_names.length;				
				optional_params_count = optional_params_names.length;
			}
			
			if (required_params_count){

				h4 = document.createElement("h4");
				h4.appendChild(document.createTextNode("Required parameters"));
				form.appendChild(h4);
								
				for (var p=0; p < required_params_count; p++){

					var name = required_params_names[p];
					var param = required_params_lookup[name];
					
					var desc = param["description"];					

					var group = self.input_group(name, desc, param["example"], param["required"]);
					form.appendChild(group);
				}
			}

			if (optional_params_count){

				h4 = document.createElement("h4");
				h4.appendChild(document.createTextNode("Optional parameters"));
				form.appendChild(h4);
								
				for (var p=0; p < optional_params_count; p++){

					var name = optional_params_names[p];
					var param = optional_params_lookup[name];
					
					var desc = param["description"];					

					var group = self.input_group(name, desc, param["example"], param["required"]);
					form.appendChild(group);
				}
			}
			
			h4 = document.createElement("h4");
			h4.appendChild(document.createTextNode("Common parameters"));
			form.appendChild(h4);
			
			// extras

			if (method["extras"]){

				var group = self.input_group("extras", "A comma-separated list of extra properties to include with each response.", "mz:uri", false);
				form.appendChild(group);				
			}

			// pagination

			if ((method["paginated"]) && (method["pagination"] == "cursor")){

				var cursor_group = self.input_group("cursor", "A valid API pagination cursor.", "", false);
				form.appendChild(cursor_group);				
			}

			else if ((method["paginated"]) && (method["pagination"] == "mixed")){

				var cursor_group = self.input_group("cursor", "A valid API pagination cursor.", "", false);
				form.appendChild(cursor_group);				

				var page_group = self.input_group("page", "The page of results to return.", 1, false);
				form.appendChild(page_group);				

				var perpage_group = self.input_group("per_page", "The number of results to return per page.", 10, false);
				form.appendChild(perpage_group);
			}

			else if (method["paginated"]){

				var page_group = self.input_group("page", "The page of results to return.", 1, false);
				form.appendChild(page_group);				

				var perpage_group = self.input_group("per_page", "The number of results to return per page.", 10, false);
				form.appendChild(perpage_group);
			}

			else {}

			// format

			var group = document.createElement("div");
			group.setAttribute("class", "form-group");
			
			var label = document.createElement("label");
			label.setAttribute("for", "format");
			label.appendChild(document.createTextNode("format"));
								
			var select = document.createElement("select");
			select.setAttribute("name", "format");
			select.setAttribute("id", "format");			
			select.setAttribute("class", "form-control");

			var formats = _spec.formats();
			var count = formats.length;
			
			var disallow_count = (method["disallow_formats"]) ? method["disallow_formats"].length : 0;
			
			formats.sort();
			
			for (var i = 0; i < count; i++) {
				
				var fmt = formats[i];
				
				if (disallow_count){

					var disallow = false;

					for (var d=0; d < disallow_count; d++){

						if (method["disallow_formats"][d] == fmt){
							disallow = true;
							break;
						}
					}

					if (disallow){
						continue;
					}
				}
				
				var option = document.createElement("option");
				option.setAttribute("value", fmt);
				
				if (fmt == _spec.default_format()){
					option.setAttribute("selected", "selected");
				}
				
				option.appendChild(document.createTextNode(fmt));
				select.appendChild(option);
			}
			
			group.appendChild(label);
			group.appendChild(select);

			form.append(group);
			
			// 
			
			var submit = document.createElement("button");
			submit.setAttribute("type", "submit");
			submit.setAttribute("class", "btn btn-default make-it-so submit-button");			
			submit.appendChild(document.createTextNode("Make it so!"));

			var onsubmit = function(){
				self.do_method_explore();
				return false;
			};

			submit.onclick = onsubmit;			
			form.onsubmit = onsubmit;

			// var hr = document.createElement("hr");
			// form.appendChild(hr);
			
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

				var msg = "Can't execute API request because the Internets are not available.";
			
				var res_body = document.getElementById("api-response-body");
				res_body.appendChild(document.createTextNode(msg));

				var res = document.getElementById("api-response");
				res.style.display = "block";			
				
				return;
			}
			
			var on_response = function(rsp){

				_parrot.stop();
				self.toggle_print_button(true);

				var str = JSON.stringify(rsp, undefined, 2);
				
				var res_body = document.getElementById("api-response-body");
				res_body.appendChild(document.createTextNode(str));

				var res = document.getElementById("api-response");
				res.style.display = "block";			
			};

			var  m = _api.method(method);
			
			_api.execute_method(m, data, on_response, on_response);

			_parrot.start("invoking " + method);
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
			try_me.setAttribute("class", "btn btn-default try-me submit-button");
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

				self.toggle_print_button(false);				
			};

			return modify;
		},

		'toggle_print_button': function(enabled){

			var display = (enabled) ? "inline" : "none";

			var el = document.getElementById("print-button");
			el.style.display = display;
		},

		'reload_button': function(cb){

			var button = document.createElement("button");
			button.setAttribute("class", "btn btn-sm reload-button");
			button.appendChild(document.createTextNode("Reload"))

			button.onclick = function(cb){

				if (! navigator.onLine){
					alert("Unable to reload API data because the Internets are unavailable.");
					return false;
					
				}

				_parrot.start("Reloading API data");
				
				_spec.init(_api, function(cb){
					_parrot.stop();

					_parrot.start("API data successfully updated");

					setTimeout(function(){
						_parrot.stop();
					}, 1500);
					
					cb();
				});
				
				return true;
			};

			return button;
		},

		'params_table': function(){

			var table = document.createElement("table");
			table.setAttribute("class", "table table-condensed");
			
			var name_header = document.createElement("th");
			name_header.appendChild(document.createTextNode("Name"));
			
			var desc_header = document.createElement("th");
			desc_header.appendChild(document.createTextNode("Description"));
			
			var example_header = document.createElement("th");
			example_header.appendChild(document.createTextNode("Example"));
			
			var required_header = document.createElement("th");
			required_header.appendChild(document.createTextNode("Required"));
			
			var header_row = document.createElement("tr");
			header_row.appendChild(name_header);
			header_row.appendChild(desc_header);
			header_row.appendChild(example_header);
			header_row.appendChild(required_header);				
			
			table.appendChild(header_row);
			return table;
		},
		
		'table_row': function(name, desc, example, required){

			var name_cell = document.createElement("td");
			name_cell.setAttribute("class", "api-param-name");
			name_cell.appendChild(document.createTextNode(name));

			console.log(typeof(desc));
			
			var desc_cell = document.createElement("td");

			if (typeof(desc) == "string"){
				desc_cell.appendChild(document.createTextNode(desc));
			}

			else {

				console.log(desc);
				console.log("WHAT WHAT");
				desc_cell.appendChild(desc);
			}
			
			var example_cell = document.createElement("td");
			example_cell.setAttribute("class", "api-param-example");
			
			example_cell.appendChild(document.createTextNode(example));
			
			var required_cell = document.createElement("td");

			if (required){
				required_cell.appendChild(document.createTextNode("👍"));
			}

			else {
				required_cell.appendChild(document.createTextNode("–"));
			}
			
			var row = document.createElement("tr");
			row.appendChild(name_cell);
			row.appendChild(desc_cell);
			row.appendChild(example_cell);
			row.appendChild(required_cell);										

			return row;
		},

		'input_group': function(name, desc, example, required) {

			var group = document.createElement("div");
			group.setAttribute("class", "form-group");
			
			var label = document.createElement("label");
			label.setAttribute("for", name);
			label.appendChild(document.createTextNode(name));

			if (required){
				var span = document.createElement("span");
				span.appendChild(document.createTextNode(" 👍"));
				span.setAttribute("title", "This parameter is required");
				label.appendChild(span);
			}
					
			var input = document.createElement("input");
			input.setAttribute("class", "form-control");					
			input.setAttribute("type", "text");
			input.setAttribute("name", name);
			input.setAttribute("id", "input-" + name);					
			input.setAttribute("value", "");
			input.setAttribute("placeholder", desc);

			group.appendChild(label);
			group.appendChild(input);
			
			if (example){
				
				var example_block = document.createElement("small");
				example_block.setAttribute("class", "api-form-example");
				example_block.setAttribute("data-input-id", name);			
				
				example_block.onclick = function(e){
					
					var el = e.target;
					var ex = el.innerText;
					
					var id = "input-" + el.getAttribute("data-input-id");
					var input = document.getElementById(id);
					
					if (input){
						input.setAttribute("value", ex);
					}
				};
				
				example_block.appendChild(document.createTextNode(example));
				group.appendChild(example_block);
			}

			return group;
		},

		'input_group_prefs': function(label_txt, name, desc, pref) {

			var group = document.createElement("div");
			group.setAttribute("class", "form-group");
			
			var label = document.createElement("label");
			label.setAttribute("for", name);
			label.appendChild(document.createTextNode(label_txt));
					
			var input = document.createElement("input");
			input.setAttribute("class", "form-control");					
			input.setAttribute("type", "text");
			input.setAttribute("name", name);
			input.setAttribute("id", "input-" + name);					
			input.setAttribute("value", pref);
			input.setAttribute("placeholder", desc);

			group.appendChild(label);
			group.appendChild(input);
			
			return group;
		}
		
	};
	
	return self;
}));
