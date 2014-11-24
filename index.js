function context(name, options, body) {
  var env = this;
  if (!body) {
    body = options;
    options = {};
  }

  env.describe(name, function() {
    if (options.context) {
      env.includeContext(options.context);
    }
    body.apply(this, arguments);
  });
}

function includeContext(name) {
  var context = this.__contexts[name]; 
  if (context) {
    context();
  }
}

function registerSharedContext(name, context) {
  this.__contexts[name] = context;
}

function globalObject() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof global !== "undefined") {
    return global;
  }
}

function install(env) {
  var exports = globalObject();
  var installGlobally = false;
  if (!env) {
    env = exports.jasmine.getEnv();
    installGlobally = true;
  }

  env.__contexts = {};
  env.context = context.bind(env);
  env.includeContext = includeContext.bind(env);
  env.registerSharedContext = registerSharedContext.bind(env);

  if (installGlobally) {
    exports.includeContext = env.includeContext;
    exports.registerSharedContext = env.registerSharedContext;
    exports.context = env.context;
  }
}

var exports = {install: install};

if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
} else {
  window.sharedContext = exports;
}