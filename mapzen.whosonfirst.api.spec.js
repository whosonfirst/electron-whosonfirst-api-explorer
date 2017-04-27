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

	const lf = require("./javascript/localforage.min.js");
	const wg = require("./mapzen.whosonfirst.waitgroup.js");
	
	var _methods = undefined;
	var _errors = undefined;
	var _formats = undefined;
	var _default_format = undefined;

	var _err_remote = false;
	var _err_local = false;
	
	var _cache = false;
	
	var self = {

		'init': function(api, cb){

			if (navigator.onLine){
				self.init_remote(api, cb);
			} 

			else {
				self.init_local(cb);
			}
		},

		'init_remote': function(api, cb){

			_err_remote = false;
			
			wg.add(3);
			
			api.execute_method("api.spec.methods", {}, function(rsp){
				
				_methods = rsp["methods"];

				self.set("methods", rsp["methods"]);
				wg.done();
				
			}, function(){ _err_remote = true; wg.done(); });

			api.execute_method("api.spec.errors", {}, function(rsp){

				_errors = rsp["errors"];

				self.set("errors", rsp["errors"]);				
				wg.done();
				
			}, function(){ _err_remote = true; wg.done(); });

			api.execute_method("api.spec.formats", {}, function(rsp){

				_formats = rsp["formats"];
				_default_format = rsp["default_format"];
				
				self.set("formats", rsp["formats"]);
				self.set("default_format", rsp["default_format"]);				
				wg.done();
				
			}, function(){ _err_remote = true; wg.done(); });

			wg.wait(function(){

				if (! _err_remote){
					cb();
					return;
				}
				
				console.log("check local");
				self.init_local(cb);
			});
			
		},

		'init_local': function(cb){

			_cache = false;
			_err_local = false;
			
			wg.add(4);
			
			lf.getItem("methods").then(function(rsp) {
				_methods = rsp;
				wg.done();
				
			}).catch(function (err) {
				console.log("failed to get 'methods' because " + err);

				_err_local = true;
				wg.done();				
			});

			lf.getItem("errors").then(function(rsp) {
				_errors = rsp;				
				wg.done();
				
			}).catch(function (err) {
				console.log("failed to get 'errors' because " + err);
				_err_local = true;
				wg.done();
			});

			lf.getItem("formats").then(function(rsp) {
				_formats = rsp;
				wg.done();
				
			}).catch(function (err) {
				console.log("failed to get 'formats' because " + err);
				_err_local = true;				
				wg.done();
			});

			lf.getItem("default_format").then(function(rsp) {
				_default_format = rsp;
				wg.done();
				
			}).catch(function (err) {
				console.log("failed to get 'default_format' because " + err);
				_err_local = true;
				wg.done();
			});
			
			wg.wait(function(){

				if (! _err_local){
					_cache = true;
				}

				cb();
			});
		},
		
		'methods': function(){
			return _methods;
		},

		'errors': function(){
			return _errors;
		},
		
		'formats': function(){
			return _formats;
		},

		'default_format': function(){
			return _default_format;
		},
		
		'set': function(key, value) {

			lf.setItem(key, value).then(function () {
				// pass
			}).catch(function (err) {
				console.log("failed to set '" + key + "' because " + err);
			});

		},

		'loaded': function(){

			console.log("loaded");
			console.log("remote " + _err_remote);
			console.log("local " + _err_local);
			console.log("cache " + _cache);			
			
			if ((_err_remote) && (_err_local)){
				return false;
			}

			return true;
		},

		'is_cache': function(){
			return _cache;
		}
	};
	
	return self;
}));
		
