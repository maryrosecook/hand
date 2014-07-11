;(function(exports) {
  exports.RaftPiece = function RaftPiece(game, settings) {
    this.game = game;
    this.zindex = -2;
    this.vehicle = settings.vehicle;
    this.centerOffset = settings.centerOffset;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "#ECC88C";
  };

  RaftPiece.prototype = {
    die: function() {
      world.destroy(this);
    }
  };
})(this);
