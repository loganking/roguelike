define([], function (){
	var view_id = document.createAttribute("id"),
		view = document.createElement("div");
	view_id.value = "maze";
	view.setAttributeNode(view_id);

	var render = function(props) {
		// clear maze first
		while (view.firstChild) {
			view.removeChild(view.firstChild);
		}
		props.grid.forEach(function(row, y){
			var tr = document.createElement("div");
			row.forEach(function(cell, x){
				var node = document.createElement("span"),
					node_class = document.createAttribute("class"),
					class_value = '',
					char = document.createElement("span");
				node.innerHTML = '&nbsp;';
				char.innerHTML = '&nbsp;';
				char.setAttribute('class', 'char')
				if (cell & props.direction_values['N']) class_value = class_value + 'N';
				if (cell & props.direction_values['S']) class_value = class_value + 'S';
				if (cell & props.direction_values['E']) class_value = class_value + 'E';
				if (cell & props.direction_values['W']) class_value = class_value + 'W';
				node_class.value = class_value;
				node.setAttributeNode(node_class);
				tr.appendChild(node);
				if (y==props.exit.y && x==props.exit.x) {
					node.appendChild(char);
				}
				if (props.player.y == y && props.player.x ==x) {
					node.appendChild(char);
				}
			});
			view.appendChild(tr);
		});
		document.body.appendChild(view);
	}
	
	return {
		render: render
	}

});
