;(function(exports) {
  exports.Raft = function Raft(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.gridSquareSize = { x: 3, y: 3};

    world.create(Cockpit, { center: u.cp(settings.center), vehicle: this });

    _.forEach(world.areaCenters(this.center, this.gridSquareSize), function(center) {
      world.create(RaftPiece, { center: center });
    });
  };

  Raft.prototype = {
    move: function(dir) {
      var isCargo = _.partial(u.instanceofs, world.VEHICLE_MOVEABLE);
      var centers = world.areaCenters(this.center, this.gridSquareSize);
      var moveDelta = Game.DIR_TO_VECTOR[dir];

      var entitiesToMove = _.reduce(centers, function(a, c) {
        return a.concat(_.filter(world.atSquare(c), isCargo));
      }, []);

      var moveClear = _.all(entitiesToMove, function(entity) {
        var newCargoCenter = u.vAdd(moveDelta, entity.center);
        return _.any(centers, _.partial(u.vEq, newCargoCenter)) ||
          world.isClear(newCargoCenter, world.MOVE_BLOCKERS);
      });

      if (moveClear) {
        _.forEach(entitiesToMove, function(entityToMove) {
          world.move(entityToMove, u.vAdd(moveDelta, entityToMove.center));
        });
        this.center = u.vAdd(this.center, moveDelta);
      }
    }
  };
})(this);
