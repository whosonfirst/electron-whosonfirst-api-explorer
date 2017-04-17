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
	
	var self = {

		'draw_method_list': function(spec){

			var ul = document.getElementById("methods");

			var methods = spec.methods();
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
			
		},
		
	};
	
	return self;
}));
		
