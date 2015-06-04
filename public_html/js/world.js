define(['lodash/collection/shuffle'], function (shuffle){

	var height = 40,
		width = 40,
		DX = {'E':1, 'W':-1, 'N':0, 'S':0},
		DY = {'E':0, 'W':0, 'N':-1, 'S':1},
		opposite = {'E':'W', 'W':'E', 'N':'S', 'S':'N'};

	var init = function(props) {
		props.exit.x = Math.floor(Math.random()*width);
		props.exit.y = Math.floor(Math.random()*height);
		var h = height;
		while (h-- > 0) {
			var w = width;
			var row = [];
			while (w-- > 0) {
				row.push(0);
			}
			props.grid.push(row);
		}
		_carve_passage_from(null, null, props);
		//world.fill_alleys(grid);
	}

	var _carve_passage_from = function(cx, cy, props) {
		// set initial state if not set
		if (cx==null && cy==null) {
			cx = height/2;
			cy = width/2;
		}
		directions = shuffle(['N', 'S', 'E', 'W']);
		
		directions.forEach(function(direction){
			var nx = cx + DX[direction],
				ny = cy + DY[direction];
			if ((ny >= 0 && ny <= width-1) && (nx >= 0 && nx <= height-1) && props.grid[ny][nx]==0) {
				props.grid[cy][cx] |= props.direction_values[direction];
				props.grid[ny][nx] |= props.direction_values[opposite[direction]];
				_carve_passage_from(nx, ny, props);
			}
		});
	}

	var fill_alleys = function(grid) {
	}
	
	return {
		init: init
	}

});
