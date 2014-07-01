;(function(exports) {
  exports.drawer = {
    rect: function(screen, center, size, color) {
      screen.fillStyle = color;
      screen.fillRect(center.x - size.x / 2, center.y - size.y / 2,
                      size.x, size.y);
    }
  };
})(this);
