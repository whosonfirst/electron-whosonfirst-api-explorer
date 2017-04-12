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
		
		g.mapzen = g.mapzen || {};
		g.mapzen.whosonfirst = g.mapzen.whosonfirst || {};
		g.mapzen.whosonfirst.partyparrot = g.mapzen.whosonfirst.partyparrot = f();		
        }
	
}(function(){

	var self = {
		
		'start': function(msg){
			
			var el = document.getElementById("party-parrot");
			
			if (! el){
				return false;
			}
			
			var img = document.createElement("img");
			img.setAttribute("src", "images/party-parrot.gif");

			var span = document.createElement("span");
			span.appendChild(document.createTextNode(msg));

			el.appendChild(img);
			el.appendChild(span);

			return true;
		},

		'stop': function() {

			var el = document.getElementById("party-parrot");

			if (! el){
				return false;
			}
			
			el.innerHTML = "";
			return true;
		},
		
	};

	return self;

}));
