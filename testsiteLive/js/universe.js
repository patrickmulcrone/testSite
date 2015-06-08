
window.onload = function() {
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var PI_TWO = Math.PI * 2;
var TO_DEG = 180 / Math.PI;
var TO_RAD = Math.PI / 180;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var r = new Random(Random.engines.mt19937().autoSeed());

function HSL() {
  var h = arguments[0] === undefined ? 0 : arguments[0];
  var s = arguments[1] === undefined ? 80 : arguments[1];
  var l = arguments[2] === undefined ? 80 : arguments[2];

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

var Vector2 = function Vector2() {
  var x = arguments[0] === undefined ? 0 : arguments[0];
  var y = arguments[1] === undefined ? 0 : arguments[1];

  _classCallCheck(this, Vector2);

  this.x = x;
  this.y = y;
};

var Rectangle = (function (_Vector2) {
  function Rectangle(x, y) {
    _classCallCheck(this, Rectangle);

    _get(Object.getPrototypeOf(Rectangle.prototype), 'constructor', this).call(this, x, y);

    this.width = canvas.width;
    this.height = canvas.height;

    this.center = new Vector2(this.x + this.width / 2, this.y + this.height / 2);
  }

  _inherits(Rectangle, _Vector2);

  return Rectangle;
})(Vector2);

var center = new Vector2(canvas.width / 2, canvas.height / 2);
var camera = new Vector2(0, 0);
var mouse = new Vector2(0, 0);

var Dot = (function () {
  function Dot(options) {
    _classCallCheck(this, Dot);

    this.reset(options);
    this.index = options.index;
  }

  _createClass(Dot, [{
    key: 'reset',
    value: function reset(options) {

      this.position = new Vector2(options.x, options.y);
      this.color = options.color;
      this.radius = options.radius;
      this.angle = options.angle;
    }
  }, {
    key: 'getScreenPositionX',
    value: function getScreenPositionX() {
      return this.position.x - camera.x;
    }
  }, {
    key: 'getScreenPositionY',
    value: function getScreenPositionY() {
      return this.position.y - camera.y;
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'draw',
    value: function draw() {

      ctx.fillStyle = HSL(this.color);
      ctx.beginPath();
      ctx.arc(this.getScreenPositionX(), this.getScreenPositionY(), this.radius, PI_TWO, false);
      ctx.closePath();
      ctx.fill();
    }
  }]);

  return Dot;
})();

var Planet = (function (_Dot) {
  function Planet(options) {
    _classCallCheck(this, Planet);

    _get(Object.getPrototypeOf(Planet.prototype), 'constructor', this).call(this, options);
    this.system = options.system;
    this.maxRadius = options.maxRadius;
    this.rotatingSpeed = options.rotatingSpeed;
    this.radius += 0.01;
  }

  _inherits(Planet, _Dot);

  _createClass(Planet, [{
    key: 'update',
    value: function update() {

      if (this.system.dying == false || this.radius > 0.2) {

        this.angle += this.rotatingSpeed;
        this.position.x = this.system.position.x + Math.cos(this.angle) * this.system.radius;
        this.position.y = this.system.position.y + Math.sin(this.angle) * this.system.radius;

        if (this.system.dying == false) {
          this.radius += (this.maxRadius - this.radius) * 0.01;
        } else {
          this.radius += (0 - this.radius) * 0.01;
        }
      }
    }
  }, {
    key: 'draw',
    value: function draw() {

      if (this.system.dying == false || this.radius > 0.2) {
        _get(Object.getPrototypeOf(Planet.prototype), 'draw', this).call(this);
      }
    }
  }]);

  return Planet;
})(Dot);

var PlanetSystem = (function () {
  function PlanetSystem(options) {
    _classCallCheck(this, PlanetSystem);

    this.planets = [];
    this.position = new Vector2(options.x, options.y);
    this.maxRadius = options.radius;
    this.radius = 0;
    this.dying = false;

    // this.center = new Dot({
    //   x: this.position.x,
    //   y: this.position.y,
    //   radius: 2,
    //   color: 10,
    //   angle: 0,
    //   index: 0,
    //   rotatingSpeed: 0
    // });

    for (var i = 0; i < options.planetCount; i++) {

      var angle = i / options.planetCount * PI_TWO;

      var x = this.position.x + Math.cos(angle) * this.radius;
      var y = this.position.y + Math.sin(angle) * this.radius;

      this.planets[i] = new Planet({
        x: x,
        y: y,
        radius: 0,
        maxRadius: options.planetsSize,
        color: options.color,
        angle: angle,
        index: i,
        system: this,
        rotatingSpeed: options.rotatingSpeed
      });
    };
  }

  _createClass(PlanetSystem, [{
    key: 'update',
    value: function update() {

      for (var i = 0; i < this.planets.length; i++) {
        this.planets[i].update();
      };

      if (this.dying == false) {
        this.radius += (this.maxRadius - this.radius) * 0.05;
      }
    }
  }, {
    key: 'die',
    value: function die() {

      this.dying = true;

      this.radius += (0 - this.radius) * 0.05;
    }
  }, {
    key: 'draw',
    value: function draw() {

      for (var i = 0; i < this.planets.length; i++) {
        this.planets[i].draw();
      };

      //this.center.draw();
    }
  }]);

  return PlanetSystem;
})();

var Star = (function () {
  function Star(options) {
    _classCallCheck(this, Star);

    this.reset();
  }

  _createClass(Star, [{
    key: 'getScreenPositionX',
    value: function getScreenPositionX() {
      return (this.x - camera.x) * this.scrollFactor;
    }
  }, {
    key: 'getScreenPositionY',
    value: function getScreenPositionY() {
      return (this.y - camera.y) * this.scrollFactor;
    }
  }, {
    key: 'reset',
    value: function reset() {

      this.scrollFactor = r.real(0.2, 1);

      this.x = r.integer(camera.x * this.scrollFactor, (camera.x + canvas.width) * this.scrollFactor);
      this.y = r.integer(camera.y * this.scrollFactor, (camera.y + canvas.height) * this.scrollFactor);

      this.radius = 0;
      this.color = r.integer(0, 360);
    }
  }, {
    key: 'update',
    value: function update() {

      if (this.getScreenPositionX() > canvas.width || this.getScreenPositionY() > canvas.height || this.getScreenPositionX() < 0 || this.getScreenPositionY() < 0) this.reset();

      this.radius += (r.real(0.01, 3) - this.radius) * 0.1;
    }
  }, {
    key: 'draw',
    value: function draw() {
      ctx.fillStyle = HSL(0, 90, 90);
      ctx.fillRect(this.getScreenPositionX(), this.getScreenPositionY(), this.radius, this.radius);
      ctx.fill();
    }
  }]);

  return Star;
})();

var Galaxy = (function () {
  function Galaxy(x, y) {
    var quant = arguments[2] === undefined ? 10 : arguments[2];

    _classCallCheck(this, Galaxy);

    this.systems = [];
    this.bounds = new Rectangle(x, y);
    this.life = 0;

    for (var i = 0; i < quant; i++) {
      this.systems[i] = new PlanetSystem({
        //x: r.integer(this.bounds.x, this.bounds.x + this.bounds.width) ,
        //y: r.integer(this.bounds.y, this.bounds.y + this.bounds.height),
        x: this.bounds.center.x,
        y: this.bounds.center.y,
        radius: r.integer(0, 360),
        rotatingSpeed: r.bool() ? r.real(-0.002, -0.01) : r.real(0.001, 0.02),
        planetCount: r.integer(2, 20),
        color: r.integer(0, 360),
        planetsSize: r.integer(1, 3)
      });
    };
  }

  _createClass(Galaxy, [{
    key: 'update',
    value: function update() {

      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].update();
      };

      this.life += app.elapsed;
    }
  }, {
    key: 'die',
    value: function die() {

      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].die();
      };
    }
  }, {
    key: 'draw',
    value: function draw() {

      for (var i = 0; i < this.systems.length; i++) {
        this.systems[i].draw();
      };
    }
  }]);

  return Galaxy;
})();

function generateGalaraxy() {
  return new Galaxy(r.integer(0, 2500), r.integer(0, 2500), r.integer(10, 40));
}

var APP = (function () {
  function APP() {
    _classCallCheck(this, APP);

    this.currentGalaxy = 0;
    this.stars = [];

    for (var i = 0; i < 100; i++) {
      this.stars[i] = new Star({
        angle: 0,
        index: i
      });
    };

    this.currentGalaxy = new Galaxy(0, 0, r.integer(10, 40));
    this.lastGalaxy = generateGalaraxy();

    this.elapsed = 0;
    this.lastTick = Date.now();

    requestAnimationFrame(this.step.bind(this));
  }

  _createClass(APP, [{
    key: 'update',
    value: function update() {

      this.currentGalaxy.update();
      this.lastGalaxy.update();
      this.lastGalaxy.die();

      camera.x += (this.currentGalaxy.bounds.center.x - (camera.x + center.x)) * 0.05;
      camera.y += (this.currentGalaxy.bounds.center.y - (camera.y + center.y)) * 0.05;

      if (this.currentGalaxy.life > 6) {

        this.radius += (this.maxRadius - this.radius) * 0.05;
        this.lastGalaxy = this.currentGalaxy;
        this.currentGalaxy = generateGalaraxy();
      }

      for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].update();
      };
    }
  }, {
    key: 'draw',
    value: function draw() {

      this.currentGalaxy.draw();
      this.lastGalaxy.draw();

      for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].draw();
      };
    }
  }, {
    key: 'step',
    value: function step() {
      requestAnimationFrame(this.step.bind(this));

      var delta = Date.now() - this.lastTick;
      this.lastTick = Date.now();

      var dt = delta / 1000;

      this.elapsed = dt;

      ctx.fillStyle = 'rgba(24,24,24,1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.update();
      this.draw();
    }
  }]);

  return APP;
})();

var app = new APP();

window.addEventListener('resize', function () {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
});
};