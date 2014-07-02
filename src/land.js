;(function(exports) {
  var Land = exports.Land = function(game, settings) {
    this.game = game;
    this.zindex = -2;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "white";
  };

  Land.prototype = {
  };
})(this);
