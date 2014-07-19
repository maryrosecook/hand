;(function(exports) {
  var Game = exports.Game = function() {
    var self = this;
    this.c = new Coquette(this, "screen", 1008, 496, "blue");
    this.c.game = this;
    world.setup(this.c);
  };

  Game.GRID_SIZE = { x: 16, y: 16 };

  Game.DIR_TO_VECTOR = {
    LEFT: u.p(-Game.GRID_SIZE.x, 0),
    RIGHT: u.p(Game.GRID_SIZE.x, 0),
    UP: u.p(0, -Game.GRID_SIZE.y),
    DOWN: u.p(0, Game.GRID_SIZE.y )
  };

  Game.prototype = {
    update: function() {
      world.update();
      this.debugKeys();
    },

    debugging: false,
    hijackView: function(center) {
      this.c.renderer.setViewCenter(center);
      this.debugging = true;
    },

    // happens after all other drawing
    debugDraw: function(screen) {
      this.highlightedSquares.forEach(function(center) {
        drawer.rect(screen, center, Game.GRID_SIZE, "red");
      });
    },

    highlightedSquares: [],
    highlightSquares: function(centers) {
      this.highlightedSquares = centers;
    },

    debugKeys: function() {
      if (this.c.inputter.isPressed(this.c.inputter.D)) {
        this.debugging = !this.debugging;
      }

      var viewCenter = this.c.renderer.getViewCenter();
      var speed = 4;
      if (this.c.inputter.isDown(this.c.inputter.LEFT_ARROW)) {
        this.c.renderer.setViewCenter(u.vAdd(viewCenter,
                                             u.vMultiply(Game.DIR_TO_VECTOR["LEFT"], speed)));
      }

      if (this.c.inputter.isDown(this.c.inputter.RIGHT_ARROW)) {
        this.c.renderer.setViewCenter(u.vAdd(viewCenter,
                                             u.vMultiply(Game.DIR_TO_VECTOR["RIGHT"], speed)));
      }

      if (this.c.inputter.isDown(this.c.inputter.UP_ARROW)) {
        this.c.renderer.setViewCenter(u.vAdd(viewCenter,
                                             u.vMultiply(Game.DIR_TO_VECTOR["UP"], speed)));
      }

      if (this.c.inputter.isDown(this.c.inputter.DOWN_ARROW)) {
        this.c.renderer.setViewCenter(u.vAdd(viewCenter,
                                             u.vMultiply(Game.DIR_TO_VECTOR["DOWN"], speed)));
      }

      if (this.c.inputter.isPressed(this.c.inputter.I)) {
        this.zoom(2);
      } else if (this.c.inputter.isPressed(this.c.inputter.O)) {
        this.zoom(0.5);
      }
    },

    zoom: function(multiplier) {
      Game.GRID_SIZE.x *= multiplier;
      Game.GRID_SIZE.y *= multiplier;

      this.c.entities.all().forEach(function(e) {
        world.move(e, u.vMultiply(e.center, multiplier));
        if (e instanceof Person || e instanceof Animal) {
          e.path = undefined;
        }
      });

      world.vehicles.forEach(function(e) {
        e.center = u.vMultiply(e.center, multiplier);
      });

      this.c.renderer.setViewCenter(u.vMultiply(this.c.renderer.getViewCenter(), multiplier));
    }
  };
})(this);
