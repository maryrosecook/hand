;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 500, 500, "blue");
    this.c.game = this;
    this.mary = this.c.entities.create(Mary, {});

    this.c.entities.create(Fire, { center: u.p(100, 20) });
    // terrainer.createForest(this.c, u.p(300, 300));
    terrainer.createIsland(this.c, u.p(80, 80));
  };

  Game.GRID_SIZE = 10;

  var either = function(e1, e2, type) {
    if (e1 instanceof type) {
      return e1;
    } else if (e2 instanceof type) {
      return e2;
    }
  };

  Game.prototype = {
    update: function() {
      if (Math.random() > 0.1) {
        terrainer.stepFires(this.c);
      }
    },

    collision: function(e1, e2) {
      if (either(e1, e2, Mary) && either(e1, e2, Fire)) {
        this.c.entities.destroy(either(e1, e2, Mary));
      } else if (either(e1, e2, Tree) && either(e1, e2, Fire)) {
        this.c.entities.destroy(either(e1, e2, Tree));
      }
    },

    isClear: function(center, types) {
      return !_.some(this.c.entities.all(), function(e) {
        return e.center !== undefined &&
          e.center.x === center.x &&
          e.center.y === center.y &&
          (types === undefined ||
           _.any(types, function(type) { return e instanceof type; }));
      });
    }
  };

  var Mary = exports.Mary = function(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = u.p(100, 100);
    this.size = u.p(10, 10);
    this.pack = [];
  };

  Mary.prototype = {
    update: function(delta) {
      this.move();
      this.game.c.renderer.setViewCenter(this.center);
    },

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.c.entities.destroy(this);
      }
    },

    pickUp: function(obj) {
      this.pack.push(obj);
      obj.center = undefined;
    },

    clearForMoving: function(center) {

    },

    move: function() {
      u.every(100, function() {
        var moved;
        if (this.game.c.inputter.isDown(this.game.c.inputter.LEFT_ARROW)) {
          this.center.x -= Game.GRID_SIZE;
          moved = true;
        } else if (this.game.c.inputter.isDown(this.game.c.inputter.RIGHT_ARROW)) {
          this.center.x += Game.GRID_SIZE;
          moved = true;
        }

        if (this.game.c.inputter.isDown(this.game.c.inputter.UP_ARROW)) {
          this.center.y -= Game.GRID_SIZE;
          moved = true;
        } else if (this.game.c.inputter.isDown(this.game.c.inputter.DOWN_ARROW)) {
          this.center.y += Game.GRID_SIZE;
          moved = true;
        };

        return moved;
      }, this);
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "#000");
    }
  };

  var Fire = exports.Fire = function(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.size = u.p(10, 10);
    this.color = "red";
  };

  Fire.prototype = {
    update: function(delta) {
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, this.color);
    },

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.resolveCollision(this, other);
      }
    }
  };

  var Tree = exports.Tree = function(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.size = u.p(10, 10);
  };

  Tree.prototype = {
    update: function(delta) {
    },

    draw: function(screen) {
      if (this.center !== undefined) {
        drawer.rect(screen, this.center, this.size, "green");
      }
    }
  };

  var Land = exports.Land = function(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = u.p(10, 10);
  };

  Land.prototype = {
    update: function(delta) {
    },

    draw: function(screen) {
      if (this.center !== undefined) {
        drawer.rect(screen, this.center, this.size, "white");
      }
    }
  };
})(this);
