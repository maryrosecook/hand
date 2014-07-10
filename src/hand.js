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
      if (this.game.c.inputter.isDown(this.game.c.inputter.SPACE) &&
          !world.isClear(this.center, world.CONSUMABLE)) {
        this.mary.consume(world.getAt(this.center, world.CONSUMABLE));
      }

      if (this.game.c.inputter.isDown(this.game.c.inputter.CONTROL) &&
          !world.isClear(this.center, world.PICK_UPABBLE)) {
        this.pickUp(world.getAt(this.center, world.PICK_UPABBLE));
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

    isPiloting: function() {
      return this.carrying instanceof Cockpit;
    },

    pilotMove: function(dir) {
      this.carrying.move(dir);
    },

    canMove: function(maryCenter, dir) {
      return !this.isCarrying() ||
        (world.isClear(u.vAdd(maryCenter, Game.DIR_TO_VECTOR[dir]),
                       world.MOVE_BLOCKERS) &&
         !this.isPiloting());
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
