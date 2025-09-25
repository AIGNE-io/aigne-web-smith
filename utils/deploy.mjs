import { BrokerClient, STEPS } from "@blocklet/payment-broker-client/node";
import chalk from "chalk";
import open from "open";
import { getOfficialAccessToken } from "./auth-utils.mjs";
import { saveValueToConfig } from "./utils.mjs";

// ==================== Configuration ====================
const BASE_URL = process.env.WEB_SMITH_BASE_URL || "";

/**
 * Deploy a new website for your pages and return the installation URL
 * @param {string} id - Cached checkout ID (optional)
 * @param {string} cachedUrl - Cached payment URL (optional)
 * @returns {Promise<Object>} - The deployment result with URLs
 */
export async function deploy(id, cachedUrl) {
  const authToken = await getOfficialAccessToken(BASE_URL);

  if (!authToken) {
    throw new Error("Failed to get official access token");
  }

  const client = new BrokerClient({
    baseUrl: BASE_URL,
    authToken,
    paymentLinkKey: "PAYMENT_LINK_ID_OF_PAGE_KIT",
    timeout: 300000,
    polling: {
      interval: 3000,
      maxAttempts: 100,
      backoffStrategy: "linear",
    },
  });

  console.log(`🚀 Starting deployment...`);

  const result = await client.deploy({
    cachedCheckoutId: id,
    cachedPaymentUrl: cachedUrl,
    page_info: {
      success_message: {
        en: "Congratulations! Your website has been successfully created. You can return to the command-line tool to continue publishing your pages.",
        zh: "恭喜您，你的网站已创建成功！可以返回命令行工具继续发布你的页面！",
      },
    },
    hooks: {
      [STEPS.PAYMENT_PENDING]: async ({ sessionId, paymentUrl, isResuming }) => {
        console.log(`⏳ Step 1/4: Waiting for payment...`);
        console.log(`🔗 Payment link: ${chalk.cyan(paymentUrl)}\n`);

        await saveValueToConfig(
          "checkoutId",
          sessionId,
          "Checkout ID for website deployment service",
        );
        await saveValueToConfig(
          "paymentUrl",
          paymentUrl,
          "Payment URL for website deployment service",
        );

        if (!isResuming) {
          await open(paymentUrl);
        }
      },

      [STEPS.INSTALLATION_STARTING]: () => {
        console.log(`📦 Step 2/4: Setting up your website...`);
      },

      [STEPS.SERVICE_STARTING]: () => {
        console.log(`🚀 Step 3/4: Starting your website...`);
      },

      [STEPS.ACCESS_PREPARING]: () => {
        console.log(`🌐 Step 4/4: Getting your website URL...`);
      },

      [STEPS.ACCESS_READY]: async ({ appUrl, homeUrl, subscriptionUrl }) => {
        console.log(`\n🔗 Your website is ready at: ${chalk.cyan(homeUrl || appUrl)}`);
        if (subscriptionUrl) {
          console.log(`🔗 Manage your subscription at: ${chalk.cyan(subscriptionUrl)}\n`);
        } else {
          console.log("");
        }
      },
    },

    onError: (error, step) => {
      console.error(`${chalk.red("❌")} Website deployment failed at ${step || "unknown step"}:`);
      console.error(`   ${error.message}`);
    },
  });

  const { appUrl, homeUrl, subscriptionUrl, dashboardUrl, vendors } = result;
  const token = vendors?.[0]?.token;

  return {
    appUrl,
    homeUrl,
    dashboardUrl,
    subscriptionUrl,
    token,
  };
}
