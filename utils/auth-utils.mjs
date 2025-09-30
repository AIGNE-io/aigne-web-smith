import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createConnect } from "@aigne/cli/utils/aigne-hub/credential.js";
import chalk from "chalk";
import open from "open";
import { joinURL } from "ufo";
import { parse, stringify } from "yaml";
import {
  ComponentNotFoundError,
  getComponentMountPoint,
  InvalidBlockletError,
} from "./blocklet.mjs";
import {
  BLOCKLET_ADD_COMPONENT_PAGES,
  DEFAULT_APP_LOGO,
  PAGES_KIT_DID,
  PAGES_KIT_STORE_URL,
  WEB_OFFICIAL_ACCESS_TOKEN,
} from "./constants.mjs";

const WELLKNOWN_SERVICE_PATH_PREFIX = "/.well-known/service";

/**
 * Get access token from environment, config file, or prompt user for authorization
 * @param {string} appUrl - The application URL
 * @param {string} ltToken - Optional token from deployment service
 * @returns {Promise<string>} - The access token
 */
export async function getAccessToken(appUrl, ltToken = "") {
  const WEB_SMITH_ENV_FILE = join(homedir(), ".aigne", "web-smith-connected.yaml");
  const { hostname } = new URL(appUrl);

  let accessToken = process.env.PAGE_KIT_ACCESS_TOKEN;

  // Check if access token exists in environment or config file
  if (!accessToken) {
    try {
      if (existsSync(WEB_SMITH_ENV_FILE)) {
        const data = await readFile(WEB_SMITH_ENV_FILE, "utf8");
        if (data.includes("PAGE_KIT_ACCESS_TOKEN")) {
          // Handle empty or invalid YAML files
          const envs = data.trim() ? parse(data) : null;
          if (envs?.[hostname]?.PAGE_KIT_ACCESS_TOKEN) {
            accessToken = envs[hostname].PAGE_KIT_ACCESS_TOKEN;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to read config file:", error.message);
    }
  }

  // If still no access token, prompt user to authorize
  if (accessToken) {
    return accessToken;
  }

  // Check if Pages Kit is running at the provided URL
  try {
    await getComponentMountPoint(appUrl, PAGES_KIT_DID);
  } catch (error) {
    const storeLink = chalk.cyan(PAGES_KIT_STORE_URL);
    if (error instanceof InvalidBlockletError) {
      throw new Error(
        `${chalk.yellow("⚠️  The provided URL is not a valid website on ArcBlock platform")}\n\n` +
          `${chalk.bold(
            "💡 Solution:",
          )} Start here to set up your own website for hosting pages:\n${storeLink}\n\n`,
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
        `❌ Unable to connect to: ${chalk.cyan(appUrl)}\n\n` +
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

  const PAGES_KIT_URL = appUrl;
  const connectUrl = joinURL(new URL(PAGES_KIT_URL).origin, WELLKNOWN_SERVICE_PATH_PREFIX);

  try {
    const result = await createConnect({
      connectUrl: connectUrl,
      connectAction: "gen-simple-access-key",
      source: `AIGNE WebSmith connect to website`,
      closeOnSuccess: true,
      appName: "AIGNE WebSmith",
      appLogo: DEFAULT_APP_LOGO,
      openPage: (pageUrl) => {
        const url = new URL(pageUrl);
        if (ltToken) {
          url.searchParams.set("__lt", ltToken);
        }

        open(url.toString());
      },
    });

    accessToken = result.accessKeySecret;
    process.env.PAGE_KIT_ACCESS_TOKEN = accessToken;

    // Save the access token to config file
    const aigneDir = join(homedir(), ".aigne");
    if (!existsSync(aigneDir)) {
      mkdirSync(aigneDir, { recursive: true });
    }

    let existingConfig = {};
    if (existsSync(WEB_SMITH_ENV_FILE)) {
      const fileContent = await readFile(WEB_SMITH_ENV_FILE, "utf8");
      const parsedConfig = fileContent.trim() ? parse(fileContent) : null;
      existingConfig = parsedConfig || {};
    }

    await writeFile(
      WEB_SMITH_ENV_FILE,
      stringify({
        ...existingConfig,
        [hostname]: {
          PAGE_KIT_ACCESS_TOKEN: accessToken,
          PAGE_KIT_URL: PAGES_KIT_URL,
        },
      }),
    );
  } catch (error) {
    console.debug(error);
    throw new Error(
      "Failed to obtain access token. Please check your network connection and try again later.",
    );
  }

  return accessToken;
}

/**
 * Get official access token from environment, config file, or prompt user for authorization.
 * @param {string} baseUrl - The official service URL
 * @returns {Promise<string>} - The access token
 */
export async function getOfficialAccessToken(baseUrl) {
  // Early parameter validation
  if (!baseUrl) {
    throw new Error("baseUrl parameter is required for getOfficialAccessToken.");
  }

  // Parse URL once and reuse
  const urlObj = new URL(baseUrl);
  const { hostname, origin } = urlObj;
  const WEB_SMITH_ENV_FILE = join(homedir(), ".aigne", "web-smith-connected.yaml");

  // 1. Check environment variable
  let accessToken = process.env[WEB_OFFICIAL_ACCESS_TOKEN];

  // 2. Check config file if not in env
  if (!accessToken) {
    try {
      if (existsSync(WEB_SMITH_ENV_FILE)) {
        const data = await readFile(WEB_SMITH_ENV_FILE, "utf8");
        // Handle empty or invalid YAML files
        const envs = data.trim() ? parse(data) : null;
        if (envs) {
          accessToken = envs[hostname]?.[WEB_OFFICIAL_ACCESS_TOKEN];
        }
      }
    } catch (_error) {
      // ignore
    }
  }

  // If token is found, return it
  if (accessToken) {
    return accessToken;
  }

  // Generate new access token
  const connectUrl = joinURL(origin, WELLKNOWN_SERVICE_PATH_PREFIX);

  try {
    const result = await createConnect({
      connectUrl,
      connectAction: "gen-simple-access-key",
      source: "AIGNE WebSmith connect to official service",
      closeOnSuccess: true,
      appName: "AIGNE WebSmith",
      appLogo: DEFAULT_APP_LOGO,
      openPage: (pageUrl) => {
        console.log("🔗 Please open this URL to get the access token: ", chalk.cyan(pageUrl), "\n");
        open(pageUrl);
      },
    });

    accessToken = result.accessKeySecret;
    process.env[WEB_OFFICIAL_ACCESS_TOKEN] = accessToken;

    // Save the access token to config file
    await saveTokenToConfigFile(
      WEB_SMITH_ENV_FILE,
      hostname,
      WEB_OFFICIAL_ACCESS_TOKEN,
      accessToken,
    );
  } catch (error) {
    console.debug(error);
    throw new Error(
      "Failed to obtain official access token. Please check your network connection and try again later.",
    );
  }

  return accessToken;
}

/**
 * Helper function to save access token to config file
 * @param {string} configFile - Path to config file
 * @param {string} hostname - Hostname key
 * @param {string} tokenKey - Token key name
 * @param {string} tokenValue - Token value
 */
async function saveTokenToConfigFile(configFile, hostname, tokenKey, tokenValue) {
  try {
    const aigneDir = join(homedir(), ".aigne");
    if (!existsSync(aigneDir)) {
      mkdirSync(aigneDir, { recursive: true });
    }

    let existingConfig = {};
    if (existsSync(configFile)) {
      const fileContent = await readFile(configFile, "utf8");
      // Handle empty or invalid YAML files
      const parsedConfig = fileContent.trim() ? parse(fileContent) : null;
      existingConfig = parsedConfig || {};
    }

    await writeFile(
      configFile,
      stringify({
        ...existingConfig,
        [hostname]: {
          ...existingConfig[hostname],
          [tokenKey]: tokenValue,
        },
      }),
    );
  } catch (error) {
    console.warn(`Failed to save token to config file: ${error.message}`, error);
    // Don't throw here, as the token is already obtained and set in env
  }
}
