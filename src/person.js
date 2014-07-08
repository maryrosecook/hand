;(function(exports) {
  var Person = exports.Person = function(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "gray";
  };

  Person.prototype = {
    update: function() {
      if (!world.mary.hand.isCarrying(this)) {
        this.wander();
      }
    },

    // draw: function(screen) {
    //   drawer.rect(screen, this.center, this.size, this.color);
    //   if (this.path !== undefined && this.path.length > 0) {
    //     var l = _.last(this.path);
    //     screen.fillStyle = "red";
    //     screen.fillRect(l.x, l.y, 8, 8);
    //   }
    // },

    wander: function() {
      u.every(400, function() {
        var currentLand = world.getAt(this.center, Land);
        if (currentLand !== undefined) {
          if (this.path === undefined || this.path.length === 0) {
            var destination = getClearDestination(currentLand.landMass);
            this.path = astar(this.center, destination.center);
          } else {
            var nextCenter = this.path.shift();
            if (world.isClear(nextCenter, world.MOVE_BLOCKERS)) {
              this.move(nextCenter);
            } else {
              this.path = undefined; // plan new path
            }
          }
        }

        return true;
      }, this);
    },

    move: function(center) {
      world.move(this, center);
    },

    pickedUp: function() {
      this.path = undefined;
    }
  };

  var getClearDestination = function(landMass) {
    return _.find(_.shuffle(landMass.lands), function(land) {
      return world.isClear(land, world.MOVE_BLOCKERS);
    });
  };
})(this);
