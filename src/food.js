;(function(exports) {
  var Food = exports.Food = function(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "yellow";
  };

  Food.prototype = {
  };
})(this);
