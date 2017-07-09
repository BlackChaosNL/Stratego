function Observable(sender) {
	this._this = this;
	_this._sender = sender;
	_this._listeners = [];
}

Observable.prototype = {
	subscribe: function (listener) {
		_this._listeners.push(listener);
	},
	unsubscribe: function (args) {
		_this._listeners.forEach(function (item) {
			if (args === item) {
				_this._listeners.splice(_this._listeners.indexOf(args), 1);
				return;
			}
		});
	},
	notify: function (args) {
		_this._listeners.forEach(function (item) {
			item(this._sender, args);
		});
	}
};