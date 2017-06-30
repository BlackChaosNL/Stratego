var controllers = {
	gameController: 'GameController',

};

requirejs.config({
	baseUrl: 'app/js',
	paths: {
		includes: '../includes'
	}
});

requirejs(['includes/jquery', 'includes/socket', 'includes/mustache'],
	function ($, socket, mustache) {
		
	});