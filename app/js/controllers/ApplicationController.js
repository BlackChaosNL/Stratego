var ApplicationController = function () {
	this._this = this;
	this._currentController = {};
	this._allControllers = {
		LoginController: new LoginController(),
		ApiController: new ApiController(),
		GameController: new GameController(),
		GameListController: new GameListController()
	};
	this.run = function () {
		this._currentController = this._allControllers.LoginController;
		this.switchController({
			selectedController: 'LoginController',
			applicationController: this,
			apiController: this._allControllers.ApiController
		});
	};
	this.switchController = function (args) {
		this._currentController = this._allControllers[args.selectedController];
		this._currentController.load(args);
	};
};