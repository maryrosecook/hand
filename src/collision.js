;(function(exports) {
  var Collision = exports.Collision = function(e1, e2) {
    this.TYPES = [Fire, Tree, Land, Food, Mary];
    this.buckets = {};
    this.bucket(e1);
    this.bucket(e2);
  }

  Collision.prototype = {
    g: function(typeFn) {
      var type = typeFn.name;
      if (_.isArray(this.buckets[type]) && this.buckets[type].length === 1) {
        return this.buckets[type][0];
      } else {
        return this.buckets[type];
      }
    },

    bucket: function(e) {
      var type = getType(this.TYPES, e).name;
      this.buckets[type] = (this.buckets[type] || []).concat(e);
    }
  };

  var getType = function(TYPES, e) {
    for (var i = 0; i < TYPES.length; i++) {
      if (e instanceof TYPES[i]) {
        return TYPES[i];
      }
    }
  };
})(this);
