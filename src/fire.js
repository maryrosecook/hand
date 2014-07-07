;(function(exports) {
  exports.Fire = function Fire(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "red";

    var self = this;
    setTimeout(function() {
      world.destroy(self);
    }, Math.random() * 10000);
  };

  Fire.prototype = {
    update: function() {
      var cohabitors = world.atSquare(this.center);
      for (var i = 0; i < cohabitors.length; i++) {
        if (cohabitors[i] instanceof Mary) {
          world.destroy(this.game.mary);
        } else if (cohabitors[i] instanceof Tree) {
          world.destroy(cohabitors[i]);
        }
      }
    }
  };
})(this);
