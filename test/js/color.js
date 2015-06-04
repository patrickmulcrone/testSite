var color = color || {};
//
color.shadeColor = function(hex, lum) {
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
};

var basecolors = ["#2ecc71", "#1abc9c", "#9b59b6", "#3498db", "#e67e22", "#e74c3c"]; 
var pixelconst = 50;

function Background(){
	this.tiles = this.generateTiles();
}

Background.prototype.generateTiles = function(){
	var tiles = [];
	var numPixHeight = Math.ceil(window.innerHeight / pixelconst);
	var numPixWidth = Math.ceil(window.innerWidth / pixelconst);
	
	var numtiles = numPixHeight * numPixWidth;
	
	for (var i = 0; i < numtiles; i++) {
		var color = Math.floor(Math.random() * basecolors.length);
		
		tiles.push({
			color: basecolors[color], 
			shadervelocity: Math.random() * (0.005 - 0.0001) + 0.0001, 
			shadervalue: 0, 
			shadermax: Math.random() * (0.60 - 0.20) + 0.20,
			movingup: true
		});
	}
	return tiles;
};

Background.prototype.animateTiles = function(ctx){
	var numPixHeight = Math.ceil(window.innerHeight / pixelconst);
	var numPixWidth = Math.ceil(window.innerWidth / pixelconst);
	
	var oindex = 0;
	var ypos = 0;
	var xpos = 0;
	for (var i = 0; i < numPixHeight; i++) {
		for (var e = 0; e < numPixWidth; e++) {
			if(this.tiles[oindex].movingup){
				this.tiles[oindex].shadervalue += this.tiles[oindex].shadervelocity;
			} else{
				this.tiles[oindex].shadervalue -= this.tiles[oindex].shadervelocity;
			}
			
			if(this.tiles[oindex].shadervalue > this.tiles[oindex].shadermax){
				this.tiles[oindex].movingup = false;
			} else if(this.tiles[oindex].shadervalue < 0){
				this.tiles[oindex].movingup = true;
			}
			
			ctx.fillStyle = color.shadeColor(this.tiles[oindex].color, this.tiles[oindex].shadervalue);
			ctx.fillRect(xpos, ypos, pixelconst, pixelconst);
			
			oindex++;
			xpos += pixelconst;
		}
		ypos += pixelconst;
		xpos = 0;
	}
};

function CanvasState(canvas){
  var self = this;
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.background = new Background();
  
  window.requestAnimationFrame(function(){self.draw();});
}

CanvasState.prototype.clear = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
	this.ctx.save();
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.ctx.restore();
};

CanvasState.prototype.draw = function() {
  var self = this;
	this.clear();
  this.background.animateTiles(this.ctx);
  window.requestAnimationFrame(function(){self.draw();});
};

var canvasel = document.getElementById("ColorExplash");
var s = new CanvasState(canvasel);
