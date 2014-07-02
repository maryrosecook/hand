;(function(exports) {
  var Tree = exports.Tree = function(game, settings) {
    this.game = game;
    this.zindex = -1;
    this.center = settings.center;
    this.size = u.p(10, 10);
  };

  Tree.prototype = {
    draw: function(screen) {
      if (this.center !== undefined) {
        drawer.rect(screen, this.center, this.size, "green");
      }
    }
  };
})(this);
