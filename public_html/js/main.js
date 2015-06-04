define(['lodash/collection/shuffle', 'renderer', 'world', 'player'], function (shuffle, renderer, world, player){
	var props = {
		grid: [],
		view_id: document.createAttribute("id"),
		view: document.createElement("div"),
		keysDown: [],
		player: {
			x: 0,
			y: 0,
			speed:1
		},
		exit: {x:0, y:0},
		score: 0
	}
	props.view_id.value = "maze";
	props.view.setAttributeNode(props.view_id);

	props.direction_values = {'N':1, 'S':2, 'E':4, 'W':8},
		DX = {'E':1, 'W':-1, 'N':0, 'S':0},
		DY = {'E':0, 'W':0, 'N':-1, 'S':1},
		opposite = {'E':'W', 'W':'E', 'N':'S', 'S':'N'};
	// var seed = 

	var main = function() {
		world.init(props);
		renderer.render(props);
		player.get_input(props);
	};

	var reset = function() {
		props.player.x = 0;
		props.player.y = 0;
		props.grid = [];
		world.init(props);
		renderer.render(props);
	}

	return main();
});
