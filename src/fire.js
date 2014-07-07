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

  };
})(this);
