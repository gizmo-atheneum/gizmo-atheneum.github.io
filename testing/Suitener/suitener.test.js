tests.apply({
  name:["suitener","describe executes"],
  fn:function() {
    var temp = logger.log;
    var logs = [];
    logger.log = function(body) {
      logs.push(body);
    }
    describe("test package",function(){}) // this is what we are testing
    
    expect(logs.length).to.equal(1);
    expect(JSON.parse(logs[0])).to.deepEqual({
      "errorLog":[],
      "testLog":[],
      "stat":{
        "count":0,
        "fails":0,
        "success":0
      }
    });
    
    logger.log = temp;
  }
},{
  name:["suitener","test fails"],
  fn:function() {
    var temp = logger.log;
    var logs = [];
    logger.log = function(body) {
      logs.push(body);
    }
    describe("test package",function(){
      it("test 1", function() {
        throw new Error("this is the error.");
      })
    }) // this is what we are testing
    
    expect(logs.length).to.equal(1);
    var log = JSON.parse(logs[0]);
    expect(log.errorLog.length).to.equal(1);
    expect(log.testLog.length).to.equal(1);
    logger.log = temp;
  }
})


