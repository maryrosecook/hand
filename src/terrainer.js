;(function(exports) {
  exports.terrainer = {
    stepFires: function(c) {
      _.reduce(c.entities.all(Fire), function(newFireCoords, fire) {
        return newFireCoords
          .concat(this.adjNeighbors(fire).filter(function(neighbor) {
            return Math.random() > 0.9;
          }));
      }, [], this).forEach(function(center) {
        c.entities.create(Fire, { center: center });
      });
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

    neighbors: function(entity) {
      var x = entity.center.x;
      var y = entity.center.y;
      var step = Game.GRID_SIZE;
      return [
        { x: x - step, y: y - step },
        { x: x, y: y - step },
        { x: x + step, y: y - step },
        { x: x - step, y: y },
        { x: x + step, y: y },
        { x: x - step, y: y + step },
        { x: x, y: y + step },
        { x: x + step, y: y + step }
      ];
    }
  };
})(this);
