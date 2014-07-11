;(function(exports) {
  exports.Cockpit = function Cockpit(game, settings) {
    this.game = game;
    this.zindex = 0;
    this.vehicle = settings.vehicle;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "#B19769";
  };

  Cockpit.prototype = {
  };
})(this);
