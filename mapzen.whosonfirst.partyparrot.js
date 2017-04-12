(function (root, factory) {

    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.returnExports = factory();
    }
	
}(this, function (b) {

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
