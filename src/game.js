;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 500, 500, "blue");
    this.c.game = this;
    this.mary = this.c.entities.create(Mary, { center: u.p(100, 140) });
    world.setup(this.c);
  };

  Game.GRID_SIZE = { x: 10, y: 10 };

  Game.prototype = {
    update: function() {
      world.update();
    },

    collision: function(e1, e2) {
      var c = new Collision(e1, e2);
      if (c.g(Mary) && c.g(Fire)) {
        this.c.entities.destroy(c.g(Mary));
      } else if (c.g(Fire) && c.g(Tree)) {
        this.c.entities.destroy(c.g(Tree));
      } else if (c.g(Tree) && c.g(Food)) {
        c.g(Mary).pickUp(c.g(Food));
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
