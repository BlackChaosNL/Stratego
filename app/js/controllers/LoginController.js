var LoginController = function () {
	var _this = this,
		view = 'rhel/html/login.html';
	this.load = function (args) {
		console.log('Yay it works!');
		$("#content").load(view).then(function (result) {
			_this.setBindings();
		});
	};
	this.setBindings = function () {

	};
	this.checkApiKey = function () {

	};
};