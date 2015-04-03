define(['lodash/collection/shuffle'], function (shuffle){
	var width = 40,
		height = 40,
		grid = [],
		view_id = document.createAttribute("id"),
		view = document.createElement("div"),
		keysDown = [],
		player = {
			x: 0,
			y: 0,
			speed:1
		}
	view_id.value = "maze";
	view.setAttributeNode(view_id);
	// var seed = 

	var init_grid = function(height, width, grid) {
		var h = height;
		while (h-- > 0) {
			var w = width;
			var row = [];
			while (w-- > 0) {
				row.push(0);
			}
			grid.push(row);
		}
	}

	var direction_values = {'N':1, 'S':2, 'E':4, 'W':8},
		DX = {'E':1, 'W':-1, 'N':0, 'S':0},
		DY = {'E':0, 'W':0, 'N':-1, 'S':1},
		opposite = {'E':'W', 'W':'E', 'N':'S', 'S':'N'};

	var carve_passage_from = function(cx, cy, grid) {
		directions = shuffle(['N', 'S', 'E', 'W']);

		directions.forEach(function(direction){
			var nx = cx + DX[direction],
				ny = cy + DY[direction];

			if ((ny >= 0 && ny <= width-1) && (nx >= 0 && nx <= height-1) && grid[ny][nx]==0) {
				grid[cy][cx] |= direction_values[direction];
				grid[ny][nx] |= direction_values[opposite[direction]];

				// small chance to extend passage
				if (Math.random()>.7) {
					var nnx = nx + DX[direction],
						nny = ny + DY[direction];
					if ((nny >= 0 && nny <= width-1) && (nnx >= 0 && nnx <= height-1) && grid[nny][nnx]==0) {
						grid[ny][nx] |= direction_values[direction];
						grid[nny][nnx] |= direction_values[opposite[direction]];
						carve_passage_from(nnx, nny, grid);
					}
				}
				carve_passage_from(nx, ny, grid);
			}
		});
	}

	var render = function(grid, view) {
		// clear maze first
		while (view.firstChild) {
			view.removeChild(view.firstChild);
		}
		grid.forEach(function(row, y){
			var tr = document.createElement("div");
			row.forEach(function(cell, x){
				var node = document.createElement("span"),
					node_class = document.createAttribute("class"),
					class_value = '';
				if (cell & direction_values['N']) class_value = class_value + 'N';
				if (cell & direction_values['S']) class_value = class_value + 'S';
				if (cell & direction_values['E']) class_value = class_value + 'E';
				if (cell & direction_values['W']) class_value = class_value + 'W';
				if (player.y == y && player.x ==x) class_value = 'char'
				node_class.value = class_value;
				node.setAttributeNode(node_class);
				node.innerHTML = '&nbsp;';
				tr.appendChild(node);
			});
			view.appendChild(tr);
		});
		document.body.appendChild(view);
	}

	var get_input = function(keysDown) {
		addEventListener("keydown", function(e) {
			//console.log("pressed: "+e.keyCode);
			keysDown[e.keyCode] = true;
			handle_input();
		}, false);

		addEventListener("keyup", function(e) {
			if (keysDown[e.keyCode]) {
				delete keysDown[e.keyCode];
			}
		}, false);
	}

	var handle_input = function() {
		var cell = grid[player.y][player.x];
		for (key in keysDown) {
			if (key==38 && cell&direction_values['N']) { //up
				player.y -= player.speed
			}
			if (key==40 && cell&direction_values['S']) { //down
				player.y += player.speed
			}
			if (key==37 && cell&direction_values['W']) { //left
				player.x -= player.speed
			}
			if (key==39 && cell&direction_values['E']) { //right
				player.x += player.speed
			}
		}
		render(grid, view);
	}

	var main = function() {
		init_grid(height, width, grid);
		carve_passage_from(0,0,grid);
		render(grid, view);
		get_input(keysDown);
	};

	return main();
});
