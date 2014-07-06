;(function(exports) {
  var Hand = exports.Hand = function Hand(game, settings) {
    this.game = game;
    this.zindex = 2;
    this.maryMovedTo(settings.mary.center, "UP");
    this.mary = settings.mary;
    this.size = Game.GRID_SIZE;
  };

  Hand.prototype = {
    update: function() {
      if (this.game.c.inputter.isDown(this.game.c.inputter.SPACE)) {
        this.mary.consume(this.center);
      }

      if (this.game.c.inputter.isDown(this.game.c.inputter.CONTROL)) {
        var entity = this.game.getPickUpabbleEntityAtSquare(this.center);
        if (entity instanceof Person || entity instanceof Food) {
          this.pickUp(entity);
        }
      } else {
        this.dropIfCarrying();
      }
    },

    draw: function(screen) {
      screen.strokeStyle = "black";
      screen.strokeRect(this.center.x - this.size.x / 2 + 0.5,
                        this.center.y - this.size.y / 2 + 0.5,
                        this.size.x - 1, this.size.y - 1);

    },

    carrying: undefined,
    pickUp: function(entity) {
      this.carrying = entity;
    },

    dropIfCarrying: function() {
      if (this.carrying !== undefined) {
        this.carrying = undefined;
      }
    },

    maryMovedTo: function(center, dir) {
      this.center = u.vAdd(center, Game.DIR_TO_VECTOR[dir]);
      if (this.carrying !== undefined) {
        this.carrying.center = u.cp(this.center);
      }
    }
  };
})(this);
