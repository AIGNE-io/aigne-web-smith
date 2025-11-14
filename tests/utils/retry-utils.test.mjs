import { describe, expect, test } from "bun:test";
import { userContextAt } from "../../utils/retry-utils.mjs";

describe("userContextAt", () => {
  test("throws error when userContext is not available", () => {
    const options = { context: {} };
    expect(() => userContextAt(options, "test.path")).toThrow("userContext is not available");
  });

  test("get() returns undefined for non-existent path", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    expect(ctx.get()).toBeUndefined();
  });

  test("get() with key returns undefined for non-existent nested path", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    expect(ctx.get("updateMeta")).toBeUndefined();
  });

  test("set() and get() work for direct value", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    ctx.set("test value");
    expect(ctx.get()).toBe("test value");
  });

  test("set() and get() work for nested value", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    ctx.set("updateMeta", { title: "New Title" });
    expect(ctx.get("updateMeta")).toEqual({ title: "New Title" });
  });

  test("set() creates intermediate objects automatically", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    ctx.set("updateMeta", { title: "New Title" });
    // Verify the path was created
    expect(options.context.userContext.lastToolInputs).toBeDefined();
    expect(options.context.userContext.lastToolInputs["/about"]).toBeDefined();
    expect(options.context.userContext.lastToolInputs["/about"].updateMeta).toEqual({
      title: "New Title",
    });
  });

  test("multiple paths work independently", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx1 = userContextAt(options, "currentPageDetails./about");
    const ctx2 = userContextAt(options, "currentPageDetails./contact");
    const ctx3 = userContextAt(options, "lastToolInputs./about");

    ctx1.set("about page detail");
    ctx2.set("contact page detail");
    ctx3.set("updateMeta", { title: "About Title" });

    expect(ctx1.get()).toBe("about page detail");
    expect(ctx2.get()).toBe("contact page detail");
    expect(ctx3.get("updateMeta")).toEqual({ title: "About Title" });
  });

  test("get() returns the entire object when no key provided", () => {
    const options = {
      context: {
        userContext: {
          lastToolInputs: {
            "/about": {
              updateMeta: { title: "Title" },
              addSection: { section: "test" },
            },
          },
        },
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    const result = ctx.get();
    expect(result).toEqual({
      updateMeta: { title: "Title" },
      addSection: { section: "test" },
    });
  });

  test("set() overwrites existing value", () => {
    const options = {
      context: {
        userContext: {
          currentPageDetails: {
            "/about": "old value",
          },
        },
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    ctx.set("new value");
    expect(ctx.get()).toBe("new value");
  });

  test("set() overwrites existing nested value", () => {
    const options = {
      context: {
        userContext: {
          lastToolInputs: {
            "/about": {
              updateMeta: { title: "Old Title" },
            },
          },
        },
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    ctx.set("updateMeta", { title: "New Title", description: "New Desc" });
    expect(ctx.get("updateMeta")).toEqual({ title: "New Title", description: "New Desc" });
  });

  test("handles nested paths correctly", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    ctx.set("about page");
    expect(ctx.get()).toBe("about page");
    expect(options.context.userContext.currentPageDetails["/about"]).toBe("about page");
  });

  test("set() with object value", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    const pageDetail = { title: "About", sections: [] };
    ctx.set(pageDetail);
    expect(ctx.get()).toEqual(pageDetail);
  });

  test("set() with null value", () => {
    const options = {
      context: {
        userContext: {},
      },
    };
    const ctx = userContextAt(options, "currentPageDetails./about");
    ctx.set(null);
    expect(ctx.get()).toBeNull();
  });

  test("get() returns undefined for non-existent key in existing path", () => {
    const options = {
      context: {
        userContext: {
          lastToolInputs: {
            "/about": {
              updateMeta: { title: "Title" },
            },
          },
        },
      },
    };
    const ctx = userContextAt(options, "lastToolInputs./about");
    expect(ctx.get("nonExistent")).toBeUndefined();
  });
});

