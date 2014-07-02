;(function(exports) {
  var Fire = exports.Fire = function(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "red";

    var self = this;
    setTimeout(function() {
      game.c.entities.destroy(self);
    }, Math.random() * 10000);
  };

  Fire.prototype = {

  };
})(this);
