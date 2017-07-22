var LoginController = function () {
	var _this = this,
		view = "rhel/html/login/login.html",
		api, sw;

	this.load = function (args) {
		this._this = this;
		this.api = args.apiController;
		this.sw = args.applicationController;
		$("#content").load(view, function () {
			_this.setBindings();
		});
	};

	this.setBindings = function () {
		this._this = this;
		$("button#login").click(function (event) {
			event.stopPropagation();
			_this.api.login($("#apiKey").val()).then(function (e) {
				if (!e.ok) {
					$("div.message").html(e.message.response.message).addClass("isError");
					return;
				}
				_this.sw.switchController({
					selectedController: 'GameListController',
					apiController: _this.api,
					applicationController: _this.sw
				});
			});
		});
	};
};