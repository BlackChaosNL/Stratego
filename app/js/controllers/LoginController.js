function LoginController() {
	var _this = this,
		view = 'rhel/html/login.html';
}

LoginController.prototype = {
	load: function (args) {
		$("#content").load(view).then(function (result) {
			_this.setBindings();
		});
	},
	setBindings: function () {

	},
	checkApiKey: function () {

	}
}