var GameController = function () {
	var api, views = {
		setup: ''
	}, lakes = [[4, 2], [4, 3], [5, 2], [5, 3], [4, 6], [4, 7], [5, 6], [5, 7]];

	let placementSelected = -1;
	let pieces = [
		{ code: "F", name: "Vlag", count: 1 },
		{ code: "S", name: "Spion", count: 1 },
		{ code: "9", name: "Verkenner", count: 8 },
		{ code: "8", name: "Mineur", count: 5 },
		{ code: "7", name: "Sergeant", count: 4 },
		{ code: "6", name: "Luitenant", count: 4 },
		{ code: "5", name: "Kapitein", count: 4 },
		{ code: "4", name: "Majoor", count: 3 },
		{ code: "3", name: "Kolonel", count: 2 },
		{ code: "2", name: "Generaal", count: 1 },
		{ code: "1", name: "Maarschalk", count: 1 },
		{ code: "B", name: "Bom", count: 6 }
	];

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
<<<<<<< HEAD
				this.fillGameBoard(e.message.id);
=======
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
>>>>>>> development
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
		// Show buttons to let the player place the pieces
		let buttonDOM = "<div>";

		for (let i in pieces) {
			buttonDOM += "<button id='place-" + pieces[i].code + "' class='piece-placement'>" + pieces[i].name + "</button>";
		}

		buttonDOM += "</div>";

		$("#gameBoard").before(buttonDOM);

		// Add function to the buttons
		let piecesTotal = 0;
		let board = [[], [], [], []];

		for (let i in pieces) {
			// Count the total amount of pieces while we're looping through them anyway
			piecesTotal += pieces[i].count;

			$("#place-" + pieces[i].code).on("click", function (e) {
				// Remove highlight from old selection
				if (-1 < placementSelected) {
					$("#place-" + pieces[placementSelected].code).removeClass("selected");
				}

				// Highlight new selection
				placementSelected = i;
				$(this).addClass("selected");
			});
		}

		// Bind placement function to the columns
		for (let y = 6; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				$(document).on("click", "#col-" + y + "-" + x, function (e) {
					if (placementSelected < 0) {
						console.warn("No piece selected for placement");
						return;
					}

					// Make sure a piece can be placed here
					if ($(this).hasClass("has-unit")) {
						console.warn("Column already contains a piece");
						return
					}

					// Add the classes to the column
					$(this).addClass("has-unit");
					$(this).addClass("has-" + pieces[placementSelected].code);

					// Add to the board array to send
					board[y - 6][x] = pieces[placementSelected].code

					// Disable placing this piece if the max has been reached
					if (--pieces[placementSelected].count < 1) {
						const btn = $("#place-" + pieces[placementSelected].code);

						btn.removeClass("selected");
						btn.attr("disabled", true);
						placementSelected = -1;
					}

					// When no pieces are left, post the board
					if (--piecesTotal < 1) {
						api.postBoard(gameId, board);

						// TODO: Reload page to go to the next step?
					}
				});

				// Enable this column
				this.changeBoardState({enable: [{x: x, y: y}]});
			}
		}
	};

	this.makeMove = function () {
		// TODO: Make movable & sendable.
	};

	this.drawGameBoard = function () {
		var GameBoard = $('table#gameBoard > tbody');
		GameBoard.html("");
		for (i = 0; i < 10; i++) {
			GameBoard.append('<tr id="row-' + i + '">');
			var row = $('tr#row-' + i);
			for (n = 0; n < 10; n++) {
				row.append('<td id="col-' + i + '-' + n + '" class="isDisabled"></td>');
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
					$('#col-' + i + '-' + n).removeClass('isDisabled');
				}
			}
		}

		if (state.disable === "all") {
			for (i = 0; i < 10; i++) {
				for (n = 0; n < 10; n++) {
					$('#col-' + i + '-' + n).addClass('isDisabled');
				}
			}
		}

		if (Array.isArray(state.enable)) {
			state.enable.forEach(function (item) {
				$('#col-' + item.y + '-' + item.x).removeClass('isDisabled');
			});
		}

		if (Array.isArray(state.disable)) {
			state.disable.forEach(function (item) {
				$('#col-' + item.y + '-' + item.x).addClass('isDisabled');
			});
		}
	};
};
