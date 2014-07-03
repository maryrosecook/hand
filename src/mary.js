;(function(exports) {
  exports.Mary = function Mary(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.pack = [];
    this.food = 10;
    this.water = 10;

    this.MOVES = {
      LEFT: u.p(-Game.GRID_SIZE.x, 0),
      RIGHT: u.p(Game.GRID_SIZE.x, 0),
      UP: u.p(0, -Game.GRID_SIZE.y),
      DOWN: u.p(0, Game.GRID_SIZE.y )
    };
  };

  Mary.prototype = {
    update: function(delta) {
      this.move();
      this.game.c.renderer.setViewCenter(this.center);
    },

    collision: function(other) {
      if (other instanceof Fire) {
        this.game.c.entities.destroy(this);
      }
    },

    pickUp: function(obj) {
      this.pack.push(obj);
      obj.center = undefined;
    },

    movementFrequency: function() {
      if (!this.game.isClear(this.center, [Land])) {
        return 50;
      } else {
        return 400;
      }
    },

    isMoveClear: function(center) {
      return this.game.isClear(center, [Tree]);
    },

    keyMapValue: function(direction, key) {
      if (this.game.c.inputter.isPressed(key)) {
        return new Date().getTime();
      } else if (this.game.c.inputter.isDown(key)) {
        return this.keyMap[direction];
      }
    },

    keyMap: {},
    updateKeyMap: function() {
      this.keyMap["LEFT"] = this.keyMapValue("LEFT", this.game.c.inputter.LEFT_ARROW);
      this.keyMap["RIGHT"] = this.keyMapValue("RIGHT", this.game.c.inputter.RIGHT_ARROW);
      this.keyMap["UP"] = this.keyMapValue("UP", this.game.c.inputter.UP_ARROW);
      this.keyMap["DOWN"] = this.keyMapValue("DOWN", this.game.c.inputter.DOWN_ARROW);
    },

    move: function() {
      this.updateKeyMap();
      u.every(this.movementFrequency(), function() {
        var dir = this.getDir();
        if (dir !== undefined && this.isMoveClear(u.vAdd(this.center, dir))) {
          this.center = u.vAdd(this.center, dir);
          return true;
        }
      }, this);
    },

    getDir: function() {
      var latest;
      for (var i in this.keyMap) {
        if (this.keyMap[i] !== undefined &&
            (latest === undefined || this.keyMap[latest] < this.keyMap[i])) {
          latest = i;
        }
      }

      return latest === undefined ? undefined : this.MOVES[latest];
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "#000");
    }
  };

})(this);
