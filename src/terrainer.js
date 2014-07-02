;(function(exports) {
  exports.terrainer = {
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
      for (var i = 0; i < 200; i++) {
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

    createIsland: function(c, center) {
      var lands = [c.entities.create(Land, { center: center })];
      for (var i = 0; i < 400; i++) {
        lands.push(this.growIsland(c, lands));
      }
    },

    growIsland: function(c, lands) {
      var cent = landNeighbor(c.game,
                              _.find(_.shuffle(lands), _.partial(landNeighbor, c.game)));
      if (cent !== undefined) {
        return c.entities.create(Land, { center: cent });
      }
    },

    adjNeighbors: function(entity) {
      var x = entity.center.x;
      var y = entity.center.y;
      var step = Game.GRID_SIZE;
      return [
        { x: x, y: y - step },
        { x: x - step, y: y },
        { x: x + step, y: y },
        { x: x, y: y + step }
      ];
    },
  };

  var fireNeighbor = function(game, entity) {
    return _.find(_.shuffle(terrainer.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Fire]) && !game.isClear(center, [Tree])
    });
  };

  var landNeighbor = function(game, entity) {
    return _.find(_.shuffle(terrainer.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Land])
    });
  };

  var forestNeighbor = function(game, entity) {
    return _.find(_.shuffle(terrainer.adjNeighbors(entity)), function(center) {
      return game.isClear(center, [Tree]) && !game.isClear(center, [Land]);
    });
  };
})(this);
