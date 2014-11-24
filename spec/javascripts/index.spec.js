var sharedContext = require("../../index");

describe("jasmine-shared-context", function() {
  describe("installing", function() {
    describe("in environmnet", function() {
      beforeEach(function() {
        this.env = new jasmine.Env();
        sharedContext.install(this.env);
      });
      it("defines `context`", function() {
        expect(this.env.context).toBeDefined();
      });
      it("defines `includeContext`", function() {
        expect(this.env.includeContext).toBeDefined();
      });
      it("defines `registerSharedContext`", function() {
        expect(this.env.registerSharedContext).toBeDefined();
      });
    });

    describe("globally", function() {
      beforeEach(function() {
        sharedContext.install();
      });
      it("defines `context`", function() {
        expect(context).toBeDefined();
      });
      it("defines `includeContext`", function() {
        expect(includeContext).toBeDefined();
      });
      it("defines `registerSharedContext`", function() {
        expect(registerSharedContext).toBeDefined();
      });
    });
  });

  describe("behavior", function() {
    beforeEach(function() {
      this.env = new jasmine.Env();
      sharedContext.install(this.env);
    });

    describe("#registerSharedContext and #includeContext", function() {
      describe("bop", function() {
        beforeEach(function(done) {
          this.contextSpy = jasmine.createSpy();
          this.env.registerSharedContext("sharedContext", this.contextSpy);
          this.env.describe("description", function() {
            this.env.includeContext("sharedContext");
            this.env.it("spec name 1", function() {
              this.env.expect(true).toEqual(true);
            }.bind(this));
          }.bind(this));
          this.env.addReporter({jasmineDone: done});
          this.env.execute();
        });
        it("calls sharedContext", function() {
          expect(this.contextSpy).toHaveBeenCalled();
        });
      });
    });

    describe("hooks", function() {
      beforeEach(function(done) {
        this.beforeEachSpy = jasmine.createSpy();
        this.afterEachSpy = jasmine.createSpy();
        this.beforeAllSpy = jasmine.createSpy();
        this.afterAllSpy = jasmine.createSpy();

        this.env.registerSharedContext("hooks", function() {
          this.env.beforeAll(this.beforeAllSpy);
          this.env.beforeEach(this.beforeEachSpy);
          this.env.afterEach(this.afterEachSpy);
          this.env.afterAll(this.afterAllSpy);
        }.bind(this));

        this.env.describe("description", function() {
          this.env.includeContext("hooks");
          this.env.it("spec name 1", function() {
            expect(true).toEqual(true);
          });
          this.env.it("spec name 2", function() {
            expect(true).toEqual(true);
          });
        });

        this.env.addReporter({jasmineDone: done});
        this.env.execute();
      });
      it("supports `beforeEach` hooks", function() {
        expect(this.beforeEachSpy.calls.count()).toEqual(2);
      });
      it("supports `afterEach` hooks", function() {
        expect(this.afterEachSpy.calls.count()).toEqual(2);
      });
      it("supports `beforeAll` hooks", function() {
        expect(this.beforeAllSpy.calls.count()).toEqual(1);
      });
      it("supports `afterAll` hooks", function() {
        expect(this.afterAllSpy.calls.count()).toEqual(1);
      });
    });

    describe("#context", function() {
      describe("{context: \"a shared context\"}", function() {
        beforeEach(function(done) {
          var env = this.env;
          this.hooksSpy = jasmine.createSpy();
          env.registerSharedContext("hooks", this.hooksSpy);

          env.context("context", {context: "hooks"}, function() {
            env.it("spec name 1", function() {
              env.expect(true).toEqual(true);
            });
          });
          env.addReporter({jasmineDone: done});
          env.execute();
        });

        it("runs passed in context", function() {
          expect(this.hooksSpy).toHaveBeenCalled();
        });
      });
      describe("context’s context", function() {
        beforeEach(function(done) {
          var env = this.env;
          this.contextSpy = jasmine.createSpy();
          env.context("context", this.contextSpy);
          env.addReporter({jasmineDone: done});
          env.execute();
        });
        it("calls context with a `jasmine.Suite` as this", function() {
          expect(this.contextSpy.calls.mostRecent().object).toEqual(jasmine.any(jasmine.Suite));
        });
      });
    });

    describe("call order of before each in shared context", function() {
      beforeEach(function(done) {
        this.callOrder = [];
        
        this.env.beforeEach(function() {
          this.callOrder.push("global");
        }.bind(this));

        this.env.registerSharedContext("beforeEachHooks", function() {
          this.env.beforeEach(function() {
            this.callOrder.push("sharedContext");
          }.bind(this));
        }.bind(this));

        this.env.describe("description", function() {
          this.env.includeContext("beforeEachHooks")
          this.env.beforeEach(function() {
            this.callOrder.push("suite");
          }.bind(this));
          this.env.it("spec name", function() {
            this.env.expect(true).toEqual(true);
          });
        }.bind(this));

        this.env.addReporter({jasmineDone: done});
        this.env.execute();
      });
      it("calls in correct order", function() {
        expect(this.callOrder).toEqual(["global", "sharedContext", "suite"]);
      });
    });
  });
});