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
      if (!world.isClear(this.center, [Land])) {
        return 50;
      } else {
        return 400;
      }
    },

    isMoveClear: function(center, dir) {
      return (world.isClear(center, world.MOVE_BLOCKERS)
              || this.hand.isCarrying(world.getPickUpabbleEntityAtSquare(center))) &&
        this.hand.isMoveClear(center, dir);
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

    handleMovement: function() {
      this.updateKeyMap();
      u.every(this.movementFrequency(), function() {
        var dir = this.getCurrentDir();
        if (dir !== undefined) {
          var newPosition = u.vAdd(this.center, Game.DIR_TO_VECTOR[dir]);
          if (this.isMoveClear(newPosition, dir)) {
            world.move(this, newPosition);
            this.hand.maryMovedTo(this.center, dir);
            return true;
          } else if (this.isMoveClear(this.center, dir)) { // try just rotating
            this.hand.maryMovedTo(this.center, dir);
            return true;
          }
        }
      }, this);
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

    consume: function(center) {
      var entity = world.getPickUpabbleEntityAtSquare(center);
      if (entity instanceof Food) {
        this.food = this.MAX_FOOD;
        world.destroy(entity);
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
    }
  };

})(this);
