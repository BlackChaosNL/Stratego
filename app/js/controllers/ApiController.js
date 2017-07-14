var ApiController = function () {
	this._this = this;
	this.apiKey = "";
	this.login = function (apiKey) {
		return xhrRequest({
			method: 'GET',
			url: "http://strategoavans.herokuapp.com/api/users/me?api_key=" + apiKey
		}).then(function (e) {
			this.apiKey = apiKey;
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
};