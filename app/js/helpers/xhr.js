function xhrRequest(opts) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(opts.method, opts.url);
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
			} else {
				reject({
					status: this.status,
					statusText: xhr.statusText,
					response: JSON.parse(this.response)
				});
			}
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText,
				response: JSON.parse(this.response)
			});
		};
		if (opts.headers) {
			Object.keys(opts.headers).forEach(function (key) {
				xhr.setRequestHeader(key, opts.headers[key]);
			});
		}
		var params = opts.params;
		//if (params && typeof params === 'object') {
		//	params = Object.keys(params).map(function (key) {
		//		return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		//	}).join('&');
		//}
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify(params));
	});
}