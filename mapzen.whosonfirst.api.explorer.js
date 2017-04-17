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

			self.draw_sidebar(ul);
			
			console.log(_spec.errors());
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

			self.draw_sidebar(ul);
		},

		'draw_method': function(name) {

			var d = document.createElement("div");
			d.appendChild(document.createTextNode(name));

			return self.draw_main(d);
		},

		'draw_error': function(code){
			console.log("draw code");
		},

		'draw_format': function(format){
			console.log("draw format");
		},
		
		'draw_sidebar': function(list) {

			var el = document.getElementById("sidebar");
			el.innerHTML = "";
			
			el.appendChild(list);
			return true;
		},

		'draw_main': function(content) {

			var el = document.getElementById("main");
			el.innerHTML = "";
			
			el.appendChild(content);
			return true;			
		}
	};
	
	return self;
}));
		
