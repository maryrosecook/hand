;(function(exports) {
  exports.Blood = function Blood(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "red";
  };

  Blood.prototype = {
    die: function() {
      world.destroy(this);
    }
  };
})(this);
