;(function(exports) {
  var Collision = exports.Collision = function(e1, e2) {
    this.buckets = [];
    this.bucket(e1);
    this.bucket(e2);
  }

  Collision.prototype = {
    g: function(typeFn) {
      var bucket = getBucket(this.buckets, typeFn.prototype);
      if (bucket !== undefined){
        if (bucket.es.length === 1) {
          return bucket.es[0];
        } else {
          return bucket.es;
        }
      }
    },

    bucket: function(e) {
      var protos = getPrototypes(e);
      for (var i = 0; i < protos.length; i++) {
        var bucket = getBucket(this.buckets, protos[i]);
        if (bucket === undefined) {
          bucket = { proto: protos[i], es: [] };
          this.buckets.push(bucket);
        }

        bucket.es.push(e);
      }
    }
  };

  var getBucket = function(buckets, proto) {
    return _.find(buckets, function(b) { return b.proto === proto; });
  };

  var getPrototypes = function(e) {
    var proto = e.__proto__;
    if (proto === Object.prototype) {
      return [];
    } else {
      return [proto].concat(getPrototypes(proto))
    }
  };
})(this);
