describe("Mockabilly", function(){
  describe("mockFunction",function(){
    it("will always return undefined", function() {
      var mockFn = Mockabilly.mockFunction().build();

      var returnValue;
      returnValue = mockFn();
      expect(returnValue).to.be.undefined();
      returnValue = mockFn();
      expect(returnValue).to.be.undefined();// no return chain
      returnValue = mockFn();
      expect(returnValue).to.be.undefined();
    })

    it("will always return true", function() {
      var mockFn = Mockabilly.mockFunction().thenReturn(true).build();

      var returnValue;
      returnValue = mockFn();
      expect(returnValue).to.be.true();
      returnValue = mockFn();
      expect(returnValue).to.be.true();// return chain continues
      returnValue = mockFn();
      expect(returnValue).to.be.true();
    })

    it("will always return false", function() {
      var mockFn = Mockabilly.mockFunction().thenReturn(false).build();

      var returnValue;
      returnValue = mockFn();
      expect(returnValue).to.be.false();
      returnValue = mockFn();
      expect(returnValue).to.be.false();
      returnValue = mockFn();
      expect(returnValue).to.be.false();
    })

    it("will alternate returning true and false", function() {
      var mockFn = Mockabilly.mockFunction()
        .thenReturn(true)
        .thenReturn(false)
        .build();

      var returnValue;
      returnValue = mockFn();
      expect(returnValue).to.be.true();

      returnValue = mockFn();
      expect(returnValue).to.be.false();


      returnValue = mockFn();
      expect(returnValue).to.be.true();

      returnValue = mockFn();
      expect(returnValue).to.be.false();
    })

    it("will always throw 'invalid'", function() {
      var error = 'invalid';
      var mockFn = Mockabilly.mockFunction().thenThrow(error).build();

      var returnValue;
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(returnValue).to.be.undefined();

      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.equal(error);
      }
      expect(returnValue).to.be.undefined();
    })

    it("will always throw Error object", function() {
      var errorMessage = 'invalid';
      var error = new Error(errorMessage);
      var mockFn = Mockabilly.mockFunction().thenThrow(error).build();

      var returnValue;
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.deepEqual(error);
      }
      expect(returnValue).to.be.undefined();
    })

    it("will alternate throws and returns in prescribed pattern", function() {
      var errorMessage = 'invalid';
      var error = new Error(errorMessage);
      var message1 = 'valid';
      var message2 = 'also valid';
      var mockFn = Mockabilly.mockFunction()
        .thenReturn(message1)
        .thenThrow(error)
        .thenReturn(message2)
        .thenThrow(errorMessage)
        .build();

      var returnValue;
      returnValue = mockFn();
      expect(returnValue).to.be(message1);
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.deepEqual(error);
      }
      expect(returnValue).to.be(message1);
      returnValue = mockFn();
      expect(returnValue).to.be(message2);
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.deepEqual(errorMessage);
      }
      expect(returnValue).to.be(message2);

      // chain repeats
      returnValue = mockFn();
      expect(returnValue).to.be(message1);
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.deepEqual(error);
      }
      expect(returnValue).to.be(message1);
      returnValue = mockFn();
      expect(returnValue).to.be(message2);
      try {
        returnValue = mockFn();
      } catch (err) {
        expect(err).to.deepEqual(errorMessage);
      }
      expect(returnValue).to.be(message2);

    })

    it("will record calls", function() {
      var mockFn = Mockabilly.mockFunction().build()

      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(1);
      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(2);
      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(3);
      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(4);
      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(5);
      mockFn();
      expect(mockFn.meter.getCallCount()).to.equal(6);
    })

    it("will record arguments for each call", function() {
      var mockFn = Mockabilly.mockFunction().build()
      var call;
      mockFn("a");
      expect(mockFn.meter.getCallCount()).to.equal(1);
      call = mockFn.meter.getCall(0);
      expect(call.getArgumentCount()).to.equal(1);
      expect(call.getArgument(0)).to.equal('a');
      mockFn("b");
      expect(mockFn.meter.getCallCount()).to.equal(2);
      call = mockFn.meter.getCall(1);
      expect(call.getArgumentCount()).to.equal(1);
      expect(call.getArgument(0)).to.equal('b');
      mockFn("c");
      expect(mockFn.meter.getCallCount()).to.equal(3);
      call = mockFn.meter.getCall(2);
      expect(call.getArgumentCount()).to.equal(1);
      expect(call.getArgument(0)).to.equal('c');
    })

    it("will record arguments for each call", function() {
      var mockFn = Mockabilly.mockFunction().build()

      mockFn("a");
      expect(mockFn.meter.getCallCount()).to.equal(1);
      call = mockFn.meter.getCall(0);
      expect(call.getArgumentCount()).to.equal(1);
      expect(call.getArgument(0)).to.equal('a');
      mockFn('a',"b");
      expect(mockFn.meter.getCallCount()).to.equal(2);
      call = mockFn.meter.getCall(1);
      expect(call.getArgumentCount()).to.equal(2);
      expect(call.getArgument(0)).to.equal('a');
      expect(call.getArgument(1)).to.equal('b');
      mockFn('a',"b","c");
      expect(mockFn.meter.getCallCount()).to.equal(3);
      call = mockFn.meter.getCall(2);
      expect(call.getArgumentCount()).to.equal(3);
      expect(call.getArgument(0)).to.equal('a');
      expect(call.getArgument(1)).to.equal('b');
      expect(call.getArgument(2)).to.equal('c');
      mockFn('a',"b","c","d");
      expect(mockFn.meter.getCallCount()).to.equal(4);
      call = mockFn.meter.getCall(3);
      expect(call.getArgumentCount()).to.equal(4);
      expect(call.getArgument(0)).to.equal('a');
      expect(call.getArgument(1)).to.equal('b');
      expect(call.getArgument(2)).to.equal('c');
      expect(call.getArgument(3)).to.equal('d');
    })

    it("can recognize parameters",function() {
      var mockFn = Mockabilly.mockFunction()
        .addParam('firstName')
        .addParam('lastName')
        .build()

      var call;

      mockFn("Malcolm","Reynolds");
      call = mockFn.meter.getLastCall(); // retrieves the most recent call
      expect(call.getParameter('firstName')).to.equal("Malcolm");
      expect(call.getParameter('lastName')).to.equal("Reynolds");

      mockFn("Richard","Castle");
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstName')).to.equal("Richard");
      expect(call.getParameter('lastName')).to.equal("Castle");

      mockFn("Hermes");
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstName')).to.equal("Hermes");
      expect(call.getParameter('lastName')).to.be.undefined();
    })

    it("can validate parameter type",function() {
      var mockFn = Mockabilly.mockFunction()
        .addParam('firstName','string')
        .addParam('lastName','string')
        .addParam('dateOfBirth',Date)
        .build()

      var call;

      mockFn("Malcolm","Reynolds",new Date(2475,3,2));
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstName')).to.equal("Malcolm");
      expect(call.isParameterTypeValid('firstName')).to.be.true();
      expect(call.getParameter('lastName')).to.equal("Reynolds");
      expect(call.isParameterTypeValid('lastName')).to.be.true();
      expect(call.getParameter('dateOfBirth')).to.deepEqual(new Date(2475,3,2));
      expect(call.isParameterTypeValid('dateOfBirth')).to.be.true();

      mockFn("Richard","Castle","1968/5/17");
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstName')).to.equal("Richard");
      expect(call.isParameterTypeValid('firstName')).to.be.true();
      expect(call.getParameter('lastName')).to.equal("Castle");
      expect(call.isParameterTypeValid('lastName')).to.be.true();
      expect(call.getParameter('dateOfBirth')).to.deepEqual("1968/5/17");
      expect(call.isParameterTypeValid('dateOfBirth')).to.be.false(); // string date is not a Date instance

      mockFn("Hermes",null,new Date(-300,1,1));
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstName')).to.equal("Hermes");
      expect(call.isParameterTypeValid('firstName')).to.be.true();
      expect(call.getParameter('lastName')).to.be.null;
      expect(call.isParameterTypeValid('lastName')).to.be.false(); // null is not a string
      expect(call.getParameter('dateOfBirth')).to.deepEqual(new Date(-300,1,1));
      expect(call.isParameterTypeValid('dateOfBirth')).to.be.true();
    })

    it("can track var args",function() {
      var mockFn = Mockabilly.mockFunction()
        .addParam('firstItem')
        .build();

      var call;

      mockFn("primo","secundo","trio");
      call = mockFn.meter.getLastCall();
      expect(call.getParameter('firstItem')).to.equal("primo");
      expect(call.getUnAssignedCount()).to.equal(2);
      expect(call.getUnAssignedArgument(0)).to.equal("secundo");
      expect(call.getUnAssignedArgument(1)).to.equal("trio");
    })

    it("can return another mockFunction as a callback",function() {
      var mockCb = Mockabilly.mockFunction().build();
      var mockFn = Mockabilly.mockFunction().thenReturn(mockCb).build();

      mockFn("This is the mock function argument")("This is the mock callback argument")

      var fnCall = mockFn.meter.getLastCall();
      expect(fnCall.getArgument(0)).to.equal("This is the mock function argument");

      var cbCall = mockCb.meter.getLastCall();
      expect(cbCall.getArgument(0)).to.equal("This is the mock callback argument");

    })

    it("can return the result of a callback",function() {
      var obj = {
        field:"Hi there"
      }
      var mockFn = Mockabilly.mockFunction().thenReturnResult(function() {
        return obj.field;
      }).build();

      expect(mockFn()).to.equal("Hi there");

      obj.field = "Go away";
      expect(mockFn()).to.equal("Go away");

      obj.field = "wait a minute";
      expect(mockFn()).to.equal("wait a minute");
    });

    it("can return the result of a callback involving the scope of its owner",function() {
      var resultFn = function() {
        return this.field;
      }
      var obj = {
        field:"Hi there",
        fn:Mockabilly.mockFunction().thenReturnResult(resultFn).build()
      }

      expect(obj.fn()).to.equal("Hi there");

      obj.field = "Go away";
      expect(obj.fn()).to.equal("Go away");

      obj.field = "wait a minute";
      expect(obj.fn()).to.equal("wait a minute");
    });
  });
  describe("instance", function(){
    it("can mock an object with multiple functions",function() {
      var mocker = new Mockabilly();
      mocker.mockFn("setName").addParam("name");

      mocker.mockFn("getName")
        .thenReturn("Steve")
        .thenReturn("Dave")
        .thenReturn(undefined);

      var personMock = mocker.build();
      var setNameCall;
      var name;

      personMock.setName("Kyle");
      setNameCall = personMock.setName.meter.getLastCall();
      expect(setNameCall.getParameter("name")).to.equal("Kyle");

      name = personMock.getName(); // calling mock of getName, unrelated to call of setName
      expect(name).to.equal("Steve"); // follows pattern of return chain

      personMock.setName("Jeffrey");
      setNameCall = personMock.setName.meter.getLastCall();
      expect(setNameCall.getParameter("name")).to.equal("Jeffrey");
      name = personMock.getName();
      expect(name).to.equal("Dave");

      personMock.setName("Walter");
      setNameCall = personMock.setName.meter.getLastCall();
      expect(setNameCall.getParameter("name")).to.equal("Walter");
      name = personMock.getName();
      expect(name).to.be.undefined();

      personMock.setName("Joshua");
      setNameCall = personMock.setName.meter.getLastCall();
      expect(setNameCall.getParameter("name")).to.equal("Joshua");
      name = personMock.getName();
      expect(name).to.equal("Steve"); // chain repeats
    });

    it("can add mock functions to an existing object",function() {
      var joe = {
        getFirstName:function() {
          return 'Joe';
        },
        getLastName:function() {
          return 'Cocker';
        }
      }
      var mocker = new Mockabilly();
      mocker.mockFn('getDateOfBirth').thenReturn(new Date(1978,5,17));
      mocker.build(joe);

      expect(joe.getDateOfBirth()).to.deepEqual(new Date(1978,5,17));
    });

    it("can add mock functions to an existing function",function() {
      var not = function(value) {
        return !value;
      }
      var mocker = new Mockabilly();
      mocker.mockFn('now').thenReturn(new Date(1978,5,17));
      // TODO -- finish test
    });

    it("mock functions can return the result of a callback involving the scope of its owner",function() {
      var resultFn = function() {
        return this.field;
      }
      var obj = {
        field:"Hi there"
      }
      var mocker = new Mockabilly();
      mocker.mockFn('fn').thenReturnResult(resultFn);
      mocker.build(obj);

      expect(obj.fn()).to.equal("Hi there");

      obj.field = "Go away";
      expect(obj.fn()).to.equal("Go away");

      obj.field = "wait a minute";
      expect(obj.fn()).to.equal("wait a minute");
    });

    it("mock functions return result callback has access to the original function",function() {
      var resultFn = function(original) {
        return original() + " Steve.";
      }
      var obj = {
        field:"Hi there",
        fn:function() {
          return this.field;
        }
      }
      var mocker = new Mockabilly();
      mocker.mockFn('fn').thenReturnResult(resultFn);
      mocker.build(obj);

      expect(obj.fn()).to.equal("Hi there Steve.");

      obj.field = "Go away";
      expect(obj.fn()).to.equal("Go away Steve.");

      obj.field = "wait a minute";
      expect(obj.fn()).to.equal("wait a minute Steve.");
    });

    it("can override functions on an existing object with mocks",function() {
      var obj = {
        field:"Hi there",
        fn:function() {
          return this.field;
        }
      }
      expect(obj.fn()).to.equal("Hi there");

      obj.field = "Help me";
      expect(obj.fn()).to.equal("Help me");

      var mocker = new Mockabilly();
      mocker.mockFn('fn')
        .thenReturn("Walt")
        .thenReturn("Joe")
        .thenReturn("Steve")
      mocker.build(obj);

      expect(obj.fn()).to.equal("Walt");

      obj.field = "Go away";
      expect(obj.fn()).to.equal("Joe");

      obj.field = "wait a minute";
      expect(obj.fn()).to.equal("Steve");
    });
  });
  
  describe("mockConstructor",function(){
    it("creates mock instances",function() {
      var Person = function(){};
      var personMocker = new Mockabilly();
      var MockPerson = Mockabilly.mockConstructor(new Person(), personMocker).build();

      personMocker.mockFn("setName").addParam("name","string");

      var joeMock = new MockPerson();

      var steveMock = new MockPerson();

      joeMock.setName("Roger");
      steveMock.setName("Walt");
      joeMock.setName("Boris");
      steveMock.setName("Dave");
      joeMock.setName("Steve");

      var call;

      expect(joeMock.setName.meter.getCallCount()).to.equal(3);
      call = joeMock.setName.meter.getCall(0);
      expect(call.getParameter("name")).to.equal("Roger");
      call = joeMock.setName.meter.getCall(1);
      expect(call.getParameter("name")).to.equal("Boris");
      call = joeMock.setName.meter.getCall(2);
      expect(call.getParameter("name")).to.equal("Steve");

      expect(steveMock.setName.meter.getCallCount()).to.equal(2);
      call = steveMock.setName.meter.getCall(0);
      expect(call.getParameter("name")).to.equal("Walt");
      call = steveMock.setName.meter.getCall(1);
      expect(call.getParameter("name")).to.equal("Dave");
    });

    it("instances match instanceof a chosen prototype (class)",function() {
      var Person = function(){};
      var personMocker = new Mockabilly();
      var MockPerson = Mockabilly.mockConstructor(new Person(), personMocker).build();

      var joe = new MockPerson();

      expect(joe).to.be.anInstanceOf(Person);
    });

    it("tracks its instances and the calls that created them",function() {
      var Dog = function(name,age) {}
      var dogMocker = new Mockabilly();
      var MockDog = Mockabilly.mockConstructor(new Dog(),dogMocker).addParam("name","string").addParam("age","number").build();

      var dogs = {
        "Petey":7,
        "Fang":12,
        "Spot":3,
        "Chichi":6
      };

      var names = Object.keys(dogs);

      mockDogs = names.map(function(name) {
        return new MockDog(name,dogs[name]);
      })

      expect(MockDog.getInstanceCount()).to.equal(4);

      mockDogs.forEach(function(dog,index) {
        var mock = MockDog.getMock(index);
        expect(mock).to.equal(dog);
        var call = MockDog.getCall(index);
        expect(call.getParameter('name')).to.equal(names[index]);
        expect(call.getParameter('age')).to.equal(dogs[names[index]]);
      })
    })

    it("underlying mockabilly can have its nature changed so that different instances can behave differently", function() {
      var Person = function(){};
      var personMocker = new Mockabilly();
      var MockPerson = Mockabilly.mockConstructor(new Person(), personMocker).build();

      personMocker.mockFn("getName").thenReturn("Joe");

      var joeMock = new MockPerson();

      expect(joeMock.getName()).to.equal("Joe");
      expect(joeMock.getName()).to.equal("Joe");
      expect(joeMock.getName()).to.equal("Joe");

      personMocker.removeFn("getName").mockFn("getName").thenReturn("Steve");

      var steveMock = new MockPerson();

      expect(steveMock.getName()).to.equal("Steve");
      expect(steveMock.getName()).to.equal("Steve");
      expect(steveMock.getName()).to.equal("Steve");

      expect(joeMock.getName()).to.equal("Joe");
      expect(joeMock.getName()).to.equal("Joe");

      expect(steveMock.getName()).to.equal("Steve");

    });
  });
  
  describe("mockTimeout",function() {
    it("replaces global functions 'setTimeout' and 'clearTimeout' with mock versions", function() {
      var local = {
        set:setTimeout,
        clear:clearTimeout
      }
      var clock = Mockabilly.mockTimeout();
      clock.useMock();
      expect(setTimeout).to.not.equal(local.set)
      expect(setTimeout.meter).to.not.be.undefined;
      expect(clearTimeout).to.not.equal(local.clear)
      expect(clearTimeout.meter).to.not.be.undefined;
      clock.restore();
      expect(setTimeout).to.equal(local.set)
      expect(clearTimeout).to.equal(local.clear)
    })

    it("will mock the Timeout's perception of the passage of time", function() {
      var clock = Mockabilly.mockTimeout();
      clock.useMock();
      var obj = {name:"Steve"}
      setTimeout(function() {
        obj.name = "Dave"
      },10)
      expect(obj.name).to.equal("Steve");
      clock.uptick(6);
      expect(obj.name).to.equal("Steve");
      clock.uptick(6);
      expect(obj.name).to.equal("Dave");
      clock.restore();
    })

    it("can handle multiple calls of setTimeout", function() {
      var clock = Mockabilly.mockTimeout();
      clock.useMock();
      var obj = {
        string:""
      }
      setTimeout(function() {
        obj.string += 'A';
      },10);
      setTimeout(function() {
        obj.string += 'B';
      },20);
      setTimeout(function() {
        obj.string += 'C';
      },30);
      setTimeout(function() {
        obj.string += 'D';
      },40);
      expect(obj.string).to.equal("");
      clock.uptick(50);
      expect(obj.string).to.equal("ABCD");
      clock.restore();
    })

    it("can handle recursive timeouts", function() {
      var clock = Mockabilly.mockTimeout();
      clock.useMock();
      var obj = {
        string:"A"
      }
      var recurseTimeout = function() {
        var code = obj.string.charCodeAt(obj.string.length - 1);
        var char = String.fromCharCode(code + 1);
        obj.string += char;
        setTimeout(recurseTimeout, 5);
      }
      expect(obj.string).to.equal("A")
      recurseTimeout();
      expect(obj.string).to.equal("AB")
      clock.uptick(6);
      expect(obj.string).to.equal("ABC")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCD")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDE")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDEF")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDEFG")
      clock.restore();
    })

    it("can handle clearing recursive timeouts", function() {
      var clock = Mockabilly.mockTimeout();
      clock.useMock();
      var obj = {
        string:"A",
        timer:{}
      }
      var recurseTimeout = function() {
        var code = obj.string.charCodeAt(obj.string.length - 1);
        var char = String.fromCharCode(code + 1);
        obj.string += char;
        obj.timer = setTimeout(recurseTimeout, 5);
      }
      expect(obj.string).to.equal("A")
      recurseTimeout();
      expect(obj.string).to.equal("AB")
      clock.uptick(6);
      expect(obj.string).to.equal("ABC")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCD")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDE")
      clearTimeout(obj.timer);
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDE")
      clock.uptick(5);
      expect(obj.string).to.equal("ABCDE")
      clock.restore();
    })
  });
})
