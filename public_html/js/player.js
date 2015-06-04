define(['renderer'], function (renderer){

	var keycodes = {
		left: 37,
		up: 38,
		right: 39,
		down: 40
	}

	var get_input = function(props) {
		addEventListener("keydown", function(e) {
			//console.log("pressed: "+e.keyCode);
			props.keysDown[e.keyCode] = true;
			_handle_input(props);
		}, false);
		addEventListener("keyup", function(e) {
			if (props.keysDown[e.keyCode]) {
				delete props.keysDown[e.keyCode];
			}
		}, false);
	}

	var _handle_input = function(props) {
		var cell = props.grid[props.player.y][props.player.x];
		for (key in props.keysDown) {
			if (key==keycodes['up'] && cell&props.direction_values['N']) {
				props.player.y -= props.player.speed
			}
			if (key==keycodes['down'] && cell&props.direction_values['S']) {
				props.player.y += props.player.speed
			}
			if (key==keycodes['left'] && cell&props.direction_values['W']) {
				props.player.x -= props.player.speed
			}
			if (key==keycodes['right'] && cell&props.direction_values['E']) {
				props.player.x += props.player.speed
			}
			if (props.player.x==props.exit.x && props.player.y==props.exit.y) {
				props.score ++;
				console.log('score: '+props.score);
				props.reset();
			}
		}
		renderer.render(props);
	}

	return {
		get_input: get_input
	}

});
