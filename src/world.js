;(function(exports) {
  exports.world = {
    setup: function(c) {
      this.c = c;
      this.seed();
    },

    seed: function() {
      this.createIsland(this.c, u.p(80, 80));
    },

    update: function() {
      if (Math.random() > 0.1) {
        this.stepFires(this.c);
      }
    },

    createIsland: function(c, center) {
      world.createLand(c, u.p(center.x, center.y));
      var forestCenter = u.p(center.x, center.y - 30);
      world.createForest(c, forestCenter);
      c.entities.create(Fire, { center: u.cp(forestCenter) });
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
      if (cent !== undefined) {
        return c.entities.create(Tree, { center: cent });
      }
    },

    createLand: function(c, center) {
      var lands = [c.entities.create(Land, { center: center })];
      for (var i = 0; i < 700; i++) {
        lands.push(this.growLand(c, lands));
      }
    },

    growLand: function(c, lands) {
      var cent = landNeighbor(c.game,
                              _.find(_.shuffle(lands), _.partial(landNeighbor, c.game)));
      if (cent !== undefined) {
        return c.entities.create(Land, { center: cent });
      }
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
      return game.isClear(center, [Tree]) && !game.isClear(center, [Land]);
    });
  };
})(this);
