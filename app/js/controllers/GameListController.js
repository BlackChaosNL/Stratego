var GameListController = function () {
	var api, ac, view = {
		intro: "./rhel/html/game/intro.html",
		login: "./rhel/html/login/login.html"
	};
	this.load = function (args) {
		this.api = args.apiController;
		this.ac = args.applicationController;
		var _this = this;
		this.setSideBarGameList();
		this.api.socket.on('statechange', function (x) {
			console.log(x);
			_this.setSideBarGameList();
		});
		$("#content").load(view.intro);
	};

	this.setSideBarGameList = function () {
		var menu = $("#nav-mobile"),
			logout = '<li><a href="#" id="logOut" class="waves-effect waves-light btn">Logout</a></li>',
			aiGame = '<li><a href="#" id="newAiGame" class="waves-effect waves-light btn">New AI Game</a></li>',
			newGame = '<li><a href="#" id="newPlayerGame" class="waves-effect waves-light btn">New Game vs Player</a></li>',
			deleteAllGames = '<li> <a href="#" id="deleteAllGames" class="waves-effect waves-light btn">Delete all games</a></li><hr />',
			_this = this;
		this.api.getAllGames().then(function (e) {
			if (!e.ok) {
				$("div.message").html(e.message.response.message).addClass("isError");
				return;
			}
			menu.html("").append(logout).append(aiGame).append(newGame).append(deleteAllGames);
			$('#logOut').click(function () {
				_this.api.logout();
				_this.clearAll(menu);
			});
			$('#newAiGame').click(function () {
				_this.api.createGame(true).then(function () { _this.setSideBarGameList(); });
			});
			$('#newPlayerGame').click(function () {
				_this.api.createGame(false).then(function () { _this.setSideBarGameList(); });
			});
			$('#deleteAllGames').click(function () {
				_this.api.deleteAllGames().then(function () { _this.setSideBarGameList(); });
			});
			e.message.getGameList().forEach(function (i) {
				menu.append('<li><a href="#" id="' + i.id + '">vs ' + i.opponent + ' <span class="new badge" data-badge-caption="">' + i.state + '</span></a></li>');
				$('#' + i.id).click(function () {
					_this.ac.switchController({
						selectedController: 'GameController',
						apiController: _this.api,
						applicationController: _this.ac,
						gameId: i.id
					});
				});
			});
		});
	};

	this.clearAll = function (menu) {
		menu.html("");
		_this = this;
		this.ac.switchController({
			selectedController: 'LoginController',
			applicationController: _this.ac,
			apiController: _this.api
		});
	};
};