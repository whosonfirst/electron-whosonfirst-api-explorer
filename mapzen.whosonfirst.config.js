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

	const fs = require('fs');
	const jsonfile = require('jsonfile');
	const path = require('path');

	var _defaults = {
		"api_key": "",
		"api_endpoint": "https://whosonfirst-api.mapzen.com/",
	};
	
	var _cfg = undefined;
	var _path = undefined;
	
	var self = {
		
		'init': function(root){

			_path = path.join(root, "whosonfirst.api.explorer.json");

			if (! fs.existsSync(_path)){
				jsonfile.writeFileSync(_path, _defaults);
			}

			_cfg = jsonfile.readFileSync(_path);
		},
		
		'get': function(key){
			return _cfg[key];
		},

		'set': function(key, value){
			
			_cfg[key] = value;

			try {

				jsonfile.writeFileSync(_path, _cfg);				
				
			}

			catch(e){
				
				console.log(e);
				return false;
			}
			
			return true;
		},

		'has': function(key){

			if (! _cfg[key]){
				return false;
			}

			return true;
		},
	}
	
	return self;
}));
