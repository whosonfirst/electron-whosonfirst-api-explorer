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
		g.mapzen.whosonfirst.config = g.mapzen.whosonfirst.config = f();		
        }
	
}(function(){

	// https://github.com/whosonfirst/electron-whosonfirst-api-explorer/issues/23
	
	var _cfg = {};
	
	var self = {

		'get': function(key){

			return _cfg[key];
		},

		'set': function(key, value){

			_cfg[key] = value;
			return true;
		},

		'has': function(key){

			if (! _cfg[key]){
				return false;
			}

			return true;
		}
	}
	
	return self;
}));
