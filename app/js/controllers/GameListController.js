var GameListController = function () {
	var api, ac;
	this.load = function (args) {
		this.api = args.apiController;
		this.ac = args.applicationController;
		this.loadMenu();
	};

	this.loadMenu = function () {
		this.api.getAllGames().then(function (e) {
			console.log(e);
		});
	};
};