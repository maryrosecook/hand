;(function(exports) {
  var Person = exports.Person = function(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "gray";
  };

  Person.prototype = {

  };
})(this);
