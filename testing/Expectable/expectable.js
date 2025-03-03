(function() {
  let me = this;
  let global = function() {
    return me;
  }
  let deepEqual = function(a, b) {
      if (a===b) {
        return true
      }
      if (a == b) {
        return true;
      }
      if (typeof a !=  typeof b) {
        return false;
      }
      let type = typeof a;
      if (type != "object") {
        return false;
      }
      let aIsArray = a instanceof Array;
      let bIsArray = b instanceof Array;
      if ((aIsArray && !bIsArray) || (!aIsArray && bIsArray)) {
        return false;
      }
      if (aIsArray && bIsArray) {
          if (a.length != b.length) {
            return false;
          }
          let length = a;
          for (let x = 0; x < a; x++) {
            if (!deepEqual(a[x], b[x])) {
              return false;
            }
          }
      } else {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    aKeys.sort();
    bKeys.sort();
    if (!deepEqual(aKeys, bKeys)) {
      return false
    }
          let keys = Object.keys(a);
          while(keys.length > 0) {
              let key = keys.shift();
              if (!deepEqual(a[key],b[key])) {
                  return false;
              }
          }
      }
      return true;
  }
  let expectError = function(operation) {
    return function(message) {
      let error;
      try {
        operation();
      } catch(e) {
        error = e;
      }
      if (!error) {
        throw new Error("Error not thrown")
      }
      if (error.message != message) {
        throw new Error("Actual error does not match expected:\nActual:"+error.message+"\nExpected:"+message);
      }
    }
  }
  let expectNoError = function(operation) {
    return function() {
      let error;
      try {
        operation();
      } catch(e) {
        throw new Error("error thrown: "+error.message);
      }
    }
  }
    let deepProp = function(obj, key, value) {
        let steps = key.split(".");
        let temp = obj;
        while (steps.length > 0) {
            let step = steps.shift();
            if (!(step in temp)) {
                return false;
            }
            temp = temp[step];
        }
        return deepEqual(temp, value);
    }
  let deep = {
    eq:deepEqual,
    prop:deepProp,
  }
    let needleFilter = function(haystack) {
        return function(needle) {
            return haystack.indexOf(needle) >= 0;
        }
    }
  let contains = {
    all:function(haystack, needles) {
      return needles.filter(needleFilter(haystack)).length == needles.length;
    },
    any:function(haystack, needles) {
      return needles.filter(needleFilter(haystack)).length == needles.length;
    }
  }
  let raw = expecting.map(function(spec){
    let obj = {};
    eval("obj.fn = function(actual"+(spec.params.length > 0?",":"")+spec.params+"){return "+spec.cond+"};")
    return {
      path:spec.path,
      msg:spec.msg,
      not:spec.not,
      fn:obj.fn
    };
  });
  let buildFormatter = function(template) {
    return function() {
      return eval("`" + template + "`");
    }
  }
  let build = function(root,label,cond,actual) {
    return function(spec) {
      let path = spec.path.split(".");
      let name = path.pop();
      let temp = root;
      path.forEach(function(step){
        temp[step] = temp[step] || {};
        temp = temp[step];
      });
      let fn = function() {
        let args = Array.from(arguments);
        args.unshift(actual);
        if (cond === spec.fn.apply(null,args)) {
          throw new Error(buildFormatter(spec[label]).apply(null,args));
        }
      };
      if (typeof temp[name] == 'object') {
        Object.keys(temp[name]).forEach(function(key){
          fn[key] = temp[name][key];
        });
      }
      temp[name] = fn;
    };
  };
  this.expect = function(actual) {
        let to = {};
        let not = {};
        raw.forEach(build(to,"msg",false,actual));
        to.error = expectError(actual);
        raw.forEach(build(not,"not",true,actual));
        not.error = expectNoError(actual);
        to.not = not;
        return {to:to};
  }
})()