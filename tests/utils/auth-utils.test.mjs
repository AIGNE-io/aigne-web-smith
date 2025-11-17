import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as yaml from "yaml";
import {
  getAccessToken,
  getCachedAccessToken,
  getOfficialAccessToken,
  getPagesKitMountPoint,
  getWebSmithEnvFilePath,
} from "../../utils/auth-utils.mjs";
import * as blockletUtils from "../../utils/blocklet.mjs";

// Mock external modules that involve network requests
const mockCreateConnect = mock(() => Promise.resolve({ accessKeySecret: "new-access-token" }));
const mockOpen = mock(() => Promise.resolve());
const mockJoinURL = mock((base, path) => `${base}${path}`);
const mockWithQuery = mock((url, params) => {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  return urlObj.toString();
});

describe("auth-utils", () => {
  let originalEnv;

  // Spies for internal operations
  let existsSyncSpy;
  let readFileSpy;
  let writeFileSpy;
  let mkdirSyncSpy;
  let homedirSpy;
  let joinSpy;
  let parseSpy;
  let stringifySpy;
  let getComponentMountPointSpy;
  let consoleWarnSpy;
  let consoleLogSpy;
  let fetchSpy;

  beforeAll(() => {
    // Apply mocks for external dependencies that involve network requests
    mock.module("@aigne/cli/utils/aigne-hub/credential.js", () => ({
      createConnect: mockCreateConnect,
    }));
    mock.module("open", () => ({ default: mockOpen }));
    mock.module("ufo", () => ({
      joinURL: mockJoinURL,
      withQuery: mockWithQuery,
    }));
    mock.module("@blocklet/payment-broker-client", () => ({
      PAYMENT_KIT_DID: "z8iPaymentKitDID",
    }));
  });

  afterAll(() => {
    // Restore all mocks when this test file is complete
    mock.restore();
  });

  beforeEach(() => {
    originalEnv = { ...process.env };
    delete process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN;
    delete process.env.PAGES_KIT_ACCESS_TOKEN;
    delete process.env.WEB_SMITH_BASE_URL;

    // Reset external mocks
    mockCreateConnect.mockClear();
    mockCreateConnect.mockImplementation(() =>
      Promise.resolve({ accessKeySecret: "new-access-token" }),
    );
    mockOpen.mockClear();
    mockOpen.mockImplementation(() => Promise.resolve());
    mockJoinURL.mockClear();
    mockJoinURL.mockImplementation((base, path) => `${base}${path}`);
    mockWithQuery.mockClear();
    mockWithQuery.mockImplementation((url, params) => {
      const urlObj = new URL(url);
      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value);
      });
      return urlObj.toString();
    });

    // Spy on filesystem operations
    existsSyncSpy = spyOn(fs, "existsSync").mockReturnValue(false);
    readFileSpy = spyOn(fsPromises, "readFile").mockResolvedValue("");
    writeFileSpy = spyOn(fsPromises, "writeFile").mockResolvedValue();
    mkdirSyncSpy = spyOn(fs, "mkdirSync").mockImplementation(() => {});

    // Spy on path operations
    homedirSpy = spyOn(os, "homedir").mockReturnValue("/mock/home");
    joinSpy = spyOn(path, "join").mockImplementation((...paths) => paths.join("/"));

    // Spy on YAML operations
    parseSpy = spyOn(yaml, "parse").mockReturnValue({});
    stringifySpy = spyOn(yaml, "stringify").mockReturnValue("mock yaml");

    // Spy on blocklet operations
    getComponentMountPointSpy = spyOn(blockletUtils, "getComponentMountPoint").mockResolvedValue(
      "/mount",
    );

    // Spy on console methods
    consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {});
    consoleLogSpy = spyOn(console, "log").mockImplementation(() => {});

    // Mock global fetch
    fetchSpy = spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: "https://short.url" }),
    });
  });

  afterEach(() => {
    process.env = originalEnv;

    // Restore all spies
    existsSyncSpy?.mockRestore();
    readFileSpy?.mockRestore();
    writeFileSpy?.mockRestore();
    mkdirSyncSpy?.mockRestore();
    homedirSpy?.mockRestore();
    joinSpy?.mockRestore();
    parseSpy?.mockRestore();
    stringifySpy?.mockRestore();
    getComponentMountPointSpy?.mockRestore();
    consoleWarnSpy?.mockRestore();
    consoleLogSpy?.mockRestore();
    fetchSpy?.mockRestore();
  });

  // GETWEBSMITHEENVFILEPATH TESTS
  describe("getWebSmithEnvFilePath", () => {
    test("should return correct file path", () => {
      const result = getWebSmithEnvFilePath();
      expect(result).toBe("/mock/home/.aigne/web-smith-connected.yaml");
      expect(joinSpy).toHaveBeenCalledWith("/mock/home", ".aigne", "web-smith-connected.yaml");
    });
  });

  // GETCACHEDACCESSTOKEN TESTS
  describe("getCachedAccessToken", () => {
    test("should return access token from WEB_SMITH_PUBLISH_ACCESS_TOKEN environment variable", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "env-token";

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBe("env-token");
    });

    test("should return access token from PAGES_KIT_ACCESS_TOKEN environment variable", async () => {
      process.env.PAGES_KIT_ACCESS_TOKEN = "pages-token";

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBe("pages-token");
    });

    test("should prioritize WEB_SMITH_PUBLISH_ACCESS_TOKEN over PAGES_KIT_ACCESS_TOKEN", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "web-token";
      process.env.PAGES_KIT_ACCESS_TOKEN = "pages-token";

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBe("web-token");
    });

    test("should read access token from config file", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("WEB_SMITH_PUBLISH_ACCESS_TOKEN: config-token");
      parseSpy.mockReturnValue({
        "example.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "config-token",
        },
      });

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBe("config-token");
      expect(joinSpy).toHaveBeenCalledWith("/mock/home", ".aigne", "web-smith-connected.yaml");
      expect(existsSyncSpy).toHaveBeenCalledWith("/mock/home/.aigne/web-smith-connected.yaml");
      expect(readFileSpy).toHaveBeenCalledWith(
        "/mock/home/.aigne/web-smith-connected.yaml",
        "utf8",
      );
      expect(parseSpy).toHaveBeenCalled();
    });

    test("should read PAGES_KIT_ACCESS_TOKEN from config file if WEB_SMITH_PUBLISH_ACCESS_TOKEN not found", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("PAGES_KIT_ACCESS_TOKEN: pages-config-token");
      parseSpy.mockReturnValue({
        "example.com": {
          PAGES_KIT_ACCESS_TOKEN: "pages-config-token",
        },
      });

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBe("pages-config-token");
    });

    test("should handle config file read errors", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockRejectedValue(new Error("File read error"));

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Could not read the configuration file:",
        "File read error",
      );
    });

    test("should handle missing hostname in config", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("WEB_SMITH_PUBLISH_ACCESS_TOKEN: token");
      parseSpy.mockReturnValue({
        "other-domain.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "other-token",
        },
      });

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBeUndefined();
    });

    test("should handle empty config file", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("");
      parseSpy.mockReturnValue(null);

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBeUndefined();
    });

    test("should handle config file without token keywords", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("other: value");

      const result = await getCachedAccessToken("https://example.com");

      expect(result).toBeUndefined();
    });
  });

  // GETPAGESKITMOUNTPOINT TESTS
  describe("getPagesKitMountPoint", () => {
    test("should successfully get mount point", async () => {
      getComponentMountPointSpy.mockResolvedValue("/p");

      const result = await getPagesKitMountPoint("https://example.com");

      expect(result).toBe("/p");
      expect(getComponentMountPointSpy).toHaveBeenCalledWith(
        "https://example.com",
        expect.any(String),
      );
    });

    test("should handle different URL formats", async () => {
      getComponentMountPointSpy.mockResolvedValue("/p");

      const urls = [
        "https://example.com",
        "http://example.com",
        "https://example.com:8080",
        "https://sub.example.com",
      ];

      for (const url of urls) {
        const result = await getPagesKitMountPoint(url);
        expect(result).toBe("/p");
        expect(getComponentMountPointSpy).toHaveBeenCalledWith(url, expect.any(String));
      }
    });

    test("should handle localhost URLs", async () => {
      getComponentMountPointSpy.mockResolvedValue("/p");

      const result = await getPagesKitMountPoint("http://localhost:3000");

      expect(result).toBe("/p");
      expect(getComponentMountPointSpy).toHaveBeenCalledWith(
        "http://localhost:3000",
        expect.any(String),
      );
    });

    test("should handle InvalidBlockletError with correct error message", async () => {
      const { InvalidBlockletError } = await import("../../utils/blocklet.mjs");
      getComponentMountPointSpy.mockRejectedValue(new InvalidBlockletError("Invalid blocklet"));

      await expect(getPagesKitMountPoint("https://example.com")).rejects.toThrow(
        "⚠️  The provided URL is not a valid website on ArcBlock platform",
      );

      // Verify detailed error message content
      getComponentMountPointSpy.mockRejectedValueOnce(new InvalidBlockletError("Invalid blocklet"));
      try {
        await getPagesKitMountPoint("https://example.com");
      } catch (error) {
        expect(error.message).toContain("⚠️  The provided URL is not a valid website on ArcBlock platform");
        expect(error.message).toContain("💡 Solution:");
        expect(error.message).toContain("Start here to set up your own website to host pages:");
        expect(error.message).toContain("https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o");
      }
    });

    test("should handle ComponentNotFoundError with correct error message", async () => {
      const { ComponentNotFoundError } = await import("../../utils/blocklet.mjs");
      getComponentMountPointSpy.mockRejectedValue(new ComponentNotFoundError("Not found"));

      await expect(getPagesKitMountPoint("https://example.com")).rejects.toThrow(
        "⚠️  This website does not have required components for publishing",
      );

      // Verify detailed error message content
      getComponentMountPointSpy.mockRejectedValueOnce(new ComponentNotFoundError("Not found"));
      try {
        await getPagesKitMountPoint("https://example.com");
      } catch (error) {
        expect(error.message).toContain("⚠️  This website does not have required components for publishing");
        expect(error.message).toContain("💡 Solution:");
        expect(error.message).toContain("Please refer to the documentation to add page publishing components:");
        expect(error.message).toContain("https://www.arcblock.io/docs/blocklet-developer/en/7zbw0GQXgcD6sCcjVfwqqT2s");
      }
    });

    test("should handle network errors with correct error message", async () => {
      getComponentMountPointSpy.mockRejectedValue(new Error("Network error"));

      await expect(getPagesKitMountPoint("https://example.com")).rejects.toThrow(
        "❌ Unable to connect to:",
      );

      // Verify detailed error message content
      getComponentMountPointSpy.mockRejectedValueOnce(new Error("Network error"));
      try {
        await getPagesKitMountPoint("https://example.com");
      } catch (error) {
        expect(error.message).toContain("❌ Unable to connect to:");
        expect(error.message).toContain("https://example.com");
        expect(error.message).toContain("Possible causes:");
        expect(error.message).toContain("Network connection issues");
        expect(error.message).toContain("Server temporarily unavailable");
        expect(error.message).toContain("Incorrect URL address");
        expect(error.message).toContain("Suggestion:");
        expect(error.message).toContain("Please check your network connection and URL address, then try again");
      }
    });

    test("should handle different error types", async () => {
      const { InvalidBlockletError } = await import("../../utils/blocklet.mjs");
      const { ComponentNotFoundError } = await import("../../utils/blocklet.mjs");

      // Test InvalidBlockletError
      getComponentMountPointSpy.mockRejectedValueOnce(new InvalidBlockletError("Invalid"));
      await expect(getPagesKitMountPoint("https://invalid.com")).rejects.toThrow(
        "⚠️  The provided URL is not a valid website on ArcBlock platform",
      );

      // Test ComponentNotFoundError
      getComponentMountPointSpy.mockRejectedValueOnce(new ComponentNotFoundError("Not found"));
      await expect(getPagesKitMountPoint("https://missing-component.com")).rejects.toThrow(
        "⚠️  This website does not have required components for publishing",
      );

      // Test generic network error
      getComponentMountPointSpy.mockRejectedValueOnce(new Error("Connection timeout"));
      await expect(getPagesKitMountPoint("https://timeout.com")).rejects.toThrow(
        "❌ Unable to connect to:",
      );
    });

    test("should preserve error message formatting", async () => {
      const { InvalidBlockletError } = await import("../../utils/blocklet.mjs");
      getComponentMountPointSpy.mockRejectedValue(new InvalidBlockletError("Invalid blocklet"));

      try {
        await getPagesKitMountPoint("https://example.com");
      } catch (error) {
        // Verify error message has proper structure with newlines
        expect(error.message).toContain("\n\n");
        expect(error.message.split("\n\n").length).toBeGreaterThan(1);
      }
    });
  });

  // GETACCESSTOKEN TESTS
  describe("getAccessToken", () => {
    test("should return access token from environment variable", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "env-token";

      const result = await getAccessToken("https://example.com");

      expect(result).toBe("env-token");
    });

    test("should handle different URL formats", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "test-token";

      const urls = [
        "https://example.com",
        "http://example.com",
        "https://example.com:8080",
        "https://sub.example.com/path",
      ];

      for (const url of urls) {
        const result = await getAccessToken(url);
        expect(result).toBe("test-token");
      }
    });

    test("should handle invalid URL", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "test-token";

      await expect(getAccessToken("invalid-url")).rejects.toThrow();
    });

    test("should work with localhost URLs", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "local-token";

      const result = await getAccessToken("http://localhost:3000");

      expect(result).toBe("local-token");
    });

    test("should read access token from config file", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue("WEB_SMITH_PUBLISH_ACCESS_TOKEN: config-token");
      parseSpy.mockReturnValue({
        "example.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "config-token",
        },
      });

      const result = await getAccessToken("https://example.com");

      expect(result).toBe("config-token");
    });

  test("should successfully complete authorization flow", async () => {
    // Mock getComponentMountPoint for the short URL generation in openPage
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");

    const result = await getAccessToken("https://example.com");

    expect(result).toBe("new-access-token");

    expect(mockCreateConnect).toHaveBeenCalledWith(
      expect.objectContaining({
        connectAction: "gen-simple-access-key",
        source: "AIGNE WebSmith connect to website",
        closeOnSuccess: true,
        appName: "AIGNE WebSmith",
        openPage: expect.any(Function),
      }),
    );

    // Verify environment variable is set
    expect(process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN).toBe("new-access-token");

    // Verify config file is saved
    expect(writeFileSpy).toHaveBeenCalledWith(
      "/mock/home/.aigne/web-smith-connected.yaml",
      "mock yaml",
    );
    expect(stringifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "example.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "new-access-token",
        },
      }),
    );
  });

  test("should create .aigne directory if it doesn't exist", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    existsSyncSpy.mockReturnValueOnce(false); // .aigne directory doesn't exist

    const result = await getAccessToken("https://example.com");

    expect(result).toBe("new-access-token");
    expect(mkdirSyncSpy).toHaveBeenCalledWith("/mock/home/.aigne", { recursive: true });
  });

  test("should call openPage function with correct URL and locale", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");

    let capturedOpenPage;
    mockCreateConnect.mockImplementation((options) => {
      capturedOpenPage = options.openPage;
      return Promise.resolve({ accessKeySecret: "new-access-token" });
    });

    const result = await getAccessToken("https://example.com", "", "zh");

    expect(result).toBe("new-access-token");
    expect(typeof capturedOpenPage).toBe("function");

    // Test that openPage calls the mock open function
    await capturedOpenPage("https://auth.example.com");
    expect(mockOpen).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  test("should handle createConnect errors", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    mockCreateConnect.mockRejectedValue(new Error("Network error"));

    await expect(getAccessToken("https://example.com")).rejects.toThrow(
      "⚠️ Failed to obtain access token. This may be due to network issues or authorization timeout.",
    );
  });

  test("should handle ltToken parameter", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");

    let capturedOpenPage;
    mockCreateConnect.mockImplementation((options) => {
      capturedOpenPage = options.openPage;
      return Promise.resolve({ accessKeySecret: "new-access-token" });
    });

    await getAccessToken("https://example.com", "lt-token-123");

    expect(typeof capturedOpenPage).toBe("function");
    await capturedOpenPage("https://auth.example.com");
    expect(mockOpen).toHaveBeenCalled();
  });

  // GETOFFICIALACCESSTOKEN TESTS
  describe("getOfficialAccessToken", () => {
    test("should throw error for missing baseUrl parameter", async () => {
      await expect(getOfficialAccessToken()).rejects.toThrow(
        "baseUrl parameter is required for getOfficialAccessToken.",
      );
      await expect(getOfficialAccessToken("")).rejects.toThrow(
        "baseUrl parameter is required for getOfficialAccessToken.",
      );
    });

    test("should return access token from environment variable", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "env-official-token";

      const result = await getOfficialAccessToken("https://example.com");

      expect(result).toBe("env-official-token");
    });

    test("should handle different URL formats", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "test-official-token";

      const urls = [
        "https://example.com",
        "http://example.com",
        "https://example.com:8080",
        "https://sub.example.com/path",
      ];

      for (const url of urls) {
        const result = await getOfficialAccessToken(url);
        expect(result).toBe("test-official-token");
      }
    });

    test("should handle invalid URL", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "test-official-token";

      await expect(getOfficialAccessToken("invalid-url")).rejects.toThrow();
    });

    test("should work with localhost URLs", async () => {
      process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = "local-official-token";

      const result = await getOfficialAccessToken("http://localhost:3000");

      expect(result).toBe("local-official-token");
    });

    test("should read access token from config file", async () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockResolvedValue(`WEB_SMITH_PUBLISH_ACCESS_TOKEN: config-official-token`);
      parseSpy.mockReturnValue({
        "example.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "config-official-token",
        },
      });

      const result = await getOfficialAccessToken("https://example.com");

      expect(result).toBe("config-official-token");
    });

    test("should return undefined when openPage is false and no token found", async () => {
      const result = await getOfficialAccessToken("https://example.com", false);

      expect(result).toBeUndefined();
      expect(mockCreateConnect).not.toHaveBeenCalled();
    });

  test("should successfully complete authorization flow", async () => {
    // Mock getComponentMountPoint for the short URL generation in openPage
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");

    const result = await getOfficialAccessToken("https://example.com");

    expect(result).toBe("new-access-token");

    // Verify the authorization flow
    expect(mockCreateConnect).toHaveBeenCalledWith(
      expect.objectContaining({
        connectAction: "gen-simple-access-key",
        source: "AIGNE WebSmith connect to official service",
        closeOnSuccess: true,
        appName: "AIGNE WebSmith",
        openPage: expect.any(Function),
      }),
    );

    // Verify config file is saved
    expect(writeFileSpy).toHaveBeenCalledWith(
      "/mock/home/.aigne/web-smith-connected.yaml",
      "mock yaml",
    );
    expect(stringifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "example.com": {
          WEB_SMITH_PUBLISH_ACCESS_TOKEN: "new-access-token",
        },
      }),
    );
  });

  test("should create .aigne directory if it doesn't exist", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    existsSyncSpy.mockReturnValueOnce(false); // .aigne directory doesn't exist

    const result = await getOfficialAccessToken("https://example.com");

    expect(result).toBe("new-access-token");
    expect(mkdirSyncSpy).toHaveBeenCalledWith("/mock/home/.aigne", { recursive: true });
  });

  test("should call openPage function with correct behavior and locale", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    let capturedOpenPage;
    mockCreateConnect.mockImplementation((options) => {
      capturedOpenPage = options.openPage;
      return Promise.resolve({ accessKeySecret: "new-access-token" });
    });

    const result = await getOfficialAccessToken("https://example.com", true, "zh");

    expect(result).toBe("new-access-token");
    expect(typeof capturedOpenPage).toBe("function");

    // Test that openPage calls the mock open function and logs
    await capturedOpenPage("https://auth.example.com");
    expect(mockOpen).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "🔗 Please open the following URL in your browser to authorize access: ",
      expect.any(String),
      "\n",
    );
  });

  test("should handle authorization failure", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    mockCreateConnect.mockRejectedValue(new Error("Authorization failed"));

    await expect(getOfficialAccessToken("https://example.com")).rejects.toThrow(
      "⚠️ Failed to obtain official access token. This may be due to network issues or authorization timeout.",
    );
  });

  test("should handle config file save errors gracefully", async () => {
    getComponentMountPointSpy.mockResolvedValue("/payment-mount");
    writeFileSpy.mockRejectedValue(new Error("Write error"));

    const result = await getOfficialAccessToken("https://example.com");

    expect(result).toBe("new-access-token");
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Could not save the token to the configuration file:"),
      expect.any(Error),
      );
    });
  });
});

});

