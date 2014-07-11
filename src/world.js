;(function(exports) {
  exports.world = {
    setup: function(c) {
      this.MOVE_BLOCKERS = [Tree, Food, Person, Mary, Wood, Cockpit];
      this.FLAMMABLE = [Tree, Food, Person, Mary, Wood];
      this.VEHICLE_MOVEABLE = [Food, Person, Mary, Wood, Cockpit, RaftPiece, Hand];
      this.CONSUMABLE = [Food, Tree];
      this.PICK_UPABBLE = [Cockpit, Food, Person, Wood, RaftPiece];
      this.c = c;
      this.landMasses = [];
      this.vehicles = [];
      this.locs = {};
      this.seed();
    },

    seed: function() {
      var homeLandMass = this.createHomeIsland(this.c, u.p(96, 96));

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(0, 50));
      }, this);

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(50, 100));
      }, this);

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(100, 150));
      }, this);

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(150, 200));
      }, this);

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(200, 250));
      }, this);

      _.times(4, function() {
        this.createIsland(this.c, this.randomSquareCenter(250, 300));
      }, this);

      this.mary = this.create(Mary, {
        center: _.find(_.shuffle(homeLandMass.lands), function(land) {
          return this.isClear(land.center, this.MOVE_BLOCKERS);
        }, this).center
      });

      this.create(Person, { center: u.cp(this.genLostPersonCenter(60, 125)), color: "black"});
      this.create(Person, { center: u.cp(this.genLostPersonCenter(125, 180)), color: "black"});
      this.create(Person, { center: u.cp(this.genLostPersonCenter(180, 240)), color: "black"});

      // create food bonanza on random island
      var foodLandMass = _.find(_.shuffle(this.landMasses), function(landMass) {
        return isInGridDistance(60, 125, this.mary, landMass.lands[0]);
      }, this);

      _.times(20, function() {
        this.create(Food, {
          center: _.find(_.shuffle(foodLandMass.lands), function(land) {
            return this.isClear(land.center, this.MOVE_BLOCKERS);
          }, this).center
        });
      }, this);
    },

    update: function() {
      if (Math.random() > 0.1) {
        this.stepFires(this.c);
      }

      this.driftSeaborneObjects();
    },

    randomSquareCenter: function(minGridDistance, maxGridDistance) {
      var magnitude = _.random(minGridDistance, maxGridDistance);
      var randomUnit = u.unitVector({
        x: Math.random() * u.randomSign(),
        y: Math.random() * u.randomSign()
      });

      return {
        x: Math.floor(randomUnit.x * magnitude) * Game.GRID_SIZE.x,
        y: Math.floor(randomUnit.y * magnitude) * Game.GRID_SIZE.y
      };
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
      if (world.mary.hand.isCarrying(entity)) {
        world.mary.hand.dropIfCarrying();
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

    areaCenters: function(center, gridSquareSize) {
      var centers = [];
      for (var y = -Math.floor(gridSquareSize.y / 2);
           y < Math.ceil(gridSquareSize.y / 2);
           y++) {
        for (var x = -Math.floor(gridSquareSize.x / 2);
             x < Math.ceil(gridSquareSize.x / 2);
             x++) {
          centers.push({
            x: center.x + x * Game.GRID_SIZE.x,
            y: center.y + y * Game.GRID_SIZE.y
          });
        }
      }

      return centers;
    },

    isClear: function(center, types) {
      return !_.some(this.atSquare(center), function(e) {
        return types === undefined ||
          _.any(types, function(type) { return e instanceof type; });
      });
    },

    getAt: function(center, types) {
      var entities = this.atSquare(center);
      for (var i = 0; i < types.length; i++) {
        for (var j = 0; j < entities.length; j++) {
          if (entities[j] instanceof types[i]) {
            return entities[j];
          }
        }
      }
    },

    atSquare: function(center) {
      return this.locs[this.locId(center)] || [];
    },

    driftables: [Food],
    driftSeaborneObjects: _.throttle(function() {
      var lands = this.c.entities.all(Land);
      _.filter(this.c.entities.all(), function(e) {
        return _.any(self.driftables, function(D) { return e instanceof D; }) &&
          !_.some(lands, function(l) {
            return l.center.x === e.center.x && l.center.y === e.center.y;
          }) &&
          !world.mary.hand.isCarrying(e);
      }).forEach(function(drifting) {
        drifting.move(u.vAdd(drifting.center, Game.GRID_SIZE))
      });
    }, 1000),

    createLandMass: function(c, center, landCount) {
      var landMass = new LandMass();
      this.landMasses.push(landMass);

      landMass.lands = [this.create(Land, { center: center, landMass: landMass })];
      for (var i = 0; i < landCount; i++) {
        var parentLand = _.find(_.shuffle(landMass.lands), landNeighbor);
        if (parentLand !== undefined) {
          var center = landNeighbor(parentLand);
          landMass.lands.push(this.create(Land, { center: center, landMass: landMass }));
        } else {
          break; // in center of another island - abort
        }
      }

      return landMass;
    },

    createHomeIsland: function(c, center) {
      var landMass = this.createLandMass(c, center, 600);
      this.create(Food, { center: _.sample(landMass.lands).center });
      this.vehicles.push(new Raft(this.c.game, { center: _.sample(landMass.lands).center }));

      var forestCenter = u.p(center.x, center.y - Game.GRID_SIZE.x * 4);
      this.createForest(c, forestCenter);
      return landMass;
    },

    createIsland: function(c, center) {
      var landMass = this.createLandMass(c, center, 600);

      if (Math.random() > 0.5) {
        this.create(Food, { center: _.sample(landMass.lands).center });
      }

      var forestCenter = u.p(center.x, center.y - Game.GRID_SIZE.x * 4);
      this.createForest(c, forestCenter);

      if (Math.random() > 0.8) {
        // this.create(Fire, { center: u.cp(forestCenter) });
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
        var treeParent = _.find(_.shuffle(trees), forestNeighbor);
        if (treeParent !== undefined) {
          trees.push(this.create(Tree, { center: forestNeighbor(treeParent) }));
        } else {
          break; // in center of forest - abort
        }
      }
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
    },

    genLostPersonCenter: function(minGridDistance, maxGridDistance) {
      return _.find(this.c.entities.all(Land), function(land) {
        return isInGridDistance(minGridDistance, maxGridDistance, this.mary, land) &&
          this.isClear(land.center, this.MOVE_BLOCKERS);
      }, this).center;
    }
  };

  var LandMass = function() {

  };

  var isInGridDistance = function(minGridDistance, maxGridDistance, item1, item2) {
    var d = u.distance(item1.center, item2.center);
    return d > minGridDistance * Game.GRID_SIZE.x && d < maxGridDistance * Game.GRID_SIZE.x;
  };

  var fireNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Fire]) && !world.isClear(center, world.FLAMMABLE);
    });
  };

  var landNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Land])
    });
  };

  var forestNeighbor = function(entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity.center)), function(center) {
      return world.isClear(center, [Tree, Food, Person, RaftPiece]) &&
        !world.isClear(center, [Land]);
    });
  };
})(this);
