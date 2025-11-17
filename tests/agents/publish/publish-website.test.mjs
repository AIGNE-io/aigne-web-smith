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
import publishWebsite from "../../../agents/publish/publish-website.mjs";

// Import internal utils for selective spying
import * as authUtils from "../../../utils/auth-utils.mjs";
import * as blockletUtils from "../../../utils/blocklet.mjs";
import * as deployUtils from "../../../utils/deploy.mjs";
import * as uploadFilesUtils from "../../../utils/upload-files.mjs";
import * as utils from "../../../utils/utils.mjs";

// Mock only essential external dependencies
const mockBrokerClient = {
  checkCacheSession: mock(() => Promise.resolve({ sessionId: null, paymentLink: null })),
  getSessionDetail: mock(() => Promise.resolve({ vendors: [] })),
};

const mockBrokerClientConstructor = mock(() => mockBrokerClient);

const mockChalk = {
  bold: mock((text) => text),
  cyan: mock((text) => text),
  blue: mock((text) => text),
  green: mock((text) => text),
  yellow: mock((text) => text),
};

const mockFsExtra = {
  existsSync: mock(() => true),
  rm: mock(() => Promise.resolve()),
  mkdir: mock(() => Promise.resolve()),
  cp: mock(() => Promise.resolve()),
  readdir: mock(() => Promise.resolve(["page1.yaml"])),
  readFile: mock(() => Promise.resolve("title: Test Page")),
  writeFileSync: mock(() => {}),
  writeFile: mock(() => Promise.resolve()),
  copy: mock(() => Promise.resolve()),
};

const mockPath = {
  basename: mock(() => "test-project"),
  join: mock((...paths) => paths.join("/")),
};

beforeAll(() => {
  // Apply mocks for external dependencies only
  mock.module("@blocklet/payment-broker-client/node", () => ({
    BrokerClient: mockBrokerClientConstructor,
  }));
  mock.module("chalk", () => ({ default: mockChalk }));
  mock.module("fs-extra", () => ({ default: mockFsExtra }));
  mock.module("node:path", () => mockPath);
});

afterAll(() => {
  // Restore all mocks when this test file is complete
  mock.restore();
});

describe("publish-website", () => {
  let mockOptions;
  let originalEnv;

  // Spies for internal utils
  let getAccessTokenSpy;
  let getOfficialAccessTokenSpy;
  let getCachedAccessTokenSpy;
  let getPagesKitMountPointSpy;
  let loadConfigFromFileSpy;
  let saveValueToConfigSpy;
  let deploySpy;
  let getComponentMountPointSpy;
  let getGithubRepoUrlSpy;
  let batchUploadMediaFilesSpy;
  let uploadFilesSpy;
  let fetchSpy;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Reset external mocks and clear call history
    mockFsExtra.existsSync.mockClear();
    mockFsExtra.existsSync.mockReturnValue(true);
    mockFsExtra.rm.mockClear();
    mockFsExtra.rm.mockImplementation(() => Promise.resolve());
    mockFsExtra.mkdir.mockClear();
    mockFsExtra.mkdir.mockImplementation(() => Promise.resolve());
    mockFsExtra.cp.mockClear();
    mockFsExtra.cp.mockImplementation(() => Promise.resolve());
    mockFsExtra.readdir.mockClear();
    mockFsExtra.readdir.mockResolvedValue(["page1.yaml"]);
    mockFsExtra.readFile.mockClear();
    mockFsExtra.readFile.mockResolvedValue("title: Test Page");
    mockPath.basename.mockClear();
    mockPath.basename.mockImplementation(() => "test-project");
    mockPath.join.mockClear();
    mockPath.join.mockImplementation((...paths) => paths.join("/"));
    mockChalk.bold.mockClear();
    mockChalk.bold.mockImplementation((text) => text);
    mockChalk.cyan.mockClear();
    mockChalk.cyan.mockImplementation((text) => text);

    // Reset BrokerClient mock
    mockBrokerClientConstructor.mockClear();
    mockBrokerClientConstructor.mockImplementation(() => mockBrokerClient);
    mockBrokerClient.checkCacheSession.mockClear();
    mockBrokerClient.checkCacheSession.mockImplementation(() =>
      Promise.resolve({ sessionId: null, paymentLink: null }),
    );
    mockBrokerClient.getSessionDetail.mockClear();
    mockBrokerClient.getSessionDetail.mockImplementation(() => Promise.resolve({ vendors: [] }));

    // Set up spies for internal utils
    getAccessTokenSpy = spyOn(authUtils, "getAccessToken").mockResolvedValue("mock-token");
    getOfficialAccessTokenSpy = spyOn(authUtils, "getOfficialAccessToken").mockResolvedValue(
      "official-mock-token",
    );
    getCachedAccessTokenSpy = spyOn(authUtils, "getCachedAccessToken").mockResolvedValue(null);
    getPagesKitMountPointSpy = spyOn(authUtils, "getPagesKitMountPoint").mockResolvedValue("/p");
    loadConfigFromFileSpy = spyOn(utils, "loadConfigFromFile").mockResolvedValue({});
    saveValueToConfigSpy = spyOn(utils, "saveValueToConfig").mockResolvedValue();
    getGithubRepoUrlSpy = spyOn(utils, "getGithubRepoUrl").mockReturnValue(
      "https://github.com/user/repo",
    );
    deploySpy = spyOn(deployUtils, "deploy").mockResolvedValue({
      appUrl: "https://deployed.example.com",
      token: "deploy-token",
    });
    getComponentMountPointSpy = spyOn(blockletUtils, "getComponentMountPoint").mockResolvedValue(
      "/mount",
    );
    batchUploadMediaFilesSpy = spyOn(uploadFilesUtils, "batchUploadMediaFiles").mockResolvedValue(
      {},
    );
    uploadFilesSpy = spyOn(uploadFilesUtils, "uploadFiles").mockResolvedValue({
      results: [{ url: "https://uploaded.example.com/file.png" }],
    });

    // Mock global fetch
    fetchSpy = spyOn(global, "fetch").mockImplementation((url) => {
      const urlStr = url.toString();
      if (urlStr.includes("/api/sdk/upload-data")) {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(
              JSON.stringify({
                success: true,
                pages: [
                  {
                    sourceFile: "page1.yaml",
                    success: true,
                    data: { url: "https://example.com/page1", route: { path: "/page1" } },
                  },
                ],
              }),
            ),
        });
      }
      if (urlStr.includes("/api/sdk/project/validate")) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ projectId: "project-123" })),
        });
      }
      const mockHeaders = new Headers();
      mockHeaders.set("content-type", "image/png");
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
        blob: () => Promise.resolve(new Blob([], { type: "image/png" })),
        headers: mockHeaders,
      });
    });

    mockOptions = {
      prompts: {
        select: mock(async () => "default"),
        input: mock(async () => "https://example.com"),
        confirm: mock(async () => true),
      },
    };

    // Clear environment variables
    delete process.env.PAGES_KIT_URL;
    delete process.env.PAGES_ROOT_DIR;
    delete process.env.WEB_SMITH_PUBLISH_URL;
    delete process.env.WEB_SMITH_BASE_URL;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;

    // Restore all spies
    getAccessTokenSpy?.mockRestore();
    getOfficialAccessTokenSpy?.mockRestore();
    getCachedAccessTokenSpy?.mockRestore();
    getPagesKitMountPointSpy?.mockRestore();
    loadConfigFromFileSpy?.mockRestore();
    saveValueToConfigSpy?.mockRestore();
    getGithubRepoUrlSpy?.mockRestore();
    deploySpy?.mockRestore();
    getComponentMountPointSpy?.mockRestore();
    batchUploadMediaFilesSpy?.mockRestore();
    uploadFilesSpy?.mockRestore();
    fetchSpy?.mockRestore();
  });

  // BASIC FUNCTIONALITY TESTS
  test("should publish website successfully with default settings", async () => {
    loadConfigFromFileSpy.mockResolvedValue({ appUrl: "https://pages-kit.example.com" });

    const result = await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://pages-kit.example.com",
        projectId: "project-123",
        projectName: "Test Project",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockFsExtra.cp).toHaveBeenCalled();
    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://pages-kit.example.com", "", undefined);
    expect(result.message).toBeDefined();
    expect(result.message).toContain("Successfully published to");
  });

  // ENVIRONMENT VARIABLE TESTS
  test("should use environment variable PAGES_KIT_URL when set", async () => {
    process.env.PAGES_KIT_URL = "https://env-pages.example.com";
    loadConfigFromFileSpy.mockResolvedValue({ appUrl: "https://config.example.com" });

    await publishWebsite(
      {
        outputDir: "./pages",
        projectId: "project-123",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://env-pages.example.com", "", undefined);
    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://env-pages.example.com", "", undefined);
  });

  test("should use production URL when PAGES_KIT_URL && appUrl are not set", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(getCachedAccessTokenSpy).toHaveBeenCalledWith("https://websmith.aigne.io");
  });

  // USER INTERACTION TESTS
  test("should skip platform selection prompt when appUrl is provided", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("default");

    await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://pages-kit.example.com",
      },
      mockOptions,
    );

    expect(mockOptions.prompts.select).not.toHaveBeenCalled();
  });

  test("should handle custom platform selection", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("custom");
    mockOptions.prompts.input.mockResolvedValue("https://custom.example.com");

    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockOptions.prompts.input).toHaveBeenCalledWith({
      message: "Please enter your website URL:",
      validate: expect.any(Function),
    });
    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://custom.example.com", "", undefined);
    consoleSpy.mockRestore();
  });

  test("should validate URL input and accept valid URLs", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("custom");
    mockOptions.prompts.input.mockResolvedValue("https://valid.example.com");

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    const validateFn = mockOptions.prompts.input.mock.calls[0][0].validate;

    expect(validateFn("https://valid.com")).toBe(true);
    expect(validateFn("valid.com")).toBe(true); // Should work without protocol
    expect(validateFn("")).toBe("Please enter a valid URL");
  });

  test("should save appUrl when publish was successful and appUrl not provided as parameter", async () => {
    loadConfigFromFileSpy.mockResolvedValue({ appUrl: "https://config.example.com" });

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(saveValueToConfigSpy).toHaveBeenCalledWith("appUrl", "https://config.example.com");
  });

  test("should not save appUrl when appUrl is provided as parameter", async () => {
    await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://param.example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    // Should not save when appUrl is provided as parameter
    expect(saveValueToConfigSpy).not.toHaveBeenCalledWith("appUrl", expect.anything());
  });

  // ERROR HANDLING TESTS
  test("should handle missing outputDir", async () => {
    mockFsExtra.existsSync.mockReturnValue(false);

    const result = await publishWebsite(
      {
        outputDir: "./nonexistent",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(result.message).toContain("pages does not generated");
  });

  test("should handle publish failure", async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ error: "Publish failed" })),
      }),
    );

    const result = await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(result.message).toBeDefined();
    expect(result.message).toContain("Failed to publish pages");
  });

  // GETPAGESKITMOUNTPOINT ERROR HANDLING TESTS
  describe("getPagesKitMountPoint error handling", () => {
    test("should handle InvalidBlockletError with appropriate error message", async () => {
      loadConfigFromFileSpy.mockResolvedValue({});
      // getPagesKitMountPoint will catch InvalidBlockletError and throw a formatted error
      const formattedError = new Error(
        `⚠️  The provided URL is not a valid website on ArcBlock platform\n\n` +
          `💡 Solution: Start here to set up your own website to host pages:\nhttps://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o\n\n`,
      );
      getPagesKitMountPointSpy.mockRejectedValue(formattedError);

      const result = await publishWebsite(
        {
          outputDir: "./pages",
          appUrl: "https://invalid.example.com",
          websiteStructure: [],
        },
        mockOptions,
      );

      expect(result.message).toContain(
        "❌ Sorry, I encountered an error while publishing your pages: \n\n⚠️  The provided URL is not a valid website on ArcBlock platform\n\n💡 Solution: Start here to set up your own website to host pages:\nhttps://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o\n\n",
      );
    });

    test("should handle ComponentNotFoundError with appropriate error message", async () => {
      loadConfigFromFileSpy.mockResolvedValue({});
      // getPagesKitMountPoint will catch ComponentNotFoundError and throw a formatted error
      const formattedError = new Error(
        `⚠️  This website does not have required components for publishing\n\n` +
          `💡 Solution: Please refer to the documentation to add page publishing components:\nhttps://www.arcblock.io/docs/blocklet-developer/en/7zbw0GQXgcD6sCcjVfwqqT2s\n\n`,
      );
      getPagesKitMountPointSpy.mockRejectedValue(formattedError);

      const result = await publishWebsite(
        {
          outputDir: "./pages",
          appUrl: "https://missing-component.example.com",
          websiteStructure: [],
        },
        mockOptions,
      );
      expect(result.message).toContain(
        "❌ Sorry, I encountered an error while publishing your pages: \n\n⚠️  This website does not have required components for publishing\n\n💡 Solution: Please refer to the documentation to add page publishing components:\nhttps://www.arcblock.io/docs/blocklet-developer/en/7zbw0GQXgcD6sCcjVfwqqT2s\n\n",
      );
    });

    test("should handle network errors with appropriate error message", async () => {
      loadConfigFromFileSpy.mockResolvedValue({});
      // getPagesKitMountPoint will catch network errors and throw a formatted error
      const formattedError = new Error(
        `❌ Unable to connect to: https://network-error.example.com\n\n` +
          `Possible causes:\n` +
          `• Network connection issues\n` +
          `• Server temporarily unavailable\n` +
          `• Incorrect URL address\n\n` +
          `Suggestion: Please check your network connection and URL address, then try again`,
      );
      getPagesKitMountPointSpy.mockRejectedValue(formattedError);

      const result = await publishWebsite(
        {
          outputDir: "./pages",
          appUrl: "https://network-error.example.com",
          websiteStructure: [],
        },
        mockOptions,
      );

      expect(result.message).toContain(
        "❌ Sorry, I encountered an error while publishing your pages: \n\n❌ Unable to connect to: https://network-error.example.com\n\nPossible causes:\n• Network connection issues\n• Server temporarily unavailable\n• Incorrect URL address\n\nSuggestion: Please check your network connection and URL address, then try again",
      );
    });

    test("should clean up temporary directory when getPagesKitMountPoint fails", async () => {
      loadConfigFromFileSpy.mockResolvedValue({});
      getPagesKitMountPointSpy.mockRejectedValue(new Error("Connection failed"));

      await publishWebsite(
        {
          outputDir: "./pages",
          appUrl: "https://error.example.com",
          websiteStructure: [],
        },
        mockOptions,
      );

      // Should still clean up even on error
      expect(mockFsExtra.rm).toHaveBeenCalledWith(
        expect.stringContaining(".aigne/web-smith/.tmp/pages"),
        expect.objectContaining({
          recursive: true,
          force: true,
        }),
      );
    });
  });

  // RESUME PREVIOUS WEBSITE SETUP TESTS
  test("should show resume option when checkoutId exists in config", async () => {
    loadConfigFromFileSpy.mockResolvedValue({
      checkoutId: "cached-checkout-123",
    });
    getCachedAccessTokenSpy.mockResolvedValue("cached-access-token");
    mockBrokerClient.checkCacheSession.mockResolvedValue({
      sessionId: "cached-checkout-123",
      paymentLink: "https://payment.example.com",
    });
    mockOptions.prompts.select.mockResolvedValue("default");

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockOptions.prompts.select).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Select platform to publish your pages:",
        choices: expect.arrayContaining([
          expect.objectContaining({
            name: expect.stringContaining("Resume previous website setup"),
            value: "new-pages-kit-continue",
          }),
        ]),
      }),
    );

    // Verify the exact text content
    const selectCall = mockOptions.prompts.select.mock.calls[0][0];
    const resumeChoice = selectCall.choices.find(
      (choice) => choice.value === "new-pages-kit-continue",
    );
    expect(resumeChoice).toBeDefined();
    expect(resumeChoice.name).toContain("Resume previous website setup");
  });

  test("should not show resume option when no checkoutId in config", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("default");

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockOptions.prompts.select).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Select platform to publish your pages:",
        choices: expect.not.arrayContaining([
          expect.objectContaining({
            value: "new-pages-kit-continue",
          }),
        ]),
      }),
    );
  });

  test("should handle resume previous website setup selection", async () => {
    deploySpy.mockResolvedValue({
      appUrl: "https://resumed.example.com",
      token: "resume-token",
    });

    loadConfigFromFileSpy.mockResolvedValue({
      checkoutId: "cached-checkout-123",
      shouldSyncAll: true,
      navigationType: "menu",
    });
    getCachedAccessTokenSpy.mockResolvedValue("cached-access-token");
    mockBrokerClient.checkCacheSession.mockResolvedValue({
      sessionId: "cached-checkout-123",
    });
    mockOptions.prompts.select.mockResolvedValue("new-pages-kit-continue");

    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Resuming your previous website setup"),
    );
    expect(deploySpy).toHaveBeenCalledWith("cached-checkout-123", undefined);

    consoleSpy.mockRestore();
  });

  test("should add https protocol when not provided in URL", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("custom");
    mockOptions.prompts.input.mockResolvedValue("example.com");

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://example.com", "", undefined);
  });

  test("should handle URL validation edge cases", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("custom");

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    const validateFn = mockOptions.prompts.input.mock.calls[0][0].validate;

    expect(validateFn("")).toBe("Please enter a valid URL");
    expect(validateFn(" ")).toBe("Please enter a valid URL");
    expect(validateFn("http://valid.com")).toBe(true);
    expect(validateFn("https://valid.com")).toBe(true);
    expect(validateFn("valid.com")).toBe(true);
  });

  test("should clean up temporary directory on success", async () => {
    await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockFsExtra.rm).toHaveBeenCalledWith(
      expect.stringContaining(".aigne/web-smith/.tmp/pages"),
      expect.objectContaining({
        recursive: true,
        force: true,
      }),
    );
  });

  test("should clean up temporary directory on error", async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ error: "Test error" })),
      }),
    );

    await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockFsExtra.rm).toHaveBeenCalledWith(
      expect.stringContaining(".aigne/web-smith/.tmp/pages"),
      expect.objectContaining({
        recursive: true,
        force: true,
      }),
    );
  });

  test("should handle missing config file", async () => {
    loadConfigFromFileSpy.mockResolvedValue(null);

    const result = await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(result.message).toBeDefined();
    expect(result.message).toContain("Successfully published to");
  });

  test("should handle empty config", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});

    await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(getAccessTokenSpy).toHaveBeenCalled();
  });

  test("should skip platform selection when appUrl is in config", async () => {
    loadConfigFromFileSpy.mockResolvedValue({
      appUrl: "https://existing.com",
    });

    await publishWebsite(
      {
        outputDir: "./pages",
        websiteStructure: [],
      },
      mockOptions,
    );

    expect(mockOptions.prompts.select).not.toHaveBeenCalled();
  });
});
