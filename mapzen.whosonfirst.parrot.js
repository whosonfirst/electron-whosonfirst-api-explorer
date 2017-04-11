module.exports = function() {

	var self = {

		'start': function(msg){

			var el = document.getElementById("party-parrot");

			var img = document.createElement("img");
			img.setAttribute("src", "images/party-parrot.gif");

			var span = document.createElement("span");
			span.appendChild(document.createTextNode(msg));

			el.appendChild(img);
			el.appendChild(span);
		},

		'stop': function() {

			var el = document.getElementById("party-parrot");
			el.innerHTML = "";
		},
		
	};

	return self;

};
