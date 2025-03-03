(function(){
  global = global || window;
  global.Enum = function() {

    let underlying = (function(args){
      if (args.length = 1) {
        args = arg[0];
      }
      if ((typeof args) != "object") {
        args = [args];
      }
      if (Array.isArray(args)) {
        return args.reduce((out,arg,i) => {
          out[String.valueOf(arg)] = i;
          return out;
        }, {});
      } else {
        return Object.entries(args).reduce((out,entry) => {
          out[entry[0]] = entry[1];
          return out;
        }, {});
      }
    })(Array.from(arguments));

    this.values = function(){
      return Array.from(Object.keys(underlying));
    }
    
    let me = this;
    Object.entities(underlying).forEach((entry) => {
      me[entry[0]] = entry[1];
    });
  }
})();