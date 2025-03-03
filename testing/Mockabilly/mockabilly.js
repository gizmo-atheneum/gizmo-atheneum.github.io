(function() {
  var global = this;
  var getArgsAsArray = function(args) {
    var keys = Object.keys(args).filter(function(arg) {
      return !isNaN(Number(arg));
    });
    keys.sort();
    return keys.map(function(key) {
      return args[key];
    })
  }
  var addValueToParams = function(params,args) {
    var obj = {
      assigned:{},
      unassigned:args.filter(function(arg,index) {
        return (index >= params.length);
      })
    };
    params.forEach(function(param,index) {
      obj.assigned[param.name] = {
        value:args[index],
        validateType:function() {
          return true;
        }
      };
      if (param.type) {
        var validType = false;
        if (typeof param.type == 'string') {
          validType = true;
          obj.assigned[param.name].validateType = function(value) {
            return typeof value == param.type;
          }
        } else if (typeof param.type == 'function') {
          validType = true;
          obj.assigned[param.name].validateType = function(value) {
            return value instanceof param.type;
          }
        }
        if (validType) {
          obj.assigned[param.name].type = param.type;
        }
      }
    })
    return obj;
  }
  var Call = function(body) {
    var argObj = addValueToParams(body.params,body.args);
    this.getArgumentCount = function() {
      return body.args.length;
    }
    this.getArgument = function(index) {
      return body.args[index];
    }
    this.getUnAssignedCount = function() {
      return argObj.unassigned.length;
    }
    this.getUnAssignedArgument = function(index) {
      return argObj.unassigned[index];
    }
    this.getParameter = function(parameterName) {
      return argObj.assigned[parameterName].value;
    }
    this.isParameterTypeValid = function(parameterName) {
      var param = argObj.assigned[parameterName];
      return param.validateType(param.value);
    }
    this.getReturnValue = function() {
      return body.returnValue;
    }
  }
  var Meter = function(callList) {
    this.getCallCount = function() {
      return callList.length;
    }
    this.getCall = function(index) {
      return callList[index];
    }
    this.getLastCall = function() {
      return callList[callList.length - 1];
    }
  }
  var addParamFn = function(scope,paramList) {
    return function(name,type) {
      var param = {
        name:name
      };
      if (type) {
        param.type = type
      }
      paramList.push(param);
      return scope;
    };
  }
  var MockFunction = function() {
    var params = [];
    var returns = [];
    this.clear = function() {
      params = [];
      returns = [];
    }
    this.addParam = addParamFn(this,params);
    this.thenReturnResult = function(callback) {
      returns.push(callback)
      return this;
    };
    this.thenDo = function(callback) {
      returns.push(function() {
        callback();
        return;
      })
      return this;
    }
    this.thenReturn = function(returnValue) {
      returns.push(function() {
        return returnValue;
      })
      return this;
    };
    this.thenThrow = function(error) {
      returns.push(function() {
        throw error;
      })
      return this;
    };
    this.build = function(original) {
      var callList = [];
      var mock = function() {
        var body = {
          params:params,
          args:getArgsAsArray(arguments)
        }
        callList.push(new Call(body));
        if (returns.length > 0) {
          var returnIndex = (callList.length - 1) % returns.length;
          var me = this;
          var originalFn;
          if (original) {
            originalFn = function() {
              return original.apply(me,body.args);
            }
          }
          body.returnValue = returns[returnIndex].call(me,originalFn);
          return body.returnValue;
        }
      }
      mock.meter = new Meter(callList);
      return mock;
    }
  }
  var Mockabilly = function(){
    var spec = {};
    this.mockFn = function(name) {
      spec[name] = spec[name] || new MockFunction(name);
      return spec[name]
    }
    this.clearFn = function(name) {
      spec[name] = spec[name] || new MockFunction(name);
      spec[name].clear();
      return spec[name];
    }
    this.removeFn = function(name) {
      delete spec[name];
      return this;
    }
    this.clear = function() {
      spec = {};
    }
    this.build = function(appendee) {
      appendee = appendee || {};
      var meter = {};
      Object.keys(spec).forEach(function(name) {
        appendee[name] = spec[name].build(appendee[name]);
      });
      return appendee;
    }
  }
  var MockConstructor = function(prototypeInstance, mockabilly) {
    var instanceList = [];
    var constructorParams = [];
    this.addParam = addParamFn(this,constructorParams);
    this.build = function() {
      var constructor = function() {
        var mock = mockabilly.build(this);
        instanceList.push({
          call:new Call({
            params:constructorParams,
            args:getArgsAsArray(arguments)
          }),
          mock:mock
        })
      }
      constructor.getInstanceCount = function() {
        return instanceList.length;
      }
      constructor.getMock = function(index) {
        return instanceList[index].mock;
      }
      constructor.getCall = function(index) {
        return instanceList[index].call;
      }
      constructor.prototype = prototypeInstance;
      return constructor;
    }
  }
  Mockabilly.mockConstructor = function(prototypeInstance, mockabilly) {
    return new MockConstructor(prototypeInstance, mockabilly);
  }
  Mockabilly.mockFunction = function() {
    return new MockFunction();
  }
  var timeoutParams = {
    set:[{
      name:"onTimeout",
      type:"function"
    },{
      name:"tickCount",
      type:"number"
    }],
    clear:[{
      name:"timer",
      type:"object"
    }]
  }
  var buildTimeoutCallBody = function(type,args) {
    return {
      params:timeoutParams[type],
      args:getArgsAsArray(args)
    }
  }
  Mockabilly.mockTimeout = function() {
    var timers = {};
    var buildId = (function() {
      var a = 1;
      var b = 1;
      return function() {
        var out = Number(b).toString(16);
        var step = a + b;
        a = b;
        b = step;
        return out;
      }
    })()
    var clock = {
      mock:{
        setTimeout:function(callList){
          return function(onTimeout,tickCount){
            var callBody = buildTimeoutCallBody("set",arguments);
            callList.push(new Call(callBody));
            var id = buildId();
            timers[id] = {
              onTimeout:onTimeout,
              tickCount:tickCount
            }
            callBody.returnValue = {
              id:id
            }
            return callBody.returnValue;
          };
        },
        clearTimeout:function(callList) {
          return function(timer){
            callList.push(buildTimeoutCallBody("clear",arguments));
            delete timers[timer.id];
          }
        }
      },
      local:{}
    };
    var uptick = function(tickCount){
      if (tickCount > 0) {
        var times = Object.keys(timers).map(function(timerId) {
          return timers[timerId].tickCount;
        })
        times.sort();
        var time = times[0];
        if (time <= tickCount) {
          var ids = Object.keys(timers);
          var expired = ids.filter(function(timerId) {
            return timers[timerId].tickCount <= time;
          })
          var remaining = ids.filter(function(timerId) {
            return expired.indexOf(timerId) < 0;
          })
          expired.forEach(function(timerId) {
            timers[timerId].onTimeout();
            delete timers[timerId]
          })
          remaining.forEach(function(timerId) {
            timers[timerId].tickCount -= time
          })
          uptick(tickCount - time);
        } else {
          Object.keys(timers).forEach(function(timerId) {
            timers[timerId].tickCount -= tickCount
          })
        }
      }
    }
    return {
      useMock:function(){
        ['setTimeout','clearTimeout'].forEach(function(fn) {
          var callList = [];
          clock.local[fn] = global[fn];
          global[fn] = clock.mock[fn](callList);
          global[fn].meter = new Meter(callList);
        })
      },
      restore:function(){
        ['setTimeout','clearTimeout'].forEach(function(fn) {
          global[fn] = clock.local[fn];
        })
      },
      uptick:uptick
    }
  }
  this.Mockabilly = Mockabilly;
})();
