# Namespace Dependency Management Framework Skill

## Overview

This framework provides a simple, lightweight **dependency injection** and **namespace management** system for JavaScript client applications. It enables modular code organization by:
- Isolating functionality into named namespaces
- Managing dependencies between modules
- Lazy-loading services only when needed
- Detecting circular dependencies
- Supporting flexible dependency aliasing

## When to Use This Skill

- Building modular JavaScript client applications
- Structuring code with clear separation of concerns
- Managing dependencies between multiple JavaScript modules
- Setting up namespace-based architecture for mid-to-large applications
- Implementing dependency injection patterns in vanilla JavaScript

## Core Framework Functions

### `namespace(name, dependencies, factoryFn)`
Registers a new namespace in the application.

**Parameters:**
- `name` (string): Unique identifier for the namespace
- `dependencies` (object or array, optional): Map of namespace names to aliases, or array of namespace names (uses same name as alias if array)
- `factoryFn` (function): Factory function that creates the namespace service. Receives `imports` object with aliased dependencies.

**Returns:** undefined (registers in global scope)

### `importNamespace(name)`
Imports a single namespace, resolving all its dependencies recursively.

**Parameters:**
- `name` (string): Name of the namespace to import

**Returns:** The instantiated namespace service (cached after first call)

### `imports(namespaces)`
Batch import helper for importing multiple namespaces at once.

**Parameters:**
- `namespaces` (object or array): Either `{namespaceName: alias}` or `[namespaceName1, namespaceName2, ...]`

**Returns:** Object with aliases mapped to instantiated namespace services

### `listUnusedNamespaces()`
Utility function to identify namespaces that haven't been instantiated yet.

**Returns:** Sorted array of namespace names with no service instances

## File Structure Pattern

Every JavaScript file created for the application should follow this pattern:

```javascript
namespace("myNamespace", {
  // Map of dependency namespace names to aliases used in this file
  "dependencyNamespace": "dependencyAlias",
  "anotherDependency": "another"
}, function({dependencyAlias, another}) {
  // All code for this module/file goes here
  // Dependencies are available as destructured parameters
  
  const myService = {
    method1: function() { /* ... */ },
    method2: function(param) { /* ... */ }
  };
  
  return myService;
});
```

## Usage Patterns

### Pattern 1: Object-Based Service (Most Common)
```javascript
namespace("utils", {}, function({}) {
  return {
    format: function(str) { return str.trim(); },
    validate: function(val) { return val !== null; }
  };
});

namespace("dataProcessor", {
  "utils": "util"
}, function({util}) {
  return {
    process: function(data) {
      if (util.validate(data)) {
        return util.format(data);
      }
    }
  };
});
```

### Pattern 2: Function-Based Service
```javascript
namespace("apiClient", {}, function({}) {
  return function(url, options) {
    return fetch(url, options).then(r => r.json());
  };
});
```

### Pattern 3: Multiple Dependencies with Aliasing
```javascript
namespace("applicationController", {
  "dataProcessor": "processor",
  "uiManager": "ui",
  "apiClient": "api"
}, function({processor, ui, api}) {
  return {
    initialize: function() {
      ui.render();
      api("/data").then(data => processor.process(data));
    }
  };
});
```

### Pattern 4: Array-Based Dependencies (Auto-Aliases)
```javascript
// Dependencies "utils" and "logger" will use same names as aliases
namespace("myModule", ["utils", "logger"], function({utils, logger}) {
  return {
    doSomething: function() {
      logger.log("Doing something");
      return utils.process();
    }
  };
});
```

### Pattern 5: No Dependencies
```javascript
namespace("config", {}, function({}) {
  return {
    apiUrl: "https://api.example.com",
    timeout: 5000
  };
});
```

## Bootstrap Pattern

### Step 1: Load the Framework
```html
<script src="path/to/script.js"></script>
```

### Step 2: Load All Namespace Definitions
```html
<script src="modules/utils.js"></script>
<script src="modules/api.js"></script>
<script src="modules/ui.js"></script>
<script src="modules/app.js"></script>
```

### Step 3: Initialize Application
```html
<script>
  // Import the root application namespace
  window.app = importNamespace("applicationController");
  app.initialize();
</script>
```

## Advanced Usage

### Importing Main Namespace
```javascript
// In application initialization
const appService = importNamespace("mainApp");
appService.start();
```

### Batch Imports with imports() Helper
```html
<script>
  // Import multiple namespaces at once
  const {api, ui, processor} = window.imports({
    "apiClient": "api",
    "uiManager": "ui", 
    "dataProcessor": "processor"
  });
  
  // Array syntax (uses same name as alias)
  const {utils, logger, storage} = window.imports(["utils", "logger", "storage"]);
</script>
```

### Debugging Unused Namespaces
```javascript
// Find namespaces registered but not used anywhere
const unused = listUnusedNamespaces();
console.warn("Unused namespaces:", unused);
```

## Framework Guarantees

✓ **Lazy Initialization**: Services are only created when first imported  
✓ **Singleton Pattern**: Each namespace is instantiated once and cached  
✓ **Circular Dependency Detection**: Throws error if circular deps detected  
✓ **Type Validation**: Warns if namespace returns primitive instead of object/function  
✓ **Alias Collision Detection**: Prevents reusing same alias for different dependencies  

## Error Handling

The framework will throw errors for:
- Undefined namespace: `"Namespace 'X' does not exist."`
- Circular dependency: `"Circular dependency: X -> Y -> Z -> X"`
- Duplicate alias: `"Cannot reuse alias: 'X' as 'Y'"`
- Duplicate registration: `"Namespace 'X' has already been registered."`
- Invalid return type: `"A namespace must be an object or function; it cannot be a primitive value"`

## Example Application

```javascript
// config.js
namespace("config", {}, function({}) {
  return { apiUrl: "https://api.example.com" };
});

// logger.js
namespace("logger", {}, function({}) {
  return {
    log: function(msg) { console.log("[LOG]", msg); },
    error: function(msg) { console.error("[ERROR]", msg); }
  };
});

// dataService.js
namespace("dataService", {"config": "cfg", "logger": "log"}, function({cfg, log}) {
  return {
    fetchData: function() {
      log.log("Fetching from " + cfg.apiUrl);
      return fetch(cfg.apiUrl).then(r => r.json());
    }
  };
});

// app.js
namespace("app", {"dataService": "data", "logger": "log"}, function({data, log}) {
  return {
    start: function() {
      log.log("App starting");
      return data.fetchData().then(result => {
        log.log("Data received: " + JSON.stringify(result));
      });
    }
  };
});

// main.html
// <script src="script.js"></script>
// <script src="config.js"></script>
// <script src="logger.js"></script>
// <script src="dataService.js"></script>
// <script src="app.js"></script>
// <script>
//   importNamespace("app").start();
// </script>
```

## Best Practices

1. **One Namespace Per File**: Keep each file focused on a single namespace
2. **Explicit Dependencies**: List all dependencies explicitly in the dependencies map
3. **Meaningful Names**: Use clear, descriptive namespace names
4. **Return Objects or Functions**: Always return an object or function, never primitives or null
5. **No Side Effects**: Keep factory functions pure; side effects should be in methods
6. **Document Dependencies**: Comment dependencies that might not be obvious
