var expectError = function(message, operation) {
  var error;
  try {
    operation();
  } catch(e) {
    error = e;
  }
  if (!error) {
    throw new Error("error not thrown")
  }
  if (error.message != message) {
    throw new Error("actual error does not match expected:\nactual:"+error.message+"\nexpected:"+message);
  }
}
tests.apply({
  name:["expect","equals"],
  fn:function() {
    var a = 5;
    expect(a).to.equal(5);
    expect(a).to.not.equal(6);
    expectError("Values are equal:\n  Actual: 5,\n  Expected: 5",function(){
      expect(a).to.not.equal(5);
    })
    expectError("Values are not equal:\n  Actual: 5,\n  Expected: 6",function(){
      expect(a).to.equal(6);
    })
  }
},{
  name:["expect","deep equal"],
  fn:function() {
    var a = {
      a:1,
      b:"2",
      c:[5,6,7]
    }
    expect(a).to.deepEqual({
      b:2,
      a:"1",
      c:"567".split("")
    })
    expect(a).to.not.deepEqual({})
    
  }
},{
  name:["expect", "exist"],
  fn:function(){
    var obj = 5;
    expect(obj).to.exist();
    expect(obj.steve).to.not.exist();
    expectError("Value does not exist!",expect(obj.steve).to.exist);
    expectError("Value exists:\n  Value:5",expect(obj).to.not.exist);
  }
},{
  name:["expect", "match"],
  fn:function(){
    var value = 1875;
    expect(value).to.match("[0-9]{4}");
    expect(value).to.not.match("steve");
    expectError("Value matches pattern:\n  Value: 1875,\n  Pattern: /[0-9]{4}/",function(){
      expect(value).to.not.match("[0-9]{4}");
    });
    expectError("Value does not match pattern:\n  Value: 1875,\n  Pattern: /steve/",function(){
      expect(value).to.match("steve");
    });
  }
},{
  name:["expect", "exact"],
  fn:function() {
    expect(5).to.be(5);
    expect(5).to.not.be("5")
    expect(5).to.equal("5")
  }
},{
  name:["expect", "type"],
  fn:function() {
    expect(5).to.be.a("number");
    expect("").to.be.a("string");
    expect().to.be.a("undefined");
    expect([]).to.not.be.a("string");
    expect(null).to.be.a("object");
  }
},{
  name:["expect", "undefined"],
  fn:function() {
    var value;
    expect(value).to.be.undefined();
    expect().to.be.undefined();
    expect("").to.not.be.undefined();
  }
},{
  name:["expect", "true"],
  fn:function() {
    expect(2 < 5).to.be.true();
    expect(2 == 6).to.not.be.true();
    expect("steve").to.not.be.true();
  }
},{
  name:["expect", "false"],
  fn:function() {
    expect(2 == 6).to.be.false();
  }
})




