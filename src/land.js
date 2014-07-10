;(function(exports) {
  exports.Land = function Land(game, settings) {
    this.game = game;
    this.zindex = -10;
    this.center = settings.center;
    this.landMass = settings.landMass;
    this.size = Game.GRID_SIZE;
    this.color = "white";
  };

  Land.prototype = {
  };
})(this);
