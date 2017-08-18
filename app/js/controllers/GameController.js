var GameController = function () {
	var api, views = {
		setup: ''
	}, lakes = [[4, 2], [4, 3], [5, 2], [5, 3], [4, 6], [4, 7], [5, 6], [5, 7]];

	this.load = function (args) {
		api = args.apiController;
		var _this = this;
		api.getGameById(args.gameId).then(function (e) {
			if (!e.ok) {
				$("div.message").html(e.message.response.message).addClass("isError");
				return;
			}
			$('.nav-wrapper').html('Game VS ' + e.message.opponent + ' (' + e.message.id + ')');
			_this.drawGameBoard();
			_this.setGameState(e, _this);
		});
	};

	this.setGameState = function (e, _this) {
		switch (e.message.state) {
			case 'waiting_for_an_opponent':
				$('div.message').html('We haven\'t found a player yet, please be patient!').addClass("isInfo");
				break;
			case 'waiting_for_pieces':
				var playerPlacement = [];
				for (var i = 6; i < 10; i++) {
					for (var n = 0; n < 10; n++) {
						playerPlacement.push([i, n]);
					}
				}
				$("#gameBoard > tbody > tr > td").click(function (a) {
					console.log(a);
				});
				_this.changeBoardState({
					enable: playerPlacement
				});
				break;
			case 'waiting_for_opponent_pieces':

				break;
			case 'my_turn':
				_this.changeBoardState({
					enable: "all",
					disable: lakes
				});
				break;
			case 'opponent_turn':
				_this.changeBoardState({
					disable: "all"
				});
				break;
			case 'game_over':

				break;
			default:
				console.log('This has not been implemented yet or the API has changed, please contact the developer.');
				console.log('Use the following message: ' + e.message.state);
				break;
		}
	};

	this.fillGameBoard = function (Board) {

	};

	this.makeMove = function () {
		// TODO: Make movable & sendable.
	};

	this.drawGameBoard = function () {
		var GameBoard = $('table#gameBoard > tbody');
		GameBoard.html("");
		for (i = 0; i < 10; i++) {
			GameBoard.append('<tr id="' + i + '">');
			var row = $('tr#' + i);
			for (n = 0; n < 10; n++) {
				row.append('<td id="' + i + ',' + n + '" class="isDisabled"></td>');
			};
			row.append('</tr>');
		};
	};

	// State: {
	//	enable: { "all" || [[x,y], ... ] }
	//	disable: { "all" || [[x,y], ... ] }
	//}
	this.changeBoardState = function (state) {
		if (state.enable === "all") {
			for (i = 0; i < 10; i++) {
				for (n = 0; n < 10; n++) {
					$('td#' + i + ',' + n).removeClass('isDisabled');
				}
			}
		}

		if (state.disable === "all") {
			for (i = 0; i < 10; i++) {
				for (n = 0; n < 10; n++) {
					$('td#' + i + ',' + n).addClass('isDisabled');
				}
			}
		}

		if (Array.isArray(state.enable)) {
			state.enable.forEach(function (item) {
				console.log($('td#' + item[0] + ',' + item[1]));
				$('td#' + item[0] + ',' + item[1]).removeClass('isDisabled');
			});
		}

		if (Array.isArray(state.disable)) {
			state.disable.forEach(function (item) {
				$('td#' + item[0] + ',' + item[1]).addClass('isDisabled');
			});
		}
	};
};