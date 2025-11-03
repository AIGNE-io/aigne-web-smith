import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import publishWebsite from "../../../agents/publish/publish-website.mjs";

// Import internal utils for spying
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

mock.module("@blocklet/payment-broker-client/node", () => ({
  BrokerClient: mock(() => mockBrokerClient),
}));

// Mock fs-extra with minimal necessary methods
const mockFsExtra = {
  existsSync: mock(() => true),
  rm: mock(() => Promise.resolve()),
  mkdir: mock(() => Promise.resolve()),
  cp: mock(() => Promise.resolve()),
  readdir: mock(() => Promise.resolve(["page1.yaml"])),
  readFile: mock(() => Promise.resolve("title: Test Page")),
  writeFileSync: mock(() => {}),
};

mock.module("fs-extra", () => ({
  default: mockFsExtra,
}));

describe("publish-website", () => {
  let mockOptions;
  let originalEnv;

  // Spies for internal utils
  let getAccessTokenSpy;
  let getOfficialAccessTokenSpy;
  let loadConfigFromFileSpy;
  let saveValueToConfigSpy;
  let deploySpy;
  let getComponentMountPointSpy;
  let batchUploadMediaFilesSpy;
  let uploadFilesSpy;
  let fetchSpy;

  beforeEach(() => {
    originalEnv = { ...process.env };

    // Reset fs-extra mocks
    mockFsExtra.existsSync.mockReturnValue(true);
    mockFsExtra.readdir.mockResolvedValue(["page1.yaml"]);
    mockFsExtra.readFile.mockResolvedValue("title: Test Page");
    mockBrokerClient.checkCacheSession.mockResolvedValue({ sessionId: null, paymentLink: null });
    mockBrokerClient.getSessionDetail.mockResolvedValue({ vendors: [] });

    // Set up spies for internal utils
    getAccessTokenSpy = spyOn(authUtils, "getAccessToken").mockResolvedValue("mock-token");
    getOfficialAccessTokenSpy = spyOn(authUtils, "getOfficialAccessToken").mockResolvedValue(
      "official-mock-token",
    );
    loadConfigFromFileSpy = spyOn(utils, "loadConfigFromFile").mockResolvedValue({});
    saveValueToConfigSpy = spyOn(utils, "saveValueToConfig").mockResolvedValue();
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
          text: () => Promise.resolve(JSON.stringify({ 
            success: true, 
            pages: [{ sourceFile: "page1.yaml", success: true, data: { url: "https://example.com/page1", route: { path: "/page1" } } }] 
          })),
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
  });

  afterEach(() => {
    process.env = originalEnv;
    getAccessTokenSpy?.mockRestore();
    getOfficialAccessTokenSpy?.mockRestore();
    loadConfigFromFileSpy?.mockRestore();
    saveValueToConfigSpy?.mockRestore();
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
      },
      mockOptions,
    );

    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://pages-kit.example.com", "", expect.any(Boolean));
    expect(result.message).toBeDefined();
    expect(result.message).toContain("Pages published successfully");
  });

  // ENVIRONMENT VARIABLE TESTS
  test("should use environment variable PAGES_KIT_URL when set", async () => {
    process.env.PAGES_KIT_URL = "https://env-pages.example.com";
    loadConfigFromFileSpy.mockResolvedValue({ appUrl: "https://config.example.com" });

    await publishWebsite(
      {
        outputDir: "./pages",
        projectId: "project-123",
      },
      mockOptions,
    );

    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://env-pages.example.com", "", expect.any(Boolean));
  });

  test("should use production URL when PAGES_KIT_URL && appUrl are not set", async () => {
    loadConfigFromFileSpy.mockResolvedValue({ });

    await publishWebsite({}, mockOptions);

    expect(getOfficialAccessTokenSpy).toHaveBeenCalledWith("https://websmith.aigne.io", false);
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

    await publishWebsite(
      {
        outputDir: "./pages",
      },
      mockOptions,
    );

    expect(mockOptions.prompts.input).toHaveBeenCalledWith({
      message: "Please enter your website URL:",
      validate: expect.any(Function),
    });
    expect(getAccessTokenSpy).toHaveBeenCalledWith("https://custom.example.com", "", expect.any(Boolean));
  });

  test("should validate URL input and accept valid URLs", async () => {
    loadConfigFromFileSpy.mockResolvedValue({});
    mockOptions.prompts.select.mockResolvedValue("custom");
    mockOptions.prompts.input.mockResolvedValue("https://valid.example.com");

    await publishWebsite(
      {
        outputDir: "./pages",
      },
      mockOptions,
    );

    const validateFn = mockOptions.prompts.input.mock.calls[0][0].validate;

    expect(validateFn("https://valid.com")).toBe(true);
    expect(validateFn("valid.com")).toBe(true);
    expect(validateFn("")).toBe("Please enter a valid URL");
  });

  // CONFIG SAVING TESTS
  test("should save appUrl when using environment variable (useEnvAppUrl only checks parameter)", async () => {
    process.env.PAGES_KIT_URL = "https://env.example.com";
    loadConfigFromFileSpy.mockResolvedValue({});

    await publishWebsite(
      {
        outputDir: "./pages",
      },
      mockOptions,
    );

    // Note: useEnvAppUrl only checks if appUrl was provided as parameter, not if env var is used
    // So appUrl will be saved even when using environment variable if not provided as parameter
    expect(saveValueToConfigSpy).toHaveBeenCalledWith("appUrl", "https://env.example.com");
  });

  test("should save appUrl when publish was successful and appUrl not provided as parameter", async () => {
    loadConfigFromFileSpy.mockResolvedValue({ appUrl: "https://config.example.com" });

    await publishWebsite(
      {
        outputDir: "./pages",
      },
      mockOptions,
    );

    expect(saveValueToConfigSpy).toHaveBeenCalledWith("appUrl", "https://config.example.com");
  });

  // ERROR HANDLING TESTS
  test("should handle missing outputDir", async () => {
    mockFsExtra.existsSync.mockReturnValue(false);

    const result = await publishWebsite(
      {
        outputDir: "./nonexistent",
        appUrl: "https://example.com",
      },
      mockOptions,
    );

    expect(result.message).toContain("pages does not generated");
  });

  test("should handle publish failure", async () => {
    fetchSpy.mockImplementation(() => Promise.resolve({
      ok: false,
      text: () => Promise.resolve(JSON.stringify({ error: "Publish failed" })),
    }));

    const result = await publishWebsite(
      {
        outputDir: "./pages",
        appUrl: "https://example.com",
      },
      mockOptions,
    );

    expect(result.message).toBeDefined();
    expect(result.message).toContain("Failed to publish pages");
  });

  // RESUME PREVIOUS WEBSITE SETUP TESTS
  test("should show resume option when checkoutId exists in config", async () => {
    loadConfigFromFileSpy.mockResolvedValue({
      checkoutId: "cached-checkout-123",
    });
    mockBrokerClient.checkCacheSession.mockResolvedValue({
      sessionId: "cached-checkout-123",
      paymentLink: "https://payment.example.com",
    });
    mockOptions.prompts.select.mockResolvedValue("default");

    await publishWebsite(
      {
        outputDir: "./pages",
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
  });

  test("should handle resume previous website setup selection", async () => {
    deploySpy.mockResolvedValue({
      appUrl: "https://resumed.example.com",
      token: "resume-token",
    });

    loadConfigFromFileSpy.mockResolvedValue({
      checkoutId: "cached-checkout-123",
      paymentUrl: "https://payment.example.com",
    });
    mockBrokerClient.checkCacheSession.mockResolvedValue({
      sessionId: "cached-checkout-123",
      paymentLink: "https://payment.example.com",
    });
    mockBrokerClient.getSessionDetail.mockResolvedValue({
      vendors: [{ vendorType: "launcher", token: "vendor-token" }],
    });
    mockOptions.prompts.select.mockResolvedValue("new-pages-kit-continue");

    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await publishWebsite(
      {
        outputDir: "./pages",
      },
      mockOptions,
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Resuming your previous website setup"));
    expect(deploySpy).toHaveBeenCalledWith("cached-checkout-123", "https://payment.example.com");

    consoleSpy.mockRestore();
  });
});
