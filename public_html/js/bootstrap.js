requirejs.config({
	baseUrl: '/js',
	paths: {
//		jquery: 'libs/jquery',
		'lodash': 'libs/lodash'
	}
});

requirejs(['main'], function(Main){});
