(function (root, factory) {

    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.returnExports = factory();
    }
	
}(this, function (b) {

	var null_handler = function(){
		return undefined;
	};

	var mapzen_endpoint = function(){
		return "https://whosonfirst-api.mapzen.com"
	};

	var mapzen_authentication = function(){
		return "FIX ME"
	};
	
	var self = {
		
		'_handlers': {
			'endpoint': mapzen_endpoint,
			'authentication': mapzen_authentication,
		},
		
		'set_handler': function(target, handler){
			
			if (! self._handlers[target]){
				console.log("MISSING " + target);
				return false;
			}
			
			if (typeof(handler) != "function"){
				console.log(target + " IS NOT A FUNCTION");
				return false;
			}
			
			self._handlers[target] = handler;
		},
		
		'get_handler': function(target){
			
			if (! self._handlers[target]){
				return false;
			}
			
			return self._handlers[target];
		},
		
		'execute_method': function(method, data, on_success, on_error){
			
			var dothis_onsuccess = function(rsp){
				
				if (on_success){
					on_success(rsp);
				}
			};
			
			var dothis_onerror = function(rsp){
				
				console.log(rsp);
				
				if (on_error){
					on_error(rsp);
				}
			};
			
			var get_endpoint = self.get_handler('endpoint');
			
			if (! get_endpoint){
				dothis_onerror(self.destruct("Missing endpoint handler"));
				return false
			}
			
			endpoint = get_endpoint();
			
			if (! endpoint){
				dothis_onerror(self.destruct("Endpoint handler returns no endpoint!"));
				return false
			}
			
			var form_data = data;
			
			if (! form_data.append){
				
				form_data = new FormData();
				
				for (key in data){
					form_data.append(key, data[key]);
				}
			}
			
			form_data.append('method', method);
			
			if (! form_data.get("api_key")){
				
				var get_authentication = self.get_handler('authentication');
				
				if (! get_authentication){
					dothis_onerror(self.destruct("there is no authentication handler"));
					return false;
				}
				
				form_data.append('api_key', get_authentication());
			}
			
			var onload = function(rsp){
				
				var target = rsp.target;
				
				if (target.readyState != 4){
					return;
				}
				
				var status_code = target['status'];
				var status_text = target['statusText'];
				
				var raw = target['responseText'];
				var data = undefined;
				
				try {
					data = JSON.parse(raw);
				}
				
				catch (e){
					
					dothis_onerror(self.destruct("failed to parse JSON " + e));
					return false;
				}
				
				if (data['stat'] != 'ok'){
					
					dothis_onerror(data);
					return false;
				}
				
				dothis_onsuccess(data);
				return true;
			};
			
			var onprogress = function(rsp){
				// console.log("progress");
			};
			
			var onfailed = function(rsp){
				
				dothis_onerror(self.destruct("connection failed " + rsp));
			};
			
			var onabort = function(rsp){
				
				dothis_onerror(self.destruct("connection aborted " + rsp));
			};
			
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
			
			try {
				var req = new XMLHttpRequest();
				
				req.addEventListener("load", onload);
				req.addEventListener("progress", onprogress);
				req.addEventListener("error", onfailed);
				req.addEventListener("abort", onabort);
				
				var query = [];
				
				for (var pair of form_data.entries()) {
					var k = pair[0];
					var v = pair[1];
					
					query.push(k + "=" + encodeURIComponent(v));
				}
				
				endpoint = endpoint + "?" + query.join("&");
				console.log(endpoint);
				
				req.open("GET", endpoint, true);
				req.send(form_data);
				
			} catch (e) {
				
				dothis_onerror(self.destruct("failed to send request, because " + e));
				return false;
			}
			
			return false;
		},
		
		'destruct': function(msg){
			
			return {
				'stat': 'error',
				'error': {
					'code': 999,
					'message': msg
				}
			};
			
		},
	}
	
	return self;
}));
