;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 500, 500, "blue");
    this.c.game = this;
    this.mary = this.c.entities.create(Mary, { center: u.p(100, 140) });
    world.setup(this.c);
  };

  Game.GRID_SIZE = { x: 10, y: 10 };

  var either = function(e1, e2, type) {
    if (e1 instanceof type) {
      return e1;
    } else if (e2 instanceof type) {
      return e2;
    }
  };

  Game.prototype = {
    update: function() {
      world.update();
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
})(this);
