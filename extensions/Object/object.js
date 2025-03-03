(function(){
  Object.prototype.keys = function() {
    return Object.keys(this)
  }
  Object.prototype.apply = function(other, override) {
    var me = this;
    if (typeof other == "object" && !(other instanceof Array)) {
      other.keys().forEach(function(key) {
        if (!me[key] || override) {
          me[key] = other[key];
        }
      })
    }
  }
  Object.prototype.copy = function() {
    var out = {}
    out.apply(this)
    return out
  }
  Object.prototype.merge = function(other, override) {
    var out = this.copy()
    out.apply(other, override)
    return out
  }
})();


