;(function(exports) {
  exports.RaftPiece = function RaftPiece(game, settings) {
    this.game = game;
    this.zindex = -2;
    this.raft = settings.raft;
    this.centerOffset = settings.centerOffset;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "#ECC88C";
  };

  RaftPiece.prototype = {
    move: function(center) {
      world.move(this, center);
    },

    die: function() {
      world.destroy(this);
    }
  };
})(this);
