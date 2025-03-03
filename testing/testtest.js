(function(){
  var Tester =function() {
    var allTests = [];
    this.apply = function(){
      for (var x =0; x < arguments.length; x++) {
        allTests.push(arguments[x]);
      }
    }
    var build = function(err) {
      var stack = err.stack.split("\n    ");
      var out = {
        message:stack.shift(),
        stack:stack
      };
      return out;
    }
    this.run = function() {
      var log = {
        testLog:[],
        errorLog:[]
      }
      allTests.forEach(function(test){
        log.testLog.push(test.name);
        try {
          test.fn();
        } catch (e) {
          log.errorLog.push({
            path:test.name,
            error:build(e)
          })
        }
      })
      logger.log(JSON.stringify(log));
    }
  }
  this.tests = new Tester();
})()