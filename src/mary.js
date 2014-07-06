;(function(exports) {
  exports.Mary = function Mary(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.pack = [];
    this.MAX_FOOD = Game.GRID_SIZE.y - 2;
    this.food = this.MAX_FOOD;

    this.DIR_TO_VECTOR = {
      LEFT: u.p(-Game.GRID_SIZE.x, 0),
      RIGHT: u.p(Game.GRID_SIZE.x, 0),
      UP: u.p(0, -Game.GRID_SIZE.y),
      DOWN: u.p(0, Game.GRID_SIZE.y )
    };

    this.DIR_TO_KEY = {
      LEFT: this.game.c.inputter.LEFT_ARROW,
      RIGHT: this.game.c.inputter.RIGHT_ARROW,
      UP: this.game.c.inputter.UP_ARROW,
      DOWN: this.game.c.inputter.DOWN_ARROW
    };

    this.hand = this.game.c.entities.create(Hand, { center: this.getHandPosition() });
  };

  Mary.prototype = {
    update: function(delta) {
      this.move();
      this.game.c.renderer.setViewCenter(this.center);
      this.reduceFood();
      this.hand.center = this.getHandPosition();
    },

    reduceFood: _.throttle(function() {
      this.food -= 1;
    }, 10000, {leading: false}),

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.c.entities.destroy(this);
      }
    },

    pickUp: function(entity) {
      if (entity instanceof Food) {
        this.food = this.MAX_FOOD;
        this.game.c.entities.destroy(entity);
      }
    },

    movementFrequency: function() {
      if (!this.game.isClear(this.center, [Land])) {
        return 50;
      } else {
        return 400;
      }
    },

    isMoveClear: function(center) {
      return this.game.isClear(center, [Tree, Food]);
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

    move: function() {
      this.updateKeyMap();
      u.every(this.movementFrequency(), function() {
        var dir = this.getCurrentDir();
        if (dir !== undefined) {
          this.faceDirection = dir;
          var newPosition = u.vAdd(this.center, this.DIR_TO_VECTOR[dir]);
          if (this.isMoveClear(newPosition)) {
            this.center = newPosition;
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

    faceDirection: "UP",

    getHandPosition: function() {
      return u.vAdd(this.center, this.DIR_TO_VECTOR[this.faceDirection]);
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "#000");
      this.drawFoodMeter(screen);
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
