;(function(exports) {
  exports.Mary = function Mary(game, settings) {
    this.game = game;
    this.zindex = 2;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.pack = [];
    this.MAX_FOOD = Game.GRID_SIZE.y - 2;
    this.food = this.MAX_FOOD;

    this.DIR_TO_KEY = {
      LEFT: this.game.c.inputter.LEFT_ARROW,
      RIGHT: this.game.c.inputter.RIGHT_ARROW,
      UP: this.game.c.inputter.UP_ARROW,
      DOWN: this.game.c.inputter.DOWN_ARROW
    };

    this.hand = world.create(Hand, {
      mary: this, // only for consume()
      maryCenter: this.center
    });
  };

  Mary.prototype = {
    update: function(delta) {
      this.handleMovement();
      this.game.c.renderer.setViewCenter(this.center);
      this.reduceFood();
      if (this.food === 0) {
        this.die();
      }
    },

    reduceFood: _.throttle(function() {
      this.food -= 1;
    }, 10000, {leading: false}),

    collision: function(other) {
      if (other instanceof Fire) {
        world.destroy(this);
      }
    },

    movementFrequency: function() {
      if (this.hand.isDraggingVehicle()) {
        return 600;
      } else if (this.hand.isPilotingVehicle()) {
        return 25;
      } else if (!world.isClear(this.center, [Land])) {
        return 50;
      } else {
        return 400;
      }
    },

    canMove: function(center, dir) {
      return (world.isClear(center, world.MOVE_BLOCKERS)
              || !world.isClear(center, [Mary]) // if just turning
              || (this.hand.isCarrying() && u.vEq(this.hand.carrying.center, center))) &&
        this.hand.canMove(center, dir);
    },

    keyMapValue: function(dir) {
      if (this.game.c.inputter.isPressed(this.DIR_TO_KEY[dir])) {
        return new Date().getTime();
      } else {
        return this.keyMap[dir];
      }
    },

    keyMap: {},
    updateKeyMap: function() {
      this.keyMap["LEFT"] = this.keyMapValue("LEFT");
      this.keyMap["RIGHT"] = this.keyMapValue("RIGHT");
      this.keyMap["UP"] = this.keyMapValue("UP");
      this.keyMap["DOWN"] = this.keyMapValue("DOWN");
    },

    lastMove: 0,
    handleMovement: function() {
      this.updateKeyMap();
      if (u.timePassed(this.lastMove, this.movementFrequency())) {
        var dir = this.getCurrentDir();
        if (dir !== undefined) {
          var newPosition = u.vAdd(this.center, Game.DIR_TO_VECTOR[dir]);
          if (this.hand.isDraggingVehicle() && world.isClear(this.center, [RaftPiece])
              && this.hand.carrying.vehicle.canDrag(dir)) {
            world.move(this, newPosition);
            this.hand.carrying.vehicle.move(dir);
            this.lastMove = _.now();
          } else if (this.hand.isPilotingVehicle() &&
                     this.hand.carrying.vehicle.canPilot(dir)) {
            this.hand.carrying.vehicle.move(dir);
            this.lastMove = _.now();
          } else if (this.canMove(newPosition, dir)) {
            world.move(this, newPosition);
            this.hand.maryMove(this.center, dir);
            this.lastMove = _.now();
          } else if (this.canMove(this.center, dir)) { // try just rotating
            this.hand.maryMove(this.center, dir);
            this.lastMove = _.now();
          }
        }
      }
    },

    getCurrentDir: function() {
      var latest;
      for (var i in this.keyMap) {
        if (this.keyMap[i] !== undefined && this.game.c.inputter.isDown(this.DIR_TO_KEY[i]) &&
            (latest === undefined || this.keyMap[latest] < this.keyMap[i])) {
          latest = i;
        }
      }

      return latest;
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "#000");
      this.drawFoodMeter(screen);
    },

    consume: function(entity) {
      if (entity instanceof Food) {
        this.food = this.MAX_FOOD;
        world.destroy(entity);
      } else if (entity instanceof Tree) {
        var woodCenter = u.cp(entity.center);
        world.destroy(entity);
        world.create(Wood, { center: woodCenter });
      }
    },

    drawFoodMeter: function(screen) {
      var viewCenter = this.game.c.renderer.getViewCenter();
      var viewSize = this.game.c.renderer.getViewSize();
      var pxPerFood = viewSize.y / this.MAX_FOOD;
      drawer.rect(screen,
                  u.p(viewCenter.x + viewSize.x / 2 - Game.GRID_SIZE.x / 2,
                      this.center.y + ((this.MAX_FOOD - this.food) / 2 * pxPerFood)),
                  u.p(Game.GRID_SIZE.x, this.food * pxPerFood),
                  "yellow");
    },

    die: function() {
      this.hand.die();
      var bloodCenter = u.cp(this.center);
      world.destroy(this);
      world.create(Blood, { center: bloodCenter });
    }
  };

})(this);
