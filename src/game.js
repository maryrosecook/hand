;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 500, 500, "fff");
    this.mary = this.c.entities.create(Mary, {});

    this.c.entities.create(Fire, { center: u.p(100, 50) });
    this.c.entities.create(Tree, { center: u.p(100, 200) });
  };

  Game.GRID_SIZE = 10;

  Game.prototype = {
    update: function() {
      u.every(1000, function() {
        terrainer.stepFires(this.c);
        return true;
      }, this);
    }
  };

  var Mary = function(game, settings) {
    this.game = game;
    this.center = u.p(100, 100);
    this.size = u.p(10, 10);
    this.pack = [];
  };

  Mary.prototype = {
    update: function(delta) {
      this.move();
    },

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.c.entities.destroy(this);
      } else if (other instanceof Tree) {
        this.pickUp(other);
      }
    },

    pickUp: function(obj) {
      this.pack.push(obj);
      obj.center = undefined;
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
  };

  Fire.prototype = {
    update: function(delta) {
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "red");
    },

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.c.entities.destroy(this);
      }
    }
  };

  var Tree = function(game, settings) {
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
})(this);
