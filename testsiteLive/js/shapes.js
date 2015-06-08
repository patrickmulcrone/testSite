function genValue (value) {
	return parseInt( Math.random() * value );
}

function genRGBA() {
  return "rgba(" + genValue(255) + ", " + genValue(255) + ", " + genValue(255) + ", " + 0.25 + ")";
}

function circle (width, color) {
	return '<div class="circle" style="' 
		 + 'border-color: ' + color + '; ' 
		 + 'border-width: ' + width + 'px;"></div>';
}

function triangle (width, color) {
	return '<div class="triangle" style="' 
		 + 'border-bottom-color: ' + color + '; ' 
		 + 'border-width: 0 ' + width + 'px ' + width + 'px;"></div>';
}

function square (width, color) {
	return '<div class="square" style="' 
		 + 'border-color: ' + color + '; ' 
		 + 'border-width: ' + width + 'px;"></div>';
}

function shapes (count, size) {
	var color, width, type, styles;

	for (i = 1; i <= count; i++) {
		width = genValue (size); 
		type = genValue (3);
		color = genRGBA();

		styles = (type == 1) ? circle (width, color) :
				 		 (type == 2) ? triangle (width, color) : 
			        square (width, color);

		document.write(styles);
	};
}

var howMany = 1000, 

	  size = 10; 


shapes(howMany, size);