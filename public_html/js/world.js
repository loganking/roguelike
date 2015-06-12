define(['lodash/collection/shuffle'], function (shuffle){

	var height = 40,
		width = 40,
		// @todo adjust sparesness equations so that value is accurate percentage (logarithmic functions?)
		sparseness = .09, // measure of room density
		minRoomWidth = 3,
		maxRoomWidth = 9,
		// @todo implement room bias
		roomBias = .5, // 0-1 measure of horizontal/vertical bias
		alleysToFill = .75, // percentage of alleys that should be filled
		DX = {'E':1, 'W':-1, 'N':0, 'S':0},
		DY = {'E':0, 'W':0, 'N':-1, 'S':1},
		opposite = {'E':'W', 'W':'E', 'N':'S', 'S':'N'},
		rooms = [];

	//@todo rooms will need to be higher property and passed alongside world grid

	var init = function(props) {
		// set tunable vars


		props.exit.x = Math.floor(Math.random()*width);
		props.exit.y = Math.floor(Math.random()*height);
		_initGrid(props.grid);
		_generateRooms(props);
		_generatePassages(props);
		_connectRegions(props);
		_fillAlleys(props);
		_generatePlayerStart(props);
		_generatePlayerExit(props);
		
		// assign tile properties
		// add necessary items to list for level (keys, etc)
	}

	var _initGrid = function(grid) {
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

	var _generateRooms = function(props) {
		var _tries = height*width*sparseness;
		
		// try placing rooms up to number of _tries
		tryrooms: for (var _i=0; _i<_tries; _i++) {
			// generate room
			var _room = {};
			_room.width = Math.round(Math.random()*(maxRoomWidth-minRoomWidth))+minRoomWidth;
			_room.height = Math.round(Math.random()*(maxRoomWidth-minRoomWidth))+minRoomWidth;
			_room.x = Math.floor(Math.random()*width);
			_room.y = Math.floor(Math.random()*height);
			_room.exits = [];
			
			// check if room is valid
			if (_room.x<0 || _room.y<0 || (_room.x+_room.width)>width || (_room.y+_room.height)>height) {
				continue tryrooms;
			}
			for (var other in rooms) {
				if (_isRoomOverlapping(_room, rooms[other])) {
					continue tryrooms; // throw away room attempt as it overlaps and continue with next attempt
				}
			}
			
			// generate room exit(s)
			var EX = [_room.x, (_room.x+_room.width-1)],
				EDX = ['W', 'E'],
				EY = [_room.y, (_room.y+_room.height-1)],
				EDY = ['N', 'S'];
			// at least one exit will always be generated
			var i=0
			while (i<.3) {
				var _exit = {};
				var rand = Math.round(Math.random());
				if (Math.random()<.5) {
					_exit.x = EX[rand];
					_exit.y = Math.round(Math.random()*(_room.height-2))+1+_room.y;
					_exit.direction = EDX[rand];
				} else {
					_exit.x = Math.round(Math.random()*(_room.width-2))+1+_room.x;
					_exit.y = EY[rand];
					_exit.direction = EDY[rand];
				}
				
				// check that exit is valid
				// we continue the loop if it's not
				if ((_exit.x==0 || _exit.x==width-1) ||
					(_exit.y==0 || _exit.y==height-1) ||
					(_exit.x==_room.x && _exit.y==_room.y) ||
					(_exit.x==(_room.x+_room.width-1) && _exit.y==_room.y) ||
					(_exit.x==_room.x && _exit.y==(_room.y+_room.height-1)) ||
					(_exit.x==(_room.x+_room.width-1) && _exit.y==(_room.y+_room.height-1))
					) continue;
				
				_room.exits.push(_exit);
				i=Math.random()
			}
			
			rooms.push(_room);
		}

		// now add rooms to world grid
		for (var room in rooms) {
			var _room = rooms[room];
			for (var x=_room.x; x<(_room.x+_room.width); x++) {
				for (var y=_room.y; y<(_room.y+_room.height); y++) {
					var cell = (props.direction_values['N'] | props.direction_values['E'] | props.direction_values['S'] | props.direction_values['W']);
					if (x==_room.x) cell ^= props.direction_values['W'];
					if (x==(_room.x+_room.width-1)) cell ^= props.direction_values['E'];
					if (y==_room.y) cell ^= props.direction_values['N'];
					if (y==(_room.y+_room.height-1)) cell ^= props.direction_values['S'];
					props.grid[y][x] = cell;
				}
			}
		}
	}

	var _isRoomOverlapping = function(room, other) {
		return !(other.x > (room.x + room.width) ||
				(other.x + other.width) < room.x ||
				other.y > (room.y + room.height) ||
				(other.y + other.height) < room.y);
	}

	var _placeRoom = function(grid) {
	}

	var _generatePassages = function(props) {
		var x = height/2,
			y = width/2;
		
		// make sure that initial position is in empty cell
		while (props.grid[y][x]!=0) {
			x = Math.floor(Math.random()*width);
			y = Math.floor(Math.random()*height);
		}
		
		_carve_passage_from(x, y, props);
	}

	// define check for valid passages
	var _isValidPassage = function(x, y, grid) {
		
		// is cell within bounds?
		if (x < 0 || x > height-1) return false;
		if (y < 0 || y > width-1) return false;
		
		// has cell already been carved?
		if (grid[y][x] !=0 ) return false;
		
		return true;
	}

	// recursive backtracker algorithm
	var _carve_passage_from = function(cx, cy, props) {
		// shuffle directions for random tries
		directions = shuffle(['N', 'S', 'E', 'W']);
		
		// try to carve passages
		directions.forEach(function(direction){
			var nx = cx + DX[direction],
				ny = cy + DY[direction];
			if (_isValidPassage(nx, ny, props.grid)) {
				props.grid[cy][cx] |= props.direction_values[direction];
				props.grid[ny][nx] |= props.direction_values[opposite[direction]];
				
				// chance to extend passage
				// @todo should this be tunable?
				if (Math.random()<.75) {
					var nnx = nx + DX[direction],
						nny = ny + DY[direction];
					if (_isValidPassage(nnx, nny, props.grid)) {
						props.grid[ny][nx] |= props.direction_values[direction];
						props.grid[nny][nnx] |= props.direction_values[opposite[direction]];
						_carve_passage_from(nnx, nny, props);
					}
				}
				
				_carve_passage_from(nx, ny, props);
			}
		});
	}

	// connects rooms to passages
	var _connectRegions = function(props) {
		for (var room in rooms) {
			var _room = rooms[room];
			for (exit in _room.exits) {
				var _exit = _room.exits[exit];
				var cell = (props.direction_values['N'] | props.direction_values['E'] | props.direction_values['S'] | props.direction_values['W']);
				props.grid[_exit.y][_exit.x] = cell;
				props.grid[_exit.y+DY[_exit.direction]][_exit.x+DX[_exit.direction]] |= props.direction_values[opposite[_exit.direction]];
			};
		}
	}

	var _fillAlleys = function(props) {
		_alleys = [];
		// loop over all cells checking for alleys
		props.grid.forEach(function(row, y){
			row.forEach(function(cell, x){
				for (direction in props.direction_values) {
					if (cell == props.direction_values[direction]) {
						_alleys.push([x, y]);
					}
				}
			});
		});
		
		// recursively fill the alleys found, leaving percentage open
		_alleys.forEach(function(alley) {
			if (Math.random() < alleysToFill) {
				_fillAlley(props, alley);
			}
		});
	}

	_fillAlley = function(props, cell) {
		var x = cell[0],
			y = cell[1];
		var _alleyDirection,
			_newCell,
			ny,
			nx;
		for (direction in props.direction_values) {
			if (props.grid[y][x] == props.direction_values[direction]) _alleyDirection = direction;
		}
		props.grid[y][x] = 0;
		ny = y+DY[_alleyDirection];
		nx = x+DX[_alleyDirection];
		props.grid[ny][nx] ^= props.direction_values[opposite[_alleyDirection]];
		_newCell = props.grid[ny][nx];
		for (direction in props.direction_values) {
			if (_newCell == props.direction_values[direction]) {
				_fillAlley(props, [nx, ny]);
			}
		}
	}

	var _generatePlayerStart = function(props) {
		var _rooms = shuffle(rooms),
			_room = _rooms.shift();
		props.player.x = Math.floor(Math.random()*_room.width)+_room.x;
		props.player.y = Math.floor(Math.random()*_room.height)+_room.y;
	}

	var _generatePlayerExit = function(props) {
		var _rooms = shuffle(rooms),
			_room = _rooms.shift(),
			_distance = Math.sqrt((height*height)+(width*width))/2;
		props.exit.x = Math.floor(Math.random()*_room.width)+_room.x;
		props.exit.y = Math.floor(Math.random()*_room.height)+_room.y;
		while (_calculateDistance(props.player, props.exit) < _distance) {
			_room = _rooms.shift();
			props.exit.x = Math.floor(Math.random()*_room.width)+_room.x;
			props.exit.y = Math.floor(Math.random()*_room.height)+_room.y;
		}
		// @todo it's possible that an exit won't be generated because the distance from the start won't be far enough...
	}

	var _calculateDistance = function(a, b) {
		var _h,
			_w;
		if (a.x > b.x) {
			_w = a.x-b.x;
		} else {
			_w = b.x-a.x;
		}
		if (a.y > b.y) {
			_h = a.y-b.y;
		} else {
			_h = b.y-a.y;
		}
		return Math.sqrt((_w*_w)+(_h*_h));
	}

	return {
		init: init
	}
});
