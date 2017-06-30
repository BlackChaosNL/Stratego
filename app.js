requirejs.config({
	baseUrl: 'app/js',
	paths: {
		includes: '../includes'
	}
});

requirejs(['jquery', 'socket', 'mustache'],
	function ($, socket, mustache) {
		
	});