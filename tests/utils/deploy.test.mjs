import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import * as openModule from "open";
import * as authUtilsModule from "../../utils/auth-utils.mjs";

// Import the deploy function
import { deploy } from "../../utils/deploy.mjs";
import * as utilsModule from "../../utils/utils.mjs";

const TEST_HOME_URL = "https://pagekit-test.websmith.aigne.io";
const TEST_APP_URL = "https://pagekit-app-test.websmith.aigne.io";
const TEST_DASHBOARD_URL = "https://pagekit-dashboard-test.websmith.aigne.io";
const TEST_SUBSCRIPTION_URL = "https://pagekit-subscription-test.websmith.aigne.io";

// Mock BrokerClient
const mockBrokerClient = {
  deploy: mock(),
};

const mockBrokerClientConstructor = mock(() => mockBrokerClient);

// Mock the payment broker client module
mock.module("@blocklet/payment-broker-client/node", () => ({
  BrokerClient: mockBrokerClientConstructor,
  STEPS: {
    PAYMENT_PENDING: "PAYMENT_PENDING",
    INSTALLATION_STARTING: "INSTALLATION_STARTING",
    SERVICE_STARTING: "SERVICE_STARTING",
    ACCESS_PREPARING: "ACCESS_PREPARING",
    ACCESS_READY: "ACCESS_READY",
  },
}));

describe("deploy", () => {
  let originalConsole;
  let consoleOutput;
  let getOfficialAccessTokenSpy;
  let saveValueToConfigSpy;
  let openDefaultSpy;

  beforeEach(() => {
    // Note: WEB_SMITH_BASE_URL is not set, so BASE_URL will be empty string

    // Mock console to capture output
    consoleOutput = [];
    originalConsole = {
      log: console.log,
      error: console.error,
    };
    console.log = (...args) => consoleOutput.push({ type: "log", args });
    console.error = (...args) => consoleOutput.push({ type: "error", args });

    // Mock dependencies
    getOfficialAccessTokenSpy = spyOn(authUtilsModule, "getOfficialAccessToken").mockResolvedValue(
      "mock-auth-token",
    );
    saveValueToConfigSpy = spyOn(utilsModule, "saveValueToConfig").mockResolvedValue();
    openDefaultSpy = spyOn(openModule, "default").mockResolvedValue();

    // Reset mocks
    mockBrokerClientConstructor.mockClear();
    mockBrokerClient.deploy.mockClear();
  });

  afterEach(() => {
    // Restore console
    console.log = originalConsole.log;
    console.error = originalConsole.error;

    // Restore all spies
    getOfficialAccessTokenSpy?.mockRestore();
    saveValueToConfigSpy?.mockRestore();
    openDefaultSpy?.mockRestore();

    // Clean up environment
    delete process.env.NODE_ENV;
    delete process.env.WEB_SMITH_BASE_URL;
  });

  test("successful deployment flow", async () => {
    // Mock successful deployment result
    const mockResult = {
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      dashboardUrl: TEST_DASHBOARD_URL,
      subscriptionUrl: TEST_SUBSCRIPTION_URL,
      vendors: [{ token: "pagekit-auth-token-123" }],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    const result = await deploy();

    // Verify BrokerClient was constructed with correct config
    expect(mockBrokerClientConstructor).toHaveBeenCalledWith({
      baseUrl: "https://staging.websmith.aigne.io",
      authToken: "mock-auth-token",
      paymentLinkKey: "PAYMENT_LINK_ID_OF_PAGE_KIT",
    });

    // Verify deploy was called with correct parameters
    expect(mockBrokerClient.deploy).toHaveBeenCalledWith(
      expect.objectContaining({
        cachedCheckoutId: undefined,
        cachedPaymentUrl: undefined,
        pageInfo: expect.objectContaining({
          successMessage: expect.objectContaining({
            en: expect.stringContaining(
              "Congratulations! Your website has been successfully created",
            ),
            zh: expect.stringContaining("恭喜您，你的网站已创建成功"),
          }),
        }),
        hooks: expect.objectContaining({
          PAYMENT_PENDING: expect.any(Function),
          INSTALLATION_STARTING: expect.any(Function),
          SERVICE_STARTING: expect.any(Function),
          ACCESS_PREPARING: expect.any(Function),
          ACCESS_READY: expect.any(Function),
        }),
        onError: expect.any(Function),
      }),
    );

    // Verify result transformation
    expect(result).toEqual({
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      dashboardUrl: TEST_DASHBOARD_URL,
      subscriptionUrl: TEST_SUBSCRIPTION_URL,
      token: "pagekit-auth-token-123",
    });

    // Verify console output
    const logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("🚀 Starting deployment..."))).toBe(true);
  });

  test("successful deployment with cached parameters", async () => {
    const mockResult = {
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      vendors: [{ token: "pagekit-auth-token-123" }],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    const result = await deploy("cached-checkout-id", "https://cached-payment.url");

    // Verify deploy was called with cached parameters
    expect(mockBrokerClient.deploy).toHaveBeenCalledWith(
      expect.objectContaining({
        cachedCheckoutId: "cached-checkout-id",
        cachedPaymentUrl: "https://cached-payment.url",
      }),
    );

    expect(result.appUrl).toBe(TEST_APP_URL);
    expect(result.token).toBe("pagekit-auth-token-123");
  });

  test("handles missing auth token", async () => {
    getOfficialAccessTokenSpy.mockResolvedValue(null);

    await expect(deploy()).rejects.toThrow("Failed to get official access token");

    // Verify BrokerClient was not created
    expect(mockBrokerClientConstructor).not.toHaveBeenCalled();
  });

  test("handles BrokerClient deployment failure", async () => {
    const deployError = new Error("Website deployment failed");
    mockBrokerClient.deploy.mockRejectedValue(deployError);

    await expect(deploy()).rejects.toThrow("Website deployment failed");

    // Verify BrokerClient was created and deploy was called
    expect(mockBrokerClientConstructor).toHaveBeenCalled();
    expect(mockBrokerClient.deploy).toHaveBeenCalled();
  });

  test("PAYMENT_PENDING hook functionality", async () => {
    let paymentPendingHook;

    mockBrokerClient.deploy.mockImplementation(async (config) => {
      paymentPendingHook = config.hooks.PAYMENT_PENDING;
      return {
        appUrl: TEST_APP_URL,
        vendors: [{ token: "test-token" }],
      };
    });

    await deploy();

    // Test the PAYMENT_PENDING hook
    await paymentPendingHook({
      sessionId: "session-123",
      paymentUrl: "https://payment.test/session-123",
      isResuming: false,
    });

    // Verify saveValueToConfig was called
    expect(saveValueToConfigSpy).toHaveBeenCalledWith(
      "checkoutId",
      "session-123",
      "Checkout ID for website deployment service",
    );
    expect(saveValueToConfigSpy).toHaveBeenCalledWith(
      "paymentUrl",
      "https://payment.test/session-123",
      "Payment URL for website deployment service",
    );

    // Verify browser was opened
    expect(openDefaultSpy).toHaveBeenCalledWith("https://payment.test/session-123");

    // Verify console output
    const logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("⏳ Step 1/4: Waiting for payment..."))).toBe(true);
    expect(logs.some((log) => log.includes("🔗 Payment link:"))).toBe(true);
  });

  test("PAYMENT_PENDING hook with isResuming=true", async () => {
    let paymentPendingHook;

    mockBrokerClient.deploy.mockImplementation(async (config) => {
      paymentPendingHook = config.hooks.PAYMENT_PENDING;
      return {
        appUrl: TEST_APP_URL,
        vendors: [{ token: "test-token" }],
      };
    });

    await deploy();

    // Test the PAYMENT_PENDING hook with isResuming=true
    await paymentPendingHook({
      sessionId: "session-123",
      paymentUrl: "https://payment.test/session-123",
      isResuming: true,
    });

    // Verify browser was NOT opened when resuming
    expect(openDefaultSpy).not.toHaveBeenCalled();

    // But saveValueToConfig should still be called
    expect(saveValueToConfigSpy).toHaveBeenCalledWith(
      "checkoutId",
      "session-123",
      "Checkout ID for website deployment service",
    );
  });

  test("other hooks functionality", async () => {
    let hooks;

    mockBrokerClient.deploy.mockImplementation(async (config) => {
      hooks = config.hooks;
      return {
        appUrl: TEST_APP_URL,
        vendors: [{ token: "test-token" }],
      };
    });

    await deploy();

    // Test INSTALLATION_STARTING hook
    hooks.INSTALLATION_STARTING();
    let logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("📦 Step 2/4: Setting up your website..."))).toBe(true);

    // Test SERVICE_STARTING hook
    hooks.SERVICE_STARTING();
    logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("🚀 Step 3/4: Starting your website..."))).toBe(true);

    // Test ACCESS_PREPARING hook
    hooks.ACCESS_PREPARING();
    logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("🌐 Step 4/4: Getting your website URL..."))).toBe(true);

    // Test ACCESS_READY hook without subscription
    await hooks.ACCESS_READY({
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
    });
    logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("🔗 Your website is ready at:"))).toBe(true);
    expect(logs.some((log) => log.includes(TEST_HOME_URL))).toBe(true);

    // Test ACCESS_READY hook with subscription
    await hooks.ACCESS_READY({
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      subscriptionUrl: TEST_SUBSCRIPTION_URL,
    });
    logs = consoleOutput.filter((o) => o.type === "log").map((o) => o.args.join(" "));
    expect(logs.some((log) => log.includes("🔗 Manage your subscription at:"))).toBe(true);
    expect(logs.some((log) => log.includes(TEST_SUBSCRIPTION_URL))).toBe(true);
  });

  test("handles missing vendors in result", async () => {
    const mockResult = {
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      vendors: null,
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    const result = await deploy();

    expect(result.token).toBeUndefined();
    expect(result.appUrl).toBe(TEST_APP_URL);
    expect(result.homeUrl).toBe(TEST_HOME_URL);
  });

  test("handles empty vendors array in result", async () => {
    const mockResult = {
      appUrl: TEST_APP_URL,
      homeUrl: TEST_HOME_URL,
      vendors: [],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    const result = await deploy();

    expect(result.token).toBeUndefined();
    expect(result.appUrl).toBe(TEST_APP_URL);
    expect(result.homeUrl).toBe(TEST_HOME_URL);
  });

  test("uses custom BASE_URL when WEB_SMITH_BASE_URL is set", async () => {
    process.env.WEB_SMITH_BASE_URL = "https://custom.websmith.test";

    const mockResult = {
      appUrl: TEST_APP_URL,
      vendors: [{ token: "test-token" }],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    await deploy();

    // Verify BrokerClient was constructed with custom baseUrl
    expect(mockBrokerClientConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        authToken: "mock-auth-token",
        baseUrl: "https://staging.websmith.aigne.io",
        paymentLinkKey: "PAYMENT_LINK_ID_OF_PAGE_KIT",
      }),
    );
  });

  test("uses empty BASE_URL when WEB_SMITH_BASE_URL is not set", async () => {
    delete process.env.WEB_SMITH_BASE_URL;

    const mockResult = {
      appUrl: TEST_APP_URL,
      vendors: [{ token: "test-token" }],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    await deploy();

    // Verify BrokerClient was constructed with empty baseUrl
    expect(mockBrokerClientConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        authToken: "mock-auth-token",
        baseUrl: "https://staging.websmith.aigne.io",
        paymentLinkKey: "PAYMENT_LINK_ID_OF_PAGE_KIT",
      }),
    );
  });

  test("handles browser opening failure", async () => {
    openDefaultSpy.mockRejectedValue(new Error("Cannot open browser"));

    let paymentPendingHook;
    mockBrokerClient.deploy.mockImplementation(async (config) => {
      paymentPendingHook = config.hooks.PAYMENT_PENDING;
      return {
        appUrl: TEST_APP_URL,
        vendors: [{ token: "test-token" }],
      };
    });

    await deploy();

    // The hook should throw when browser opening fails (expected behavior)
    await expect(
      paymentPendingHook({
        sessionId: "session-123",
        paymentUrl: "https://payment.test/session-123",
        isResuming: false,
      }),
    ).rejects.toThrow("Cannot open browser");

    // Config should still be saved
    expect(saveValueToConfigSpy).toHaveBeenCalled();
  });

  test("handles saveValueToConfig failure", async () => {
    saveValueToConfigSpy.mockRejectedValue(new Error("Config save failed"));

    let paymentPendingHook;
    mockBrokerClient.deploy.mockImplementation(async (config) => {
      paymentPendingHook = config.hooks.PAYMENT_PENDING;
      return {
        appUrl: TEST_APP_URL,
        vendors: [{ token: "test-token" }],
      };
    });

    await deploy();

    // The hook should throw when config saving fails (expected behavior)
    await expect(
      paymentPendingHook({
        sessionId: "session-123",
        paymentUrl: "https://payment.test/session-123",
        isResuming: false,
      }),
    ).rejects.toThrow("Config save failed");
  });

  test("includes paymentLinkKey in BrokerClient config", async () => {
    const mockResult = {
      appUrl: TEST_APP_URL,
      vendors: [{ token: "test-token" }],
    };

    mockBrokerClient.deploy.mockResolvedValue(mockResult);

    await deploy();

    // Verify BrokerClient was constructed with paymentLinkKey
    expect(mockBrokerClientConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentLinkKey: "PAYMENT_LINK_ID_OF_PAGE_KIT",
      }),
    );
  });
});
