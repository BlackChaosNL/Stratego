var Board = function () {
	var board;

	this.setBoard = function (board) {
		this.board = board;
	};

	this.getBoard = function () {
		return this.board;
	}

	this.getOurSide = function () {
		return [
		    this.board[6],
		    this.board[7],
		    this.board[8],
		    this.board[9],
		];
	}

	this.getPosition = function (x, y) {
		return this.board[x][y];
	}

	this.setPosition = function (x, y, value) {
		this.board[x][y] = value;
	}
};
