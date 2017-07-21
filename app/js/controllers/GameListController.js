var GameListController = function () {
	var view = "./rhel/html/game/list.html",
		api, _this = this;
	this.load = function (args) {
		console.log('GameListController called');
		this.api = args.apiController;
		console.log(args.applicationController);
		$("#content").load(view, function () {
			_this.setBindings();
		});
	};

	this.setBindings = function () {

	};
};