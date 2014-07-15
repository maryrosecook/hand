;(function(exports) {
  var Animal = exports.Animal = function(game, settings) {
    this.game = game;
    this.zindex = 1;
    this.center = settings.center;
    this.size = Game.GRID_SIZE;
    this.color = "#FF6600";
    this.TARGET_TYPES = [Person, Mary];

    this.update = _.throttle(function() {
      // plan new path
      if (this.path === undefined) {
        var target = this.getTarget();
        if (target !== undefined) {
          this.path = astar(this.center, target.center);
        } else {
          var landMass = world.getAt(this.center, [Land]).landMass;
          var destination = _.find(_.shuffle(landMass.lands), function(land) {
            return world.isClear(land.center, world.MOVE_BLOCKERS) &&
              astar(this.center, land.center) !== undefined;
          }, this);

          this.path = astar(this.center, destination.center);
        }
      }

      // walk path
      var attackableTarget = world.getAt(this.center, this.TARGET_TYPES);
      if (attackableTarget !== undefined) {
        attackableTarget.die();
        this.path = undefined;
      } else if (this.path === undefined) {
        console.log(target)
        throw "don't know where to go";
      } else if (this.path.length === 0) {
        this.path = undefined;
      } else if (world.isClear(this.path[0], world.PREDATOR_MOVE_BLOCKERS)) {
        this.move(this.path.shift());
      } else {
        this.path = undefined; // plan new path
      }
    }, 200, { trailing: false });
  };

  Animal.prototype = {
    move: function(center) {
      world.move(this, center);
    },

    getTarget: function() {
      var targets = this.game.c.entities.all(Person);
      if (world.mary !== undefined && this.game.c.renderer.onScreen(this)) {
        targets.push(world.mary);
      }

      return _.chain(targets).filter(function(t) {
        return u.distance(t.center, this.center) < this.game.c.gameSize.y;
      }, this).map(function(t) {
        return {
          target: t,
          path: astar(this.center, t.center)
        };
      }, this).filter(function(x) {
        return x.path !== undefined;
      }).sort(function(a, b) {
        return a.path.length - b.path.length;
      }).map(function(x) {
        return x.target;
      }).first().value();
    }
  };
})(this);
