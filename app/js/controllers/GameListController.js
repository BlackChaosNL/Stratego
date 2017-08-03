var GameListController = function () {
	var api, ac, view = "./rhel/html/game/intro.html";
	this.load = function (args) {
		this.api = args.apiController;
		this.ac = args.applicationController;
		var _this = this;
		this.api.getAllGames().then(function (e) {
			if (!e.ok) {
				$("div.message").html(e.message.response.message).addClass("isError");
				return;
			}
			_this.setSideBarGameList(e.message.getGameList());
			$("#content").load(view);
		});
	};

	this.setSideBarGameList = function (GameList) {
		var menu = $("#nav-mobile"),
			aiGame = '<li><a href="#" id="newAiGame" >New AI Game</a></li>',
			newGame = '<li><a href="#" id="newPlayerGame" >New Game vs Player</a></li>',
			deleteAllGames = '<li> <a href="#" id="deleteAllGames" >Delete all games</a></li><hr />',
			_this = this;
		menu.append(aiGame).append(newGame).append(deleteAllGames);
		$('#newAiGame').click(function (event) {
			event.stopPropagation();
			this.api.createGame(true);
		});
		$('#newPlayerGame').click(function (event) {
			event.stopPropagation();
			this.api.createGame(false);
		});
		GameList.forEach(function (i) {
			menu.append('<li><a href="#" id="' + i.id + '">vs ' + i.opponent + ' (' + i.state + ')</a></li>');
			$('#' + i.id).click(function (event) {
				event.stopPropagation();
				_this.loadGame(i.id);
			});
		});
	};

	this.loadGame = function (id) {
		// TODO: Create the switch task to propegate the gameBoard and additional features.
		console.log(id);
	}
};