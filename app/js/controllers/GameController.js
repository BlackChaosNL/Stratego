var GameController = function () {
	var api, views = {

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
				this.fillGameBoard(e.message.id);
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

	//
	// Only need to fill our side of the board, which consists of
	// 4 rows of 10 columns.
	//
	this.fillGameBoard = function (gameId) {
		// These pieces need to be placed, with their count
		var pieces = {
			B: 6,
			1: 1,
			2: 1,
			3: 2,
			4: 3,
			5: 4,
			6: 4,
			7: 4,
			8: 5,
			9: 8,
			S: 1,
			F: 1
		};

		// Place each piece one by one
		for (var code in pieces) {
			while (pieces[code] > 0) {
				// TODO: Make the player able to place the piece
				console.log("Need to place " + pieces[code] + " pieces more of type " + code);

				pieces[code]--;
			}
		}

		// Create 4 rows of the board which we need to fill
		var board = [
			['7', 'B', '5', '2', '9', '9', '1', '8', '9', 'B'],
			['B', '7', '9', 'S', '4', '5', '8', '5', '3', '9'],
			['7', 'B', '4', '8', '6', '4', '3', '8', '7', '6'],
			['B', 'F', 'B', '5', '9', '6', '6', '9', '9', '8']
		];

		// Send the board to the API
		api.postBoard(gameId, board);
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
					$('#' + i + ',' + n).removeClass('isDisabled');
				}
			}
		}

		if (state.disable === "all") {
			for (i = 0; i < 10; i++) {
				for (n = 0; n < 10; n++) {
					$('#' + i + ',' + n).addClass('isDisabled');
				}
			}
		}

		if (Array.isArray(state.enable)) {
			state.enable.forEach(function (item) {
				$('#' + item.x + ',' + item.y).removeClass('isDisabled');
			});
		}

		if (Array.isArray(state.disable)) {
			state.disable.forEach(function (item) {
				$('#' + item.x + ',' + item.y).addClass('isDisabled');
			});
		}
	};
};
