(function(){
  const register = {};
  const recurse = function(name, path) {
    if (!register[name]) {
      throw new Error("Namespace '" + name + "' does not exist.")
    }
    if (path.indexOf(name) >= 0) {
      throw new Error("Circular dependency: " + path.concat(name).join(" -> "))
    }
    const {factoryFn, dependencies, service} = register[name];
    if (service) {
      return service;
    }
    const imports = {};
    for (let namespace in dependencies) {
      const alias = dependencies[namespace];
      if (alias in imports) {
        throw new Error(`Cannot reuse alias: "${namespace}" as "${alias}"`);
      }
      imports[alias] = recurse(namespace, path.concat(name));
    }
    const newService = factoryFn(imports);
    if ((typeof newService) != "object" && (typeof newService) != "function") {
      throw new Error(`A namespace must be an object or function; it cannot be a primitive value: ${name} - ${newService}`);
    }
    register[name] = { service: newService };
    return register[name].service;
  }
  window.importNamespace = function(name){
    return recurse(name, []);
  }
  window.namespace = function(name,dependencies,factoryFn) {
    if (!factoryFn) {
      factoryFn = dependencies;
      dependencies = {};
    }
    if (register[name]) {
      throw new Error("Namespace '" + name + "' has already been registered.");
    }
    if (Array.isArray(dependencies)) {
      dependencies = dependencies.reduce((out, dep) => { out[dep] = dep; return out; }, {});
    }
    register[name] = { dependencies, factoryFn };
  }
  window.imports = function(namespaces) {
    if (Array.isArray(namespaces)) {
      namespaces = namespaces.reduce((out, ns) => { out[ns] = ns; return out; }, {});
    }
    return Object.entries(namespaces).reduce((out,[ns,alias]) => {
      out[alias] = importNamespace(ns);
      return out;
    }, {});
  }
  window.listUnusedNamespaces = function() {
    const namespaces = Array.from(Object.entries(register).filter(([ns,{service}]) => !service).map(([ns]) => ns));
    namespaces.sort();
    return namespaces;
  }
})();