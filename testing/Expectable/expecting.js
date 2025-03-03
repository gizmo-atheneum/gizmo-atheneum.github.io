var expecting = [{
  "path": "equal",
  "msg": "Values are not equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "not": "Values are equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "params": "expected",
  "cond": "actual == expected"
},
{
  "path": "deepEqual",
  "msg": "Values are not equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "not": "Values are equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "params": "expected",
  "cond": "deep.eq(actual,expected)"
},
{
  "path": "exist",
  "msg": "Value does not exist!",
  "not": "Value exists:\n  Value:${arguments[0]}",
  "params": "",
  "cond": "actual != undefined && actual != null"
},
{
  "path": "match",
  "msg": "Value does not match pattern:\n  Value: ${arguments[0]},\n  Pattern: /${arguments[1]}/",
  "not": "Value matches pattern:\n  Value: ${arguments[0]},\n  Pattern: /${arguments[1]}/",
  "params": "regex",
  "cond": "new RegExp(regex).test(actual)"
},
{
  "path": "be",
  "msg": "Values are not strictly equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "not": "Values are strictly equal:\n  Actual: ${arguments[0]},\n  Expected: ${arguments[1]}",
  "params": "expected",
  "cond": "actual === expected"
},
{
  "path": "be.a",
  "msg": "Values does not match type:\n  Value: ${arguments[0]},\n  Type: ${arguments[1]}",
  "not": "Values matches type:\n  Value: ${arguments[0]},\n  Type: ${arguments[1]}",
  "params": "type",
  "cond": "typeof actual === type"
},
{
  "path": "be.anInstanceOf",
  "msg": "Values is not an instance of constructor",
  "msg": "Values is an instance of constructor",
  "params": "constructor",
  "cond": "actual instanceof constructor"
},
{
  "path": "be.undefined",
  "msg": "Value is not undefined:\n  Value:${arguments[0]}",
  "not": "Value is undefined!",
  "params": "",
  "cond": "typeof actual == 'undefined'"
},
{
  "path": "be.null",
  "msg": "Value is not null:\n  Value:${arguments[0]}",
  "not": "Value is null!",
  "params": "",
  "cond": "actual == null"
},
{
  "path": "be.ok",
  "msg": "Value is not truthy:\n  Value:${arguments[0]}",
  "not": "Value is truthy:\n  Value:${arguments[0]}",
  "params": "",
  "cond": "actual?true:false"
},
{
  "path": "be.empty",
  "msg": "Value is not empty:\n  Value:${arguments[0]}",
  "not": "Value is empty:\n  Value:${arguments[0]}",
  "params": "",
  "cond": "(((actual instanceof Array) || typeof actual == 'string')&& actual.length == 0) || (typeof actual == 'object' && Object.keys(actual).length == 0)"
},
{
  "path": "be.true",
  "msg": "Value is not true:\n  Value:${arguments[0]}",
  "not": "Value is true:\n  Value:${arguments[0]}",
  "params": "",
  "cond": "actual === true"
},
{
  "path": "be.false",
  "msg": "Value is not false:\n  Value:${arguments[0]}",
  "not": "Value is false:\n  Value:${arguments[0]}",
  "params": "",
  "cond": "actual === false"
},
{
  "path": "be.lessThan",
  "msg": "Value is not less than bound:\n  Value:${arguments[0]}\n  Bound:${arguments[1]}",
  "not": "Value is less than bound:\n  Value:${arguments[0]}\n  Bound:${arguments[1]}",
  "params": "bound",
  "cond": "actual < bound"
},
{
  "path": "be.greaterThan",
  "msg": "Value is not greater than bound:\n  Value:${arguments[0]}\n  Bound:${arguments[1]}",
  "not": "Value is greater than bound:\n  Value:${arguments[0]}\n  Bound:${arguments[1]}",
  "params": "bound",
  "cond": "actual > bound"
},
{
  "path": "be.within",
  "msg": "Value is not within bounds:\n  Value:${arguments[0]}\n  Low Bound:${arguments[1]}\n  High Bound:${arguments[2]}",
  "not": "Value is within bounds:\n  Value:${arguments[0]}\n  Low Bound:${arguments[1]}\n  High Bound:${arguments[2]}",
  "params": "low, high",
  "cond": "actual <= high && value >= low"
},
{
  "path": "have.any",
  "msg": "Array does not contain any of the given values:\n  Array:${arguments[0]}\n  Values${arguments[1]}",
  "not": "Array contains some of the given values:\n  Array:${arguments[0]}\n  Values${arguments[1]}",
  "params": "values",
  "cond": "contains.any(actual, values)"
},
{
  "path": "have.any.keys",
  "msg": "The object does not contain any of the given keys:\n  Object:${arguments[0]}\n  Keys${arguments[1]}",
  "not": "The object contains some of the given keys:\n  Object:${arguments[0]}\n  Keys${arguments[1]}",
  "params": "keys",
  "cond": "contains.any(Object.keys(actual), keys)"
},
{
  "path": "have.all",
  "msg": "Array does not contain all of the given values:\n  Array:${arguments[0]}\n  Values${arguments[1]}",
  "not": "Array contains all of the given values:\n  Array:${arguments[0]}\n  Values${arguments[1]}",
  "params": "values",
  "cond": "contains.all(actual, values)"
},
{
  "path": "have.all.keys",
  "msg": "The object does not contain all of the given keys:\n  Object:${arguments[0]}\n  Keys${arguments[1]}",
  "not": "The object contains all of the given keys:\n  Object:${arguments[0]}\n  Keys${arguments[1]}",
  "params": "keys",
  "cond": "contains.all(Object.keys(actual), keys)"
},
{
  "path": "have.length",
  "msg": "Array length does not equal bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "not": "Array length equals bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "params": "bound",
  "cond": "actual.length == bound"
},
{
  "path": "have.length.lessThan",
  "msg": "Array length is not less than bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "not": "Array length is less than bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "params": "bound",
  "cond": "actual.length < bound"
},
{
  "path": "have.length.greaterThan",
  "msg": "Array length is not greater than bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "not": "Array length is greater than bound:\n  Array:${arguments[0]}\n  Bound:${arguments[1]}",
  "params": "bound",
  "cond": "actual.length > bound"
},
{
  "path": "have.length.within",
  "msg": "Array length is not within bounds:\n  Value:${arguments[0]}\n  Low Bound:${arguments[1]}\n  High Bound:${arguments[2]}",
  "not": "Array length is within bounds:\n  Value:${arguments[0]}\n  Low Bound:${arguments[1]}\n  High Bound:${arguments[2]}",
  "params": "low, high",
  "cond": "actual.length <= high && actual.length >= low"
},
{
  "path": "have.property",
  "msg": "Property does not equal given value:\n  Object:${arguments[0]}\n  Key:${arguments[1]}\n  Value:${arguments[2]}",
  "not": "Property equals given value:\n  Object:${arguments[0]}\n  Key:${arguments[1]}\n  Value:${arguments[2]}",
  "params": "key, value",
  "cond": "actual[key] == value"
},
{
  "path": "have.deepProperty",
  "msg": "Property does not equal given value:\n  Object:${arguments[0]}\n  Key:${arguments[1]}\n  Value:${arguments[2]}",
  "not": "Property equals given value:\n  Object:${arguments[0]}\n  Key:${arguments[1]}\n  Value:${arguments[2]}",
  "params": "key, value",
  "cond": "deep.prop(actual,key,value)"
},
{
  "path": "contain",
  "msg": "Substring is not present in value:\n  Value: ${arguments[0]},\n  Substring: ${arguments[1]}",
  "not": "Substring is present in value:\n  Value: ${arguments[0]},\n  Substring: ${arguments[1]}",
  "params": "needle",
  "cond": "actual.indexOf(needle) >= 0"
}];