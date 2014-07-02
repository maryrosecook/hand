;(function(exports) {
  var Mary = exports.Mary = function(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.pack = [];

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
        return 100;
      } else {
        return 400;
      }
    },

    isMoveClear: function(center) {
      return this.game.isClear(center, [Tree]);
    },

    getMove: function() {
      if (this.game.c.inputter.isDown(this.game.c.inputter.LEFT_ARROW)) {
        return this.MOVES.LEFT;
      } else if (this.game.c.inputter.isDown(this.game.c.inputter.RIGHT_ARROW)) {
        return this.MOVES.RIGHT;
      }

      if (this.game.c.inputter.isDown(this.game.c.inputter.UP_ARROW)) {
        return this.MOVES.UP;
      } else if (this.game.c.inputter.isDown(this.game.c.inputter.DOWN_ARROW)) {
        return this.MOVES.DOWN;
      };
    },

    dir: undefined,
    move: function() {
      this.dir = this.getMove();
      u.every(this.movementFrequency(), function() {
        if (this.dir !== undefined && this.isMoveClear(u.vAdd(this.center, this.dir))) {
          this.center = u.vAdd(this.center, this.dir);
          return true;
        }
      }, this);
    },

    draw: function(screen) {
      drawer.rect(screen, this.center, this.size, "#000");
    }
  };
})(this);
