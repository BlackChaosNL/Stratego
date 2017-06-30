requirejs.config({
	baseUrl: 'app/js',
	paths: {
		includes: '../includes',
		jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
		socket: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.slim',
		controllers: 'controllers'
	}
});

var controllers = {
	gameController: require(['controllers/GameController']),
	gameListController: require(['controllers/GameListController']),
	loginController: require(['controllers/LoginController'])
};

requirejs(['../../app/app']);