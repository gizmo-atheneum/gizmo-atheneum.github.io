(function(){
  Array.range = function(min, max, step) {
    step = step || 1;
    max = max || min;
    if (min == max) {
      min = 0;
    }
    let out = [];
    for (let i = min; i <= max; i += step) {
      out.push(i);
    }
    return Array.from(out);
  }
})();