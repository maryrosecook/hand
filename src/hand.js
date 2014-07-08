;(function(exports) {
  var Hand = exports.Hand = function Hand(game, settings) {
    this.game = game;
    this.zindex = 2;
    this.center = u.vAdd(settings.maryCenter, Game.DIR_TO_VECTOR["UP"]);
    this.mary = settings.mary;
    this.size = Game.GRID_SIZE;
  };

  Hand.prototype = {
    update: function() {
      if (this.game.c.inputter.isDown(this.game.c.inputter.SPACE)) {
        this.mary.consume(this.center);
      }

      if (this.game.c.inputter.isDown(this.game.c.inputter.CONTROL)) {
        var entity = world.getPickUpabbleEntityAtSquare(this.center);
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
      if (entity.pickedUp !== undefined) {
        entity.pickedUp();
      }
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
        world.isClear(u.vAdd(maryCenter, Game.DIR_TO_VECTOR[dir]),
                      world.MOVE_BLOCKERS);
    },

    maryMovedTo: function(center, dir) {
      world.move(this, u.vAdd(center, Game.DIR_TO_VECTOR[dir]));
      if (this.isCarrying()) {
        this.carrying.move(u.cp(this.center))
      }
    },

    die: function() {
      world.destroy(this);
    }
  };
})(this);
