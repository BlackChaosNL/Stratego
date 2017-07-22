var GameListController = function () {
	var api, ac, _this = this;
	this.load = function (args) {
		this.api = args.apiController;
		this.ac = args.applicationController;
		this.setBindings();
	};

	this.setBindings = function () {
		// Load up links in here :D
	};
};