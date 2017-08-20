const GameController = function() {
	let api;
	let ac;
	let placementSelected = -1;
	const lakes = [
		[4, 2],
		[4, 3],
		[5, 2],
		[5, 3],
		[4, 6],
		[4, 7],
		[5, 6],
		[5, 7]
	];

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

	this.calcDiff = (i, j) => {
		const d = i - j;

		return d;
	};

	this.getTile = (row, col) => {
		return $(this.getTileString(row, col));
	};

	this.getTileString = (row, col) => {
		return "#col-" + row + "-" + col;
	};

	// State: {
	//	enable: { "all" || [[x,y], ... ] }
	//	disable: { "all" || [[x,y], ... ] }
	//}
	this.setBoardState = state => {
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

	this.setGameState = (e, _this) => {
		switch (e.message.state) {
			case 'waiting_for_an_opponent': this.handleWaitingForOpponent(); break;
			case 'waiting_for_pieces': this.handleWaitingForPieces(e.message.id); break;
			case 'waiting_for_opponent_pieces': this.handleWaitingForOpponentPieces(); break;
			case 'my_turn': this.handleMyTurn(e.message); break;
			case 'opponent_turn': this.handleOpponentTurn(); break;
			case 'game_over': this.handleGameOver(); break;
			default:
				console.log('This has not been implemented yet or the API has changed, please contact the developer.');
				console.log('Use the following message: ' + e.message.state);
				break;
		}
	};

	this.doDrawBoardHtml = () => {
		const GameBoard = $('table#gameBoard > tbody');

		GameBoard.html("");

		for (let i = 0; i < 10; i++) {
			GameBoard.append('<tr id="row-' + i + '">');

			let row = $('tr#row-' + i);

			for (let n = 0; n < 10; n++) {
				row.append('<td id="col-' + i + '-' + n + '" class="isDisabled"></td>');
			}

			row.append('</tr>');
		};
	};

	this.doDrawTiles = board => {
		const that = this;

		for (let y = 0; y < board.length; y++) {
			const row = board[y];

			for (let x = 0; x < row.length; x++) {
				const tile = that.getTile(y, x);
				const col = row[x];

				// Draw the units
				if (col != " ") {
					tile.addClass("has-unit");
					tile.addClass("has-" + col);
					tile.data("unit", col);

					continue;
				}

				// Draw lakes
				for (let i in lakes) {
					if (lakes[i][0] == y && lakes[i][1] == x) {
						tile.addClass("has-lake");

						continue;
					}
				}

				// Make sure empty tiles are cleaned up
				tile.removeClass("has-unit");
				tile.removeClass("has-" + col);
				tile.data("unit", null);
			}
		}
	};

	this.load = args => {
		api = args.apiController;
		ac = args.applicationController;

		const that = this;

		api.getGameById(args.gameId).then(e => {
			if (!e.ok) {
				$("div.message").html(e.message.response.message).addClass("isError");

				return;
			}

			$('.nav-wrapper').html('Game VS ' + e.message.opponent + ' (' + e.message.id + ')');

			that.doDrawBoardHtml();
			that.setGameState(e, that);
		});
	};

	this.handleGameOver = () => {
		console.log("NYI");
	};

	this.handleMyTurn = message => {
		const that = this;
		const board = message.board;
		let selected = {
			state: false,
			x: 0,
			y: 0
		};

		// Enable the tiles which are usable
		this.setBoardState({
			enable: "all",
			disable: lakes
		});

		// Draw initial board state
		this.doDrawTiles(board);

		// Bind play functionality to the board
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board[y].length; x++) {
				const col = board[y][x];
				const tile = that.getTile(y, x);

				$(document).on("click", that.getTileString(y, x), e => {
					// Allow selecting a unit
					if (col != " " && col != "O") {
						// Deselect a previously selected unit
						if (selected.state) {
							that.getTile(selected.y, selected.x).removeClass("selected");
						}

						selected = {
							state: true,
							x: x,
							y: y
						};

						tile.addClass("selected");

						return;
					}

					// Allow the player to select a tile to move to
					if (selected.state && (col == " " || col == "O")) {
						const valid = that.isValidMove(selected.y, selected.x, y, x);

						if (!valid) {
							console.warn("That move is invalid");
							return;
						}

						// Lock the board
						that.setBoardState({disable: "all"});

						// Tell the API something changed
						api.postGameMoves(message.id, {
							square: {
								row: selected.y,
								column: selected.x
							},
							square_to: {
								row: y,
								column: x
							}
						}).then(post => {
							// Process API response
							that.doDrawTiles(post.game.board);

							// Unlock the board
							that.setBoardState({
								enable: "all",
								disable: lakes
							});
						}).catch(e => console.error(e));
					}
				});
			}
		}
	};

	this.handleOpponentTurn = () => {
		console.log("NYI");
	};

	this.handleWaitingForOpponent = () => {
		$('div.message').html('We haven\'t found a player yet, please be patient!').addClass("isInfo");
	};

	this.handleWaitingForOpponentPieces = () => {
		console.log("NYI");
	};

	//
	// Only need to fill our side of the board, which consists of
	// 4 rows of 10 columns.
	//
	this.handleWaitingForPieces = gameId => {
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
						return;
					}

					// Add the classes to the column
					$(this).addClass("has-unit");
					$(this).addClass("has-" + pieces[placementSelected].code);

					// Add to the board array to send
					board[y - 6][x] = pieces[placementSelected].code;

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
				this.setBoardState({ enable: [{ x: x, y: y }] });
			}
		}
	};

	this.isValidMove = (fromRow, fromCol, toRow, toCol) => {
		const from = this.getTile(fromRow, fromCol);
		const to = this.getTile(toRow, toCol);

		// B & F are not allowed to move
		if (to.data("B") || to.data("F")) {
			console.log("Bombs and the flag are not allowed to move");
			return false;
		}

		lakes.forEach(lake => {
			if (lake[0] == toRow && lake[1] == toCol) {
				console.warn("You are not allowed to put a piece on water!");
				return false;
			}
		});

		const horizontal = this.calcDiff(fromRow, toRow);
		const vertical = this.calcDiff(fromCol, toCol);

		// Moving is only allowed in straight lines
		if (horizontal != 0 && vertical != 0) {
			console.log("Must move in a straight line");
			return false;
		}

		// Tile should be in an allowed range
		if (1 < horizontal || 1 < vertical) {
			// 9 is allowed to move any amount of steps
			if (from.data("unit") == "9") {
				const axis = (horizontal == 0) ? "y" : "x";

				// But not across the ocean or over their dead bodies
				if (this.isValidPath(axis, fromRow, fromCol, toRow, toCol)) {
					console.log("Path is not clear");
					return false;
				}

				return true;
			}

			console.log("Tile is not in range");
			return false;
		}

		// Move
		return true;
	};

	this.isValidPath = (axis, fromRow, fromCol, toRow, toCol) => {
		if (axis == "x") {
			let distance = fromCol - toCol;
			let i = 1;

			if (distance < 0) { distance = -distance; }

			while (i < distance) {
				const tile = this.getTile(fromRow, (fromCol + i));

				// Check for water tiles
				if (tile.hasClass("has-lake")) {
					return false;
				}

				// Check for enemies along the way
				if (tile.hasClass("has-unit")) {
					return false;
				}

				i++;
			}
		}

		let distance = fromRow - toRow;
		let i = 1;
		if (distance < 0) { distance = -distance; }

		while (i < distance) {
			const tile = this.getTile((fromRow + i), fromCol);

			// Check for water tiles
			if (tile.hasClass("has-lake")) {
				return false;
			}

			// Check for enemies along the way
			if (tile.hasClass("has-unit")) {
				return false;
			}

			i++;
		}

		return true;
	};
};
