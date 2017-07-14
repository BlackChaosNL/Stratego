var ApplicationController = function () {
	this._this = this;
	this._currentController = {};
	this._allControllers = {
		LoginController: new LoginController(),
		ApiController: new ApiController(),
		GameController: new GameController(),
		GameListController: new GameListController(),
		ApplicationController: this
	};
	this.run = function () {
		this._currentController = this._allControllers.LoginController;
		this.switchController({
			selectedController: 'LoginController',
			applicationController: this._allControllers.ApplicationController,
			apiController: this._allControllers.ApiController
		});
	};
	this.switchController = function (args) {
		console.log(this);
		this._currentController = this._allControllers[args.selectedController];
		this._currentController.load(args);
	};
};