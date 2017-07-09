function ApplicationController() {
	var _this = this;
	var _currentController = {};
	var _allControllers = {
		LoginController: new LoginController(),
		ApiController: new ApiController(),
		GameController: new GameController(),
		GameListController: new GameListController(),
		ApplicationController: _this
	};
}

ApplicationController.prototype = {
	run: function () {
		_this._currentController = args.controllers.LoginController;
	},

	switchController: function (args) {
		_this._controller = _this._allControllers[args.selectedController];
		_this._controller.load(args);
	}
};