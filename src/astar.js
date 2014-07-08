;(function(exports) {
  exports.astar = function(start, goal) {
    var closedSet = {};
    var openSet = {};
    var cameFrom = {};

    // lower scores are better
    var gScore = {};
    var fScore = new BinaryHeap(function(x) { return x.fScore; });

    var startId = world.locId(start);
    var goalId = world.locId(goal);

    openSet[startId] = start; // the set of tentative nodes to be evaluated.
    gScore[startId] = 0; // cost from start along best known path.
    setFScore(start, goal, gScore, fScore);

    while (fScore.peek().fScore !== Infinity) {
      var x = fScore.pop();
      var xId = world.locId(x);
      if (xId === goalId) {
        return reconstructPath(cameFrom, goal);
      }

      delete openSet[xId];
      closedSet[xId] = x;

      var neighbors = world.adjNeighbors(x);
      for (var i = 0; i < neighbors.length; i++) {
        var y = neighbors[i];
        var yId = world.locId(y);
        if (closedSet[yId] !== undefined) {
          continue;
        }

        var tentativeGScore = gScore[xId] + moveCost(y);
        var tentativeIsBetter;
        if (openSet[yId] === undefined) {
          openSet[yId] = y;
          tentativeIsBetter = true
        } else if (tentativeGScore < gScore[yId]) {
          tentativeIsBetter = true;
        } else {
          tentativeIsBetter = false;
        }

        if (tentativeIsBetter === true) {
          cameFrom[yId] = x;
          gScore[yId] = tentativeGScore;
          setFScore(y, goal, gScore, fScore)
        }
      }
    }
  };

  var moveCost = function(to) {
    if (world.isClear(to, world.MOVE_BLOCKERS) &&
        world.getAt(to, Land) !== undefined) {
      return Game.GRID_SIZE.x;
    } else {
      return Infinity;
    }
  };

  var setFScore = function(node, goal, gScore, fScore) {
    node.fScore = gScore[world.locId(node)] + heuristicCostEstimate(node, goal);
    fScore.push(node);
  };

  var heuristicCostEstimate = function() {
    return Game.GRID_SIZE.x;
  };

  var reconstructPath = function(cameFrom, currentNode) {
    var currentNodeId = world.locId(currentNode);
    if (cameFrom[currentNodeId] !== undefined) {
      var p = reconstructPath(cameFrom, cameFrom[currentNodeId]);
      p.push(currentNode);
      return p;
    } else {
      return [currentNode];
    }
  };
})(this);
