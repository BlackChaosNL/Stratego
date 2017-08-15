var GameListController = function () {
	var api, ac, view = "./rhel/html/game/intro.html";
	this.load = function (args) {
		this.api = args.apiController;
		this.ac = args.applicationController;
		var _this = this;
		this.setSideBarGameList();
		$("#content").load(view);
	};

	this.setSideBarGameList = function () {
		var menu = $("#nav-mobile"),
			aiGame = '<li><a href="#" id="newAiGame" >New AI Game</a></li>',
			newGame = '<li><a href="#" id="newPlayerGame" >New Game vs Player</a></li>',
			deleteAllGames = '<li> <a href="#" id="deleteAllGames" >Delete all games</a></li><hr />',
			_this = this;
		this.api.io.on('statechange', function () { _this.setSideBarGameList(); });
		this.api.getAllGames().then(function (e) {
			if (!e.ok) {
				$("div.message").html(e.message.response.message).addClass("isError");
				return;
			}
			menu.html("").append(aiGame).append(newGame).append(deleteAllGames);
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
						gameId: i.id
					});
				});
			});
		});
	};
};