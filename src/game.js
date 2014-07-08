;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 1008, 496, "blue");
    this.c.game = this;
    world.setup(this.c);
  };

  Game.GRID_SIZE = { x: 16, y: 16 };

  Game.DIR_TO_VECTOR = {
    LEFT: u.p(-Game.GRID_SIZE.x, 0),
    RIGHT: u.p(Game.GRID_SIZE.x, 0),
    UP: u.p(0, -Game.GRID_SIZE.y),
    DOWN: u.p(0, Game.GRID_SIZE.y )
  };

  Game.prototype = {
    update: function() {
      world.update();
    }
  };
})(this);
