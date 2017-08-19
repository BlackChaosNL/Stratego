var ApiController = function () {
	this.apiKey = "";
	this.baseUri = "http://strategoavans.herokuapp.com/api";
	this.methods = {
		get: "GET",
		post: "POST",
		delete: "DELETE"
	};
	this.routes = {
		me: "/users/me",
		games: "/games"
	};
	this.socket;

	this.login = function (apiKey) {
		_this = this;
		return xhrRequest({
			method: this.methods.get,
			url: this.baseUri + this.routes.me + "?api_key=" + apiKey
		}).then(function (e) {
			_this.setApiKey(apiKey);
			localStorage.setItem("avansApiKey", apiKey);
			_this.socket = io.connect("http://strategoavans.herokuapp.com/", { query: 'api_key=' + _this.apiKey });
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.logout = function () {
		localStorage.removeItem("avansApiKey");
		apiKey = "";
	};

	this.createGame = function (aiBoolean = true) {
		return xhrRequest({
			method: this.methods.post,
			url: this.baseUri + this.routes.games + "?api_key=" + this.apiKey,
			params: {
				ai: aiBoolean
			}
		}).then(function (e) {
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.getAllGames = function () {
		return xhrRequest({
			method: this.methods.get,
			url: this.baseUri + this.routes.games + "?api_key=" + this.apiKey
		}).then(function (e) {
			return {
				ok: true,
				message: new GameList(JSON.parse(e))
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.getGameById = function (id) {
		return xhrRequest({
			method: this.methods.get,
			url: this.baseUri + this.routes.games + "/" + id + "?api_key=" + this.apiKey
		}).then(function (e) {
			return {
				ok: true,
				message: JSON.parse(e)
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.deleteAllGames = function () {
		return xhrRequest({
			method: this.methods.delete,
			url: this.baseUri + this.routes.games + "?api_key=" + this.apiKey
		}).then(function (e) {
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.deleteGameById = function (id) {
		return xhrRequest({
			method: this.methods.delete,
			url: this.baseUri + this.routes.games + "/" + id + "?api_key=" + this.apiKey
		}).then(function (e) {
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.postBoard = function (id, sendBoard) {
		return xhrRequest({
			method: this.methods.post,
			url: this.baseUri + this.routes.games + "/" + id + "/start_board?api_key=" + this.apiKey,
			params: sendBoard
		}).then(function (e) {
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.getGameMoves = function (id) {
		return xhrRequest({
			method: this.methods.get,
			url: this.baseUri + this.routes.games + "/" + id + "/moves?api_key=" + this.apiKey,
		}).then(function (e) {
			return {
				ok: true,
				message: e
			};
		}, function (err) {
			return {
				ok: false,
				message: err
			};
		});
	};

	this.postGameMoves = function (id, move) {
		return xhrRequest({
			method: this.methods.post,
			url: this.baseUri + this.routes.games + "/" + id + "/moves?api_key=" + this.apiKey,
			params: {

			}
		}).then(function (e) { }, function (error) { });
	};

	this.setApiKey = function (apiKey) {
		this.apiKey = apiKey;
	};
};