;(function(exports) {
  var Tree = exports.Tree = function(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
  };

  Tree.prototype = {
    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "green");
    }
  };
})(this);
