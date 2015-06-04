define(['lodash/collection/shuffle', 'renderer', 'world', 'player'], function (shuffle, renderer, world, player){
	var props = {
		grid: [],
		keysDown: [],
		player: {
			x: 0,
			y: 0,
			speed:1
		},
		exit: {x:0, y:0},
		score: 0,
		direction_values: {'N':1, 'S':2, 'E':4, 'W':8}
	}

	var main = function() {
		world.init(props);
		renderer.render(props);
		player.get_input(props);
	};

	props.reset = function() {
		props.player.x = 0;
		props.player.y = 0;
		props.grid = [];
		world.init(props);
		renderer.render(props);
	}

	return main();
});
