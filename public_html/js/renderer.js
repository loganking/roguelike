define([], function (){

  var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    sprite = new Image(),
    spriteSourceWidth = 8,
    spriteCanvasWidth = 10,
    sx,
    sy;
  canvas.style = 'position:absolute; top:0; left:0;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  sprite.src = 'sprite.png';
  //@todo use image onLoad event listener to ensure sprite is loaded

  var canvasRender = function(props) {
		// clear maze first
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		props.grid.forEach(function(row, y){
			row.forEach(function(cell, x){
				var class_value = '';
        // draw map bounds
				if (cell & props.direction_values['N']) class_value = class_value + 'N';
				if (cell & props.direction_values['S']) class_value = class_value + 'S';
				if (cell & props.direction_values['E']) class_value = class_value + 'E';
				if (cell & props.direction_values['W']) class_value = class_value + 'W';
        spriteVals = mapClass(class_value);
        ctx.drawImage(sprite, spriteVals.x, spriteVals.y, spriteSourceWidth, spriteSourceWidth, x*spriteCanvasWidth, y*spriteCanvasWidth, spriteCanvasWidth, spriteCanvasWidth);
				// draw exit
				if (y==props.exit.y && x==props.exit.x) {
          ctx.drawImage(sprite, 24, 24, spriteSourceWidth, spriteSourceWidth, x*spriteCanvasWidth, y*spriteCanvasWidth, spriteCanvasWidth, spriteCanvasWidth);
				}
        // draw char
				if (props.player.y == y && props.player.x ==x) {
          ctx.drawImage(sprite, 24, 24, spriteSourceWidth, spriteSourceWidth, x*spriteCanvasWidth, y*spriteCanvasWidth, spriteCanvasWidth, spriteCanvasWidth);
				}
			});
		});
  }

  var mapClass = function(value){
    var map = {}
    map['N'] = {x: 0, y:0}
    map['NS'] = {x: 8, y:0}
    map['NE'] = {x: 16, y:0}
    map['NW'] = {x: 24, y:0}
    map['NSE'] = {x: 0, y:8}
    map['NSW'] = {x: 8, y:8}
    map['NEW'] = {x: 16, y:8}
    map['NSEW'] = {x: 24, y:8}
    map['S'] = {x: 0, y:16}
    map['SE'] = {x: 8, y:16}
    map['SW'] = {x: 16, y:16}
    map['SEW'] = {x: 24, y:16}
    map['S'] = {x: 0, y:24}
    map['EW'] = {x: 8, y:24}
    map['W'] = {x: 16, y:24}
    if (map[value]) return map[value];
    return {x:32, y:0}
  }
	
	return {
		render: canvasRender
	}

});
