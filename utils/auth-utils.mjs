import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createConnect } from "@aigne/cli/utils/aigne-hub/credential.js";
import { PAYMENT_KIT_DID } from "@blocklet/payment-broker-client";
import chalk from "chalk";
import open from "open";
import { joinURL, withQuery } from "ufo";

import {
  ComponentNotFoundError,
  getComponentMountPoint,
  InvalidBlockletError,
} from "./blocklet.mjs";
import {
  BLOCKLET_ADD_COMPONENT_PAGES,
  CLOUD_SERVICE_URL_PROD,
  CLOUD_SERVICE_URL_STAGING,
  DEFAULT_APP_LOGO,
  PAGES_KIT_DID,
  PAGES_KIT_STORE_URL,
} from "./constants.mjs";
import { createStore } from "./store/index.mjs";

const WELLKNOWN_SERVICE_PATH_PREFIX = "/.well-known/service";

const TIMEOUT_MINUTES = 5; // Just wait 5 min
const FETCH_INTERVAL = 3000; // 3 seconds

const RETRY_COUNT = (TIMEOUT_MINUTES * 60 * 1000) / FETCH_INTERVAL;

/**
 * Get access token from environment, config file, or prompt user for authorization
 * @param {string} baseUrl - The application URL
 * @returns {Promise<string>} - The access token
 */
export async function getCachedAccessToken(baseUrl) {
  const { hostname: targetHostname } = new URL(baseUrl);
  const store = await createStore();

  let accessToken =
    process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN || process.env.PAGES_KIT_ACCESS_TOKEN;

  // Check if access token exists in environment or config file
  if (!accessToken) {
    try {
      const storeItem = await store.getItem(targetHostname);
      accessToken = storeItem?.WEB_SMITH_PUBLISH_ACCESS_TOKEN || storeItem?.PAGES_KIT_ACCESS_TOKEN;
    } catch (error) {
      console.warn("Could not read the configuration file:", error.message);
    }
  }

  return accessToken;
}

export const getPagesKitMountPoint = async (origin) => {
  try {
    const mountPoint = await getComponentMountPoint(origin, PAGES_KIT_DID);
    return mountPoint;
  } catch (error) {
    const storeLink = chalk.cyan(PAGES_KIT_STORE_URL);
    if (error instanceof InvalidBlockletError) {
      throw new Error(
        `${chalk.yellow("⚠️  The provided URL is not a valid website on ArcBlock platform")}\n\n` +
          `${chalk.bold(
            "💡 Solution:",
          )} Start here to set up your own website to host pages:\n${storeLink}\n\n`,
      );
    } else if (error instanceof ComponentNotFoundError) {
      const pagesLink = chalk.cyan(BLOCKLET_ADD_COMPONENT_PAGES);
      throw new Error(
        `${chalk.yellow("⚠️  This website does not have required components for publishing")}\n\n` +
          `${chalk.bold(
            "💡 Solution:",
          )} Please refer to the documentation to add page publishing components:\n${pagesLink}\n\n`,
      );
    } else {
      throw new Error(
        `❌ Unable to connect to: ${chalk.cyan(origin)}\n\n` +
          `${chalk.bold("Possible causes:")}\n` +
          `• Network connection issues\n` +
          `• Server temporarily unavailable\n` +
          `• Incorrect URL address\n\n` +
          `${chalk.green(
            "Suggestion:",
          )} Please check your network connection and URL address, then try again`,
      );
    }
  }
};

/**
 * Get access token from environment, config file, or prompt user for authorization
 * @param {string} appUrl - The application URL
 * @param {string} ltToken - Optional token from deployment service
 * @param {string} locale - Optional locale for the authorization page
 * @returns {Promise<string>} - The access token
 */
export async function getAccessToken(appUrl, ltToken = "", locale = "en") {
  const { hostname, origin: targetOrigin } = new URL(appUrl);

  let accessToken = await getCachedAccessToken(targetOrigin);

  // If still no access token, prompt user to authorize
  if (accessToken) {
    return accessToken;
  }

  const connectUrl = joinURL(targetOrigin, WELLKNOWN_SERVICE_PATH_PREFIX);

  try {
    const result = await createConnect({
      connectUrl: connectUrl,
      connectAction: "gen-simple-access-key",
      source: `AIGNE WebSmith connect to website`,
      closeOnSuccess: true,
      appName: "AIGNE WebSmith",
      appLogo: DEFAULT_APP_LOGO,
      retry: RETRY_COUNT,
      fetchInterval: FETCH_INTERVAL,
      openPage: async (pageUrl) => {
        const url = new URL(pageUrl);
        const isOfficial = [CLOUD_SERVICE_URL_PROD, CLOUD_SERVICE_URL_STAGING].includes(url.origin);
        if (!isOfficial) {
          url.searchParams.set("required_roles", "owner,admin");
        }
        if (ltToken) {
          url.searchParams.set("__lt", ltToken);
        }
        url.searchParams.set("locale", locale);

        let finalUrl = url.toString();
        open(finalUrl);

        try {
          const officialBaseUrl = process.env.WEB_SMITH_BASE_URL || CLOUD_SERVICE_URL_PROD;
          const mountPoint = await getComponentMountPoint(officialBaseUrl, PAYMENT_KIT_DID);
          const response = await fetch(
            withQuery(joinURL(officialBaseUrl, mountPoint, "/api/tool/short-connect-url"), {
              url: finalUrl,
              locale,
            }),
          );
          const data = await response.json();
          if (data.url) {
            finalUrl = data.url;
          }
        } catch {
          // Ignore error
        }

        console.log(
          "🔗 Please open the following URL in your browser to authorize access: ",
          chalk.cyan(finalUrl),
          "\n",
        );
      },
    });

    accessToken = result.accessKeySecret;
    process.env.WEB_SMITH_PUBLISH_ACCESS_TOKEN = accessToken;

    // Save the access token to config file
    await saveTokenToConfigFile(hostname, { WEB_SMITH_PUBLISH_ACCESS_TOKEN: accessToken });
  } catch {
    throw new Error(
      `${chalk.yellow("⚠️ Failed to obtain access token. This may be due to network issues or authorization timeout.")}\n\n` +
        `${chalk.bold("💡 Solution:")}\n` +
        `  • Step 1: Ensure your network can access the service URL: ${chalk.cyan(targetOrigin)}\n` +
        `  • Step 2: Run ${chalk.cyan("aigne web publish")} again\n` +
        `  • Step 3: If prompted, select ${chalk.cyan("Resume previous website setup")} to continue from where you left off\n\n`,
    );
  }

  return accessToken;
}

/**
 * Gets the official access token from the environment, config file, or prompts the user to authorize.
 * @param {string} baseUrl - The official service URL.
 * @param {boolean} openPage - Whether to open the authorization page if token is not found.
 * @param {string} locale - Optional locale for the authorization page.
 * @returns {Promise<string>} The access token.
 */
export async function getOfficialAccessToken(baseUrl, openPage = true, locale = "en") {
  if (!baseUrl) {
    throw new Error("The baseUrl parameter is required for getOfficialAccessToken.");
  }

  // Parse URL once and reuse
  const { hostname: targetHostname, origin: targetOrigin } = new URL(baseUrl);

  // 1. Check environment variable
  let accessToken = await getCachedAccessToken(targetOrigin);

  // If token is found, return it
  if (accessToken || !openPage) {
    return accessToken;
  }

  // Generate new access token
  const connectUrl = joinURL(targetOrigin, WELLKNOWN_SERVICE_PATH_PREFIX);

  try {
    const result = await createConnect({
      connectUrl,
      connectAction: "gen-simple-access-key",
      source: "AIGNE WebSmith connect to official service",
      closeOnSuccess: true,
      retry: RETRY_COUNT,
      fetchInterval: FETCH_INTERVAL,
      appName: "AIGNE WebSmith",
      appLogo: DEFAULT_APP_LOGO,
      openPage: async (pageUrl) => {
        const url = new URL(pageUrl);
        let finalUrl = url.toString();
        if (locale) {
          url.searchParams.set("locale", locale);
        }
        open(finalUrl);

        try {
          const officialBaseUrl = process.env.WEB_SMITH_BASE_URL || CLOUD_SERVICE_URL_PROD;
          const mountPoint = await getComponentMountPoint(officialBaseUrl, PAYMENT_KIT_DID);
          const response = await fetch(
            withQuery(joinURL(officialBaseUrl, mountPoint, "/api/tool/short-connect-url"), {
              url: finalUrl,
              locale,
            }),
          );
          const data = await response.json();
          if (data.url) {
            finalUrl = data.url;
          }
        } catch {
          // Ignore error
        }

        console.log(
          "🔗 Please open the following URL in your browser to authorize access: ",
          chalk.cyan(finalUrl),
          "\n",
        );
      },
    });

    accessToken = result.accessKeySecret;

    // Save the access token to config file
    await saveTokenToConfigFile(targetHostname, { WEB_SMITH_PUBLISH_ACCESS_TOKEN: accessToken });
  } catch {
    throw new Error(
      `${chalk.yellow("⚠️ Failed to obtain official access token. This may be due to network issues or authorization timeout.")}\n\n` +
        `${chalk.bold("💡 Solution:")}\n` +
        `  • Step 1: Ensure your network can access the official service URL: ${chalk.cyan(targetOrigin)}\n` +
        `  • Step 2: Run ${chalk.cyan("aigne web publish")} again\n\n`,
    );
  }

  return accessToken;
}

/**
 * Saves the access token and related fields to the configuration file.
 * @param {string} hostname - The hostname key.
 * @param {Object} fields - Fields to save (e.g., { PAGES_KIT_ACCESS_TOKEN: "..." }).
 */
async function saveTokenToConfigFile(hostname, fields) {
  try {
    const store = await createStore();

    const aigneDir = join(homedir(), ".aigne");
    if (!existsSync(aigneDir)) {
      mkdirSync(aigneDir, { recursive: true });
    }

    await store.setItem(hostname, fields);
  } catch (error) {
    console.warn(`Could not save the token to the configuration file: ${error.message}`, error);
    // The token is already in the environment, so we don't need to throw an error here.
  }
}
