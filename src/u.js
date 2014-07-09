;(function(exports) {
  exports.u = {
    cp: function(p) {
      return { x: p.x, y: p.y };
    },

    p: function(x, y) {
      return { x: x, y: y };
    },

    consoler: function(x) {
      console.log(x);
      return x;
    },

    machine: function(states, init) {
      return new Machine(states, init);
    },

    instanceofs: function(obj, constructors) {
      return _.any(constructors, function(C) { return obj instanceof C; });
    },

    types: function(e) {
      var proto = e.__proto__;
      if (proto === Object.prototype) {
        return [];
      } else {
        return [proto].concat(this.types(proto))
      }
    },

    pairs: function(arr1, arr2) {
      var pairs = [];
      for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
          pairs.push([arr1[i], arr2[j]]);
        }
      }

      return pairs;
    },

    vAdd: function(v1, v2) {
      return this.p(v1.x + v2.x, v1.y + v2.y);
    },

    timePassed: function(lastTime, interval) {
      return _.now() > lastTime + interval;
    },

    randomSign: function() {
      return Math.random() < 0.5 ? -1 : 1;
    },

    magnitude: function(vector) {
      return Math.sqrt(vector.x * vector.x + vector.y* vector.y);
    },

    unitVector: function(vector) {
      return {
        x: vector.x / this.magnitude(vector),
        y: vector.y / this.magnitude(vector)
      };
    }
  };

  var Machine = function(states, init) {
    if (_.isArray(states)) {
      this.current = states[0];
      this.states = states;
    } else {
      throw "Implement me.";
    }
  };

  Machine.prototype = {
    step: function(newState) {
      if (this.states[_.indexOf(this.states, this.current) + 1] === newState) {
        this.current = newState;
      } else {
        throw "Tried to transition from " +
          this.current + " to " + newState;
      }
    }
  };
})(this);
