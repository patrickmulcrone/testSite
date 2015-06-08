
var hc = {
  worlds: [],
  startTime: null,
  anim: null,
  summon: function() {
    for (key in arguments) {
    	this.worlds.push(arguments[key]);
    }
  },
  ignite: function() {
    this.startTime = new Date().getTime();
    this.igniteWorlds();
    this.frame();
  },
  frame: function() {
    hc.paint(new Date().getTime());
    hc.anim = window.requestAnimationFrame(hc.frame);
  },
  paint: function(t) {
    for (key in hc.worlds) {
      (function(k) {
        setTimeout(function() {
          hc.worlds[k].world.update(t - hc.startTime);
        }, hc.worlds[k].timeout);
      })(key);
    }
  },
  igniteWorlds: function() {
    for (key in hc.worlds) {
 			hc.worlds[key].world.ignite(hc.worlds[key].args);
    }
  }
};


var hc_rhodo = {
  name: "rhodo",
  ignite: function(args) {
    // Store arguments
    //// Base hue (see seedRadiusToHue) and luminosity
    this.hue = args.hue || 0;
    this.lum = args.lum || '50%';
    //// Branches
    this.seedsPop = args.seedsPop || 5;
    //// Base width (check out seedRadiusToLineWidth)
    this.sepalBase = args.sepalBase || 15;
    //// Branch length (check out seedRadiusToLineWidth)
    this.sepalLength = args.sepalLength || 10;
    //// Angle offset for flower branches
    this.extraAngle = args.extraAngle || 0;
    //// Birth speed
    this.eraDuration = args.eraDuration || 25;
    //// Design functions mapping radius to various visual parameters
    this.seedRadiusToHue = args.seedRadiusToHue || (function(r) {
      return (this.hue + r/20);
    });
    this.seedRadiusToLineWidth = args.seedRadiusToLineWidth || (function(r) {
      return (2 * Math.max(this.sepalBase - r / this.sepalLength, 0));
  	});
    this.seedRadiusToOpacity = args.seedRadiusToOpacity || (function(r) {
      return 0.01;
  	});
    
    // Initialize own canvas
    var canvas = document.createElement('canvas');
    canvas.class = "hart";
    canvas.id = this.name;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
	
    // Get and store canvas context
    this.canvas = document.getElementById(canvas.id);
    this.ctx = this.canvas.getContext('2d');

    // Variable 1
    this.var1 = 0;
    this.var1count = 0;
    this.var1var = 200;

    // Variable 2
    this.var2 = 0;

    // Variable 3 (births)
    this.eraCount = 0;//Needs this.eraDuration

    // Particles
    this.seeds = [];
    //// Start point
    this.xC = this.canvas.width / 2;
    this.yC = this.canvas.height / 2;
    //// Unleash generation 1
    for (var i = 0; i < this.seedsPop; i++) {
      var datsMyAngle = i / this.seedsPop * 2 * Math.PI;
      this.birth({
        rLast: 0,
        r: 0,
        rSpeed: 0,
        thetaLast: this.extraAngle + datsMyAngle,
        theta: this.extraAngle + datsMyAngle,
        thetaSpeed: 0 // Add r and theta to contructor
      });
    }
    
  },
  background: function() {
    // Not called, background in CSS this time.
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#eee";
    this.ctx.fill();
  },
  update: function(t) {
    this.evolve(t);
    this.move(t);
    this.draw();
  },
  evolve: function(t) {
    // Laws (increasing a variable)
    this.evolutionVar1();
    this.evolutionVar2(t);
    this.evolutionVar3();
    // Effects (when this variable reaches a threshold, do sth)
  },
  evolutionVar1: function() {
    this.var1count++;
    this.var1 = 0.5 + 0.5 * Math.sin(this.var1count / this.var1var * 2 * Math.PI);
  },
  evolutionVar2: function(t) {
    this.var2 = Math.sin(t / 700);
  },
  evolutionVar3: function() {
    this.eraCount++;
  },
  move: function(t) {
    // Time flies, buddy.
    var t = t / 500;
		
    // Move all particles
    for (var i = 0; i < this.seeds.length; i++) {
      var seed = this.seeds[i];
      seed.rLast = seed.r;
      seed.thetaLast = seed.theta;

      // Mirror seeds alternatively (not used)
      //var way = (i % 2 == 0 ? 1 : -1);
			
      // Core motion laws
      seed.rSpeed = 0.8 + 0.5 * Math.sin(t);
      seed.thetaSpeed += 0.0005 * (-0.5 + Math.random());

      // Calmers
      seed.thetaSpeed = Math.max(Math.min(seed.thetaSpeed, 0.005), -0.005);
			
      // Dummy physics
      seed.theta += seed.thetaSpeed;
      seed.r += seed.rSpeed;
    }
    
    // Give birth to new particles every now and then
    if (this.eraCount >= this.eraDuration && this.seeds.length < 500) {
      // Take the (this.seedPop) last particles and clone
      var len = this.seeds.length;
      for (var j = len - 1; j >= len - this.seedsPop; j--) {
        var seedClone = _.clone(this.seeds[j]);
        
        // Give extra motion for a better life :')
        var splitRatio = 0.33;//will bend sepals even more with values close to 0 or 1
        var thetaSpeedExtra = 0.0005 * (Math.random() > splitRatio ? 1 : -1);
        seedClone.thetaSpeed += thetaSpeedExtra;
   			
        // Push to this.seeds
        this.birth(seedClone);
      }
      this.eraCount = 0;//nope, you don't want this code to freeze your browser
    }
  },
  draw: function() {
    for (key in this.seeds) {
      var seed = this.seeds[key];
      this.drawFlower(seed);
    }
  },
  drawFlower: function(seed) {  
		// Switch to XY space
    var sSold = this.spaceShift(seed.rLast, seed.thetaLast);
    var sSnew = this.spaceShift(seed.r, seed.theta);
    
    // HSLA
    var h = this.seedRadiusToHue(seed.r);
    var sat = '80%';
    var lum = this.lum;
    var opa = this.seedRadiusToOpacity(seed.r);
	
    // Line width
    var wLine = this.seedRadiusToLineWidth(seed.r);
    
    // 1: Backlight
    this.ctx.strokeStyle = 'hsla(' + h + ', ' + sat + ', ' + lum + ", " + opa + ")";
    this.ctx.lineWidth = wLine;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(sSold.x, sSold.y);
    this.ctx.lineTo(sSnew.x, sSnew.y);
    this.ctx.stroke();

    // 2: Front stroke
    this.ctx.strokeStyle = 'hsla(' + h + ', ' + sat + ', ' + lum + ", " + opa/2 + ")";
    this.ctx.lineWidth = wLine;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(sSold.x, sSold.y);
    this.ctx.lineTo(sSnew.x, sSnew.y);
    this.ctx.stroke();
  },
  birth: function(seed) {
    this.seeds.push(seed);
  },
  spaceShift: function(r, theta) {
    var x = this.xC + r * Math.cos(theta);
    var y = this.yC - r * Math.sin(-theta);
    return {
      x: x,
      y: y
    };
  }
};

// Second flower
var hc_rhodo2 = _.cloneDeep(hc_rhodo);
hc_rhodo2.name = 'rhodo2';

// Third flower
var hc_rhodo3 = _.cloneDeep(hc_rhodo);
hc_rhodo3.name = 'rhodo3';

// Fourth flower
var hc_rhodo4 = _.cloneDeep(hc_rhodo);
hc_rhodo4.name = 'rhodo4';

// Flower time
hc.summon({
  world: hc_rhodo,
  timeout: 9000,
  args: {
    hue: 195,
    lum: '100%',
    sepalBase: 30,
    sepalLength: 15,
    eraDuration: 25,
    extraAngle: 0,
    seedRadiusToLineWidth: function(r) {
      //return (this.sepalBase * Math.exp( - r / this.sepalLength ));
      return (this.sepalBase - r / this.sepalLength);
  	},
    seedRadiusToOpacity: function(r) {
      return (0.07 * (1 - Math.exp(-r/150)) );
    }
  }
}, {
  world: hc_rhodo2,
  timeout: 6000,
  args: {
    //hue: 195,
    hue: 0,
    lum: '50%',
    sepalBase: 50,
    sepalLength: 135,
    eraDuration: 8,
    extraAngle: 0.314,
    seedRadiusToHue: function(r) {
      var result = this.hue + r / 8;
      result = Math.min(result, this.hue + 40);
      return result;
    },
    seedRadiusToLineWidth: function(r) {
      return (this.sepalBase * Math.exp( - r / this.sepalLength ));
  	},
    seedRadiusToOpacity: function(r) {
      return (0.1 * (1 - Math.exp(-r/100)) );
    }
  }
}, {
  world: hc_rhodo3,
  timeout: 3000,
  args: {
    hue: 200,
    lum: '100%',
    sepalBase: 15,
    sepalLength: 15,
    extraAngle: 0.628,
    seedRadiusToHue: function(r) {
      return (this.hue + r / 6);
    },
    seedRadiusToOpacity: function(r) {
      return (0.05);
  	}
  }
}, {
  world: hc_rhodo4,
  timeout: 0,
  args: {
    hue: 0,
    lum: '40%',
    sepalBase: 20,
    sepalLength: 35,
    eraDuration: 3,
    extraAngle: 0.628,
    seedRadiusToOpacity: function(r) {
      return (0.03);
  	},
    seedRadiusToLineWidth: function(r) {
      return (this.sepalBase * Math.exp( - r / this.sepalLength ));
  	},
    seedRadiusToHue: function(r) {
      return (this.hue + r / 2);
    },
  }
});

// Go, go, go!
hc.ignite();