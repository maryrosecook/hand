;(function(exports) {
  exports.Hand = function Hand(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
  };

  Hand.prototype = {
    draw: function(screen) {
      screen.strokeStyle = "black";
      screen.strokeRect(this.center.x - this.size.x / 2 + 0.5,
                        this.center.y - this.size.y / 2 + 0.5,
                        this.size.x - 1, this.size.y - 1);

    }
  };
})(this);
