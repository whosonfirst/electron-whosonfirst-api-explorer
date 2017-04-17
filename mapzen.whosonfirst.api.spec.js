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

	var _methods = undefined;
	var _errors = undefined;
	var _formats = undefined;
	
	var self = {

		'init': function(api, cb){

			const wg = require("./mapzen.whosonfirst.waitgroup.js");
			wg.add(3);
			
			api.execute_method("api.spec.methods", {}, function(rsp){
				
				_methods = rsp["methods"];	
				wg.done();
			});

			api.execute_method("api.spec.errors", {}, function(rsp){

				_errors = rsp["errors"];
				wg.done();
			});

			api.execute_method("api.spec.formats", {}, function(rsp){

				_formats = rsp["formats"];			
				wg.done();
			});

			wg.wait(cb);
		},
		
		'methods': function(){
			
			return _methods;
		},

		'errors': function(){

			return _errors;
		},
		
		'formats': function(){

			return _formats;
		}
		
		
	};
	
	return self;
}));
		
