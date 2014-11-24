# jasmine-shared-context

`jasmine-shared-context` defines shared contexts that makes it easier to share common setup between tests. Heavily inspired by rspec’s feature with same name.

## Install

```
$ npm install --save-dev jasmine-shared-context
```

## Usage

```js
var sharedContext = require("jasmine-shared-context");

beforeAll(function() {
  sharedContext.install();
  registerSharedContext("environment", function() {
    beforeEach(function() {
      this.environment = {
        activeAccount: {name: "D’angelo Barksdale"},
        accounts: [
          {name: "Stringer Bell"},
          {name: "Avon Barksdale"}
        ] 
      };
    });
  });
});

describe("description name", function() {
  includeContext("environment");
  it("defines `environment`", function() {
    expect(this.environment).toBeDefined();
  });
});

context("context name", {context: "environment"}, function() {
  it("defines `environment`", function() {
    expect(this.environment).toBeDefined();
  }); 
});
```

## Web 

jasmine-shared-context supports running in browsers as well, `sharedContext` will be defined on the window in a non commonJS environment.