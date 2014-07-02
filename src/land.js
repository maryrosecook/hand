;(function(exports) {
  var Land = exports.Land = function(game, settings) {
    this.game = game;
    this.zindex = -2;
    this.center = settings.center;
    this.size = u.p(10, 10);
  };

  Land.prototype = {
    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "white");
    }
  };
})(this);
