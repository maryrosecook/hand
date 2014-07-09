;(function(exports) {
  exports.Wood = function Wood(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "#592100";
  };

  Wood.prototype = {
    move: function(center) {
      world.move(this, center);
    },

    die: function() {
      world.destroy(this);
    }
  };
})(this);
