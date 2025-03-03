(function () {
  global = global || window;
  let register = {};
  let oldImport = global.import;
  global.import = function (name, depObj, allowImports) {
    depObj = depObj || {};
    if (!(name in register)) {
      throw new Error(name + ' invalid service name');
    }
    let service = register[name];
    let fullDeps = Object.entries(service.dependencies).reduce((out, entry) => {
      if (typeof out == 'string') {
        return out;
      } else if (depObj[entry[0]]) {
        out[entry[1]] = depObj[entry[0]];
      } else if (allowImports) {
        out[entry[1]] = oldImport(entry[0]);
      } else {
        return 'Missing mocked namespace: ' + entry[0];
      }
      return out;
    }, {});
    let retVal = service.nsBuilder(fullDeps);
    return retVal;
  };
})();
