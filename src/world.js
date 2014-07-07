;(function(exports) {
  exports.world = {
    setup: function(c) {
      this.c = c;
      this.landMasses = [];
      this.locs = {};
      this.seed();
      this.MOVE_BLOCKERS = [Tree, Food, Person];
    },

    seed: function() {
      this.createHomeIsland(this.c, u.p(96, 96));
      this.createIsland(this.c, u.p(_.random(25, 50) * Game.GRID_SIZE.x,
                                    _.random(25, 50) * Game.GRID_SIZE.x));
      this.createIsland(this.c, u.p(_.random(-50, 0) * Game.GRID_SIZE.x,
                                    _.random(-50, 0) * Game.GRID_SIZE.x));
      // this.createIsland(this.c, u.p(_.random(25, -50) * Game.GRID_SIZE.x,
      //                               _.random(25, -50) * Game.GRID_SIZE.x));
    },

    update: function() {
      if (Math.random() > 0.1) {
        this.stepFires(this.c);
      }

      this.driftSeaborneObjects();
    },

    create: function(Constructor, settings) {
      var entity = this.c.entities.create(Constructor, settings);
      this._addEntityToLocs(entity);
      return entity;
    },

    move: function(entity, newCenter) {
      this._removeEntityFromLocs(entity);
      entity.center = newCenter;
      this._addEntityToLocs(entity);
    },

    destroy: function(entity) {
      if (this.c.game.mary.hand.isCarrying(entity)) {
        this.c.game.mary.hand.dropIfCarrying();
      }

      this._removeEntityFromLocs(entity);
      this.c.entities.destroy(entity);
    },

    _removeEntityFromLocs: function(entity) {
      var locId = this.locId(entity.center);
      var index = _.indexOf(this.locs[locId], entity)
      if (index !== -1) {
        this.locs[locId].splice(index, 1);
      } else {
        throw "Tried to remove entity from locs, but wasn't there";
      }
    },

    _addEntityToLocs: function(entity) {
      var locId = this.locId(entity.center);
      this.locs[locId] = this.locs[locId] || [];
      this.locs[locId].push(entity);
    },

    locId: function(center) {
      return center.x + "," + center.y;
    },

    isClear: function(center, types) {
      return !_.some(this.locs[this.locId(center)], function(e) {
        return types === undefined ||
          _.any(types, function(type) { return e instanceof type; });
      });
    },

    atSquare: function(center) {
      return this.locs[this.locId(center)] || [];
    },

    getPickUpabbleEntityAtSquare: function(center) {
      return _.find(this.atSquare(center), function(e) {
        return !(e instanceof Land) && !(e instanceof Hand);
      });
    },

    driftables: [Food],
    driftSeaborneObjects: function() {
      var self = this;
      u.every(1000, function() {
        var lands = this.c.entities.all(Land);
        _.filter(this.c.entities.all(), function(e) {
          return _.any(self.driftables, function(D) { return e instanceof D; }) &&
            !_.some(lands, function(l) {
              return l.center.x === e.center.x && l.center.y === e.center.y;
            }) &&
            !self.c.game.mary.hand.isCarrying(e);
        }).forEach(function(drifting) {
          drifting.center.x += Game.GRID_SIZE.x;
          drifting.center.y += Game.GRID_SIZE.y;
        });

        return true;
      }, this);
    },

    createLandMass: function(c, center, landCount) {
      var landMass = new LandMass();
      this.landMasses.push(landMass);

      landMass.lands = [this.create(Land, { center: center })];
      for (var i = 0; i < landCount; i++) {
        landMass.lands.push(this.growLand(c, landMass, landMass.lands));
      }

      return landMass;
    },

    createHomeIsland: function(c, center) {
      var landMass = this.createLandMass(c, center, 600);
      this.create(Food, { center: _.sample(landMass.lands).center });
      this.create(Food, { center: _.sample(landMass.lands).center });

      var forestCenter = u.p(center.x, center.y - Game.GRID_SIZE.x * 4);
      this.createForest(c, forestCenter);
    },

    createIsland: function(c, center) {
      var landMass = this.createLandMass(c, center, 300);

      if (Math.random() > 0.5) {
        this.create(Food, { center: _.sample(landMass.lands).center });
      }

      if (Math.random() > 0) {
        this.create(Person, { center: _.sample(landMass.lands).center });
      }

      var forestCenter = u.p(center.x, center.y - Game.GRID_SIZE.x * 4);
      this.createForest(c, forestCenter);

      if (Math.random() > 0.8) {
        this.create(Fire, { center: u.cp(forestCenter) });
      }
    },

    stepFires: function(c) {
      if (c.entities.all(Tree).length > 0) {
        var fire = _.find(_.shuffle(c.entities.all(Fire)), fireNeighbor);
        if (fire !== undefined) {
          this.create(Fire, { center: fireNeighbor(fire) });
        }
      }
    },

    createForest: function(c, center) {
      var trees = [this.create(Tree, { center: center })];
      for (var i = 0; i < 80; i++) {
        trees.push(this.growForest(c, trees));
      }
    },

    growForest: function(c, trees) {
      var cent = forestNeighbor(_.find(_.shuffle(trees), forestNeighbor));
      return this.create(Tree, { center: cent });
    },

    growLand: function(c, landMass, lands) {
      var cent = landNeighbor(_.find(_.shuffle(lands), landNeighbor));
      return this.create(Land, { center: cent, landMass: landMass });
    },

    adjNeighbors: function(center) {
      var x = center.x;
      var y = center.y;
      var step = Game.GRID_SIZE.x;
      return [
        { x: x, y: y - step },
        { x: x - step, y: y },
        { x: x + step, y: y },
        { x: x, y: y + step }
      ];
    }
  };

  var LandMass = function() {

  };

  var fireNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Fire]) && !world.isClear(center, [Tree])
    });
  };

  var landNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Land])
    });
  };

  var forestNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Tree, Food, Person]) && !world.isClear(center, [Land]);
    });
  };
})(this);
