var ApplicationController = function () {
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
			selectedController: 'LoginController'
		});
	};
	this.switchController = function (args) {
		this._controller = this._allControllers[args.selectedController];
		this._controller.load(args);
	};
};