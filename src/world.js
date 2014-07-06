;(function(exports) {
  exports.world = {
    setup: function(c) {
      this.c = c;
      this.seed();
    },

    seed: function() {
      this.createIsland(this.c, u.p(96, 96));
      this.createIsland(this.c, u.p(_.random(25, 50) * Game.GRID_SIZE.x,
                                    _.random(25, 50) * Game.GRID_SIZE.x));
      this.createIsland(this.c, u.p(_.random(-50, 25) * Game.GRID_SIZE.x,
                                    _.random(-50, 25) * Game.GRID_SIZE.x));
      this.createIsland(this.c, u.p(_.random(25, -50) * Game.GRID_SIZE.x,
                                    _.random(25, -50) * Game.GRID_SIZE.x));
    },

    update: function() {
      if (Math.random() > 0.1) {
        this.stepFires(this.c);
      }

      this.driftSeaborneObjects();
    },

    driftables: [Food],
    driftSeaborneObjects: function() {
      var self = this;
      u.every(1000, function() {
        var lands = this.c.entities.all(Land);
        _.filter(this.c.entities.all(), function(e) {
          return _.any(self.driftables, function(D) { return e instanceof D; }) &&
            _.filter(lands, function(l) {
              return l.center.x === e.center.x && l.center.y === e.center.y;
            }).length === 0 &&
            !self.c.game.mary.hand.isCarrying(e);
        }).forEach(function(drifting) {
          drifting.center.x += Game.GRID_SIZE.x;
          drifting.center.y += Game.GRID_SIZE.y;
        });

        return true;
      }, this);
    },

    createIsland: function(c, center) {
      var lands = world.createLand(c, u.p(center.x, center.y));
      c.entities.create(Food, { center: _.sample(lands).center });
      var forestCenter = u.p(center.x, center.y - Game.GRID_SIZE.x * 4);
      world.createForest(c, forestCenter);
      // c.entities.create(Fire, { center: u.cp(forestCenter) });
    },

    stepFires: function(c) {
      if (c.entities.all(Tree).length > 0) {
        var fire = _.find(_.shuffle(c.entities.all(Fire)), _.partial(fireNeighbor, c.game));
        if (fire !== undefined) {
          c.entities.create(Fire, { center: fireNeighbor(c.game, fire) });
        }
      }
    },

    createForest: function(c, center) {
      var trees = [c.entities.create(Tree, { center: center })];
      for (var i = 0; i < 80; i++) {
        trees.push(this.growForest(c, trees));
      }
    },

    growForest: function(c, trees) {
      var cent = forestNeighbor(c.game,
                                _.find(_.shuffle(trees), _.partial(forestNeighbor, c.game)));
      return c.entities.create(Tree, { center: cent });
    },

    createLand: function(c, center) {
      var lands = [c.entities.create(Land, { center: center })];
      for (var i = 0; i < 300; i++) {
        lands.push(this.growLand(c, lands));
      }

      return lands;
    },

    growLand: function(c, lands) {
      var cent = landNeighbor(c.game,
                              _.find(_.shuffle(lands), _.partial(landNeighbor, c.game)));
      return c.entities.create(Land, { center: cent });
    },

    adjNeighbors: function(entity) {
      var x = entity.center.x;
      var y = entity.center.y;
      var step = Game.GRID_SIZE.x;
      return [
        { x: x, y: y - step },
        { x: x - step, y: y },
        { x: x + step, y: y },
        { x: x, y: y + step }
      ];
    },
  };

  var fireNeighbor = function(game, entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Fire]) && !game.isClear(center, [Tree])
    });
  };

  var landNeighbor = function(game, entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Land])
    });
  };

  var forestNeighbor = function(game, entity) {
    return _.find(_.shuffle(world.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Tree, Food]) && !game.isClear(center, [Land]);
    });
  };
})(this);
