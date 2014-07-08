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

    everys: {},
    every: function(t, f, ctx) {
      var id = fId(f);
      if(this.everys[id] === undefined) {
        this.everys[id] = {
          nextRun: nextRunTime(t)
        };
      } else if(this.everys[id].nextRun < new Date().getTime()) {
        if (f.call(ctx) !== undefined) {
          this.everys[id].nextRun = nextRunTime(t);
        }
      }
    },

    machine: function(states, init) {
      return new Machine(states, init);
    },

    instanceofs: function(obj, constructors) {
      return _.any(constructors, function(C) { return obj instanceof C; });
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

  var nextRunTime = function(interval) {
    return new Date().getTime() + interval;
  };

  var fId = function(f) {
    return hashString(f.toString());
  };

  // taken from: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  var hashString = function(str) {
    var hash = 0;
	  if(str.length === 0) {
      return hash;
    }

	  for (i = 0; i < str.length; i++) {
	    var char = str.charCodeAt(i);
	    var hash = ((hash << 5) -hash ) + char;
	    hash = hash & hash;
	  }

	  return hash;
  };
})(this);
