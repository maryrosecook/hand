;(function(exports) {
  exports.Raft = function Raft(game, settings) {
    this.game = game;
    this.center = settings.center;
    this.gridSquareSize = { x: 3, y: 3};

    world.create(Cockpit, { center: u.cp(settings.center), vehicle: this });

    _.forEach(world.areaCenters(this.center, this.gridSquareSize), function(center) {
      world.create(RaftPiece, { center: center, vehicle: this });
    }, this);
  };

  Raft.prototype = {
    canDrag: function(dir) {
      var centers = this.getCenters();
      return _.all(this.getCargo(), function(entity) {
        var newCargoCenter = u.vAdd(Game.DIR_TO_VECTOR[dir], entity.center);
        return _.any(centers, _.partial(u.vEq, newCargoCenter)) ||
          (world.isClear(newCargoCenter, world.MOVE_BLOCKERS) ||
           !world.isClear(newCargoCenter, [Mary]));
      });
    },

    canPilot: function(dir) {
      var moveDelta = Game.DIR_TO_VECTOR[dir];
      var centers = this.getCenters();
      var areaClear = _.all(this.getCargo(), function(entity) {
        var newCargoCenter = u.vAdd(moveDelta, entity.center);
        return _.any(centers, _.partial(u.vEq, newCargoCenter)) ||
          world.isClear(newCargoCenter, world.MOVE_BLOCKERS);
      });

      return areaClear &&
        _.all(centers, function(c) { return world.isClear(c, [Land])}) &&
        _.all(world.areaCenters(u.vAdd(moveDelta, this.center), this.gridSquareSize),
              function(c) { return world.isClear(c, [Land])});
    },

    isMoveClear: function(dir) {
      var centers = this.getCenters();
      return _.all(this.getCargo(), function(entity) {
        var newCargoCenter = u.vAdd(Game.DIR_TO_VECTOR[dir], entity.center);
        return _.any(centers, _.partial(u.vEq, newCargoCenter)) ||
          world.isClear(newCargoCenter, world.MOVE_BLOCKERS);
      })
    },

    getCenters: function() {
      return world.areaCenters(this.center, this.gridSquareSize);
    },

    getCargo: function() {
      var isCargo = _.partial(u.instanceofs, world.VEHICLE_MOVEABLE);
      return _.reduce(this.getCenters(), function(a, c) {
        return a.concat(_.filter(world.atSquare(c), isCargo));
      }, [])
    },

    move: function(dir) {
      var moveDelta = Game.DIR_TO_VECTOR[dir];

      _.forEach(this.getCargo(), function(entityToMove) {
        world.move(entityToMove, u.vAdd(moveDelta, entityToMove.center));
      });

      this.center = u.vAdd(this.center, moveDelta);
    }
  };
})(this);
