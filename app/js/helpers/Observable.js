var Observable = function (sender) {
	this._sender = sender;
	this._listeners = [];
	this.subscribe = function (listener) {
		_this._listeners.push(listener);
	};
	this.unsubscribe = function (args) {
		_this._listeners.forEach(function (item) {
			if (args === item) {
				_this._listeners.splice(_this._listeners.indexOf(args), 1);
				return;
			}
		});
	};
	this.notify = function (args) {
		_this._listeners.forEach(function (item) {
			item(this._sender, args);
		});
	};
};