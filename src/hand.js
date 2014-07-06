;(function(exports) {
  var Hand = exports.Hand = function Hand(game, settings) {
    this.game = game;
    this.zindex = 2;
    this.maryMovedTo(settings.maryCenter, "UP");
    this.moveBlockers = settings.moveBlockers;
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

    isCarrying: function(testItem) {
      return this.carrying !== undefined &&
        (testItem === undefined || this.carrying === testItem);
    },

    dropIfCarrying: function() {
      if (this.isCarrying()) {
        this.carrying = undefined;
      }
    },

    isMoveClear: function(maryCenter, dir) {
      return !this.isCarrying() ||
        this.game.isClear(u.vAdd(maryCenter, Game.DIR_TO_VECTOR[dir]),
                          this.moveBlockers);
    },

    maryMovedTo: function(center, dir) {
      this.center = u.vAdd(center, Game.DIR_TO_VECTOR[dir]);
      if (this.isCarrying()) {
        this.carrying.center = u.cp(this.center);
      }
    }
  };
})(this);
