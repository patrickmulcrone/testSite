window.onload = function() {
		'use strict';

var canvas = document.getElementById('drip'),
    ctx = canvas.getContext('2d'),
    width = window.innerWidth,
    height = window.innerHeight,
    dots = [];

canvas.width = width;
canvas.height = height;

function dot(xRange, yRange) {
  this.xRange = xRange || 0;
  this.yRange = yRange || 0;

  this.init();
}

dot.prototype.init = function () {
  this.x = Math.random() * this.xRange;
  this.size = 1 + Math.random() * 20;
  this.y = -this.size;
  this.color = {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(30 + Math.random() * 20),
    v: Math.floor(50 + Math.random() * 20)
  };
  this.speed = 1 + Math.random();
};

dot.prototype.update = function () {
  this.y += this.speed;
  if (this.y > this.yRange) {
    this.init();
  }
};

dot.prototype.render = function () {
  ctx.fillStyle = 'hsl(' + this.color.h + ',' + this.color.s + '% ,' + this.color.v + '%)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 2;
  ctx.shadowColor = 'hsl(' + this.color.h + ', 40% ,50%';
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

function init() {
  for (var i = 0; i < 100; i++) {
    dots.push(new dot(canvas.width, canvas.height));
  }
  update();
}

function update() {
  dots.forEach(function (e) {
    e.update();
  });
  render();
}

function render() {
  requestAnimationFrame(update);
  dots.forEach(function (e) {
    e.render();
  });
}

init();
};


