import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { joinURL } from "ufo";
import YAML from "yaml";

import { getAccessToken } from "../../utils/auth-utils.mjs";
import { getBlockletConfig } from "../../utils/blocklet.mjs";
import { CLOUD_SERVICE_URL_PROD, WEB_SMITH_CONFIG_PATH } from "../../utils/constants.mjs";
import { augmentColor } from "../../utils/theme-utils.mjs";
import { loadConfigFromFile } from "../../utils/utils.mjs";

const WELLKNOWN_SERVICE_PATH_PREFIX = "/.well-known/service";

/**
 * Convert theme data to MUI Theme standard structure
 * @param {Object} themeData - Original theme data
 * @returns {Object} - MUI Theme standard structure
 */
function formatToMUITheme(themeData) {
  const { light, dark, fonts } = themeData;

  // Helper function to augment colors (excluding background colors)
  function augmentColorPalette(colorObj) {
    const augmented = {};

    // Process all colors except background
    const colorKeys = ["primary", "secondary", "error", "warning", "info", "success"];

    for (const key of colorKeys) {
      if (colorObj[key]) {
        augmented[key] = augmentColor(colorObj[key]);
      }
    }

    return augmented;
  }

  // Augment light and dark color palettes
  const lightAugmented = augmentColorPalette(light);
  const darkAugmented = augmentColorPalette(dark);

  // MUI Theme standard structure
  const muiTheme = {
    light: {
      palette: {
        ...lightAugmented,
        background: {
          default: light.background,
          paper: light.surface,
        },
      },
    },
    dark: {
      palette: {
        ...darkAugmented,
        background: {
          default: dark.background,
          paper: dark.surface,
        },
      },
    },
    common: {
      typography: {
        fontFamily: fonts.body.fontFamily,
        h1: {
          fontFamily: fonts.heading.fontFamily,
        },
        h2: {
          fontFamily: fonts.heading.fontFamily,
        },
        h3: {
          fontFamily: fonts.heading.fontFamily,
        },
        h4: {
          fontFamily: fonts.heading.fontFamily,
        },
        h5: {
          fontFamily: fonts.heading.fontFamily,
        },
        h6: {
          fontFamily: fonts.heading.fontFamily,
        },
        body1: {
          fontFamily: fonts.body.fontFamily,
        },
        body2: {
          fontFamily: fonts.body.fontFamily,
        },
        button: {
          fontFamily: fonts.body.fontFamily,
        },
      },
    },
  };

  return muiTheme;
}

/**
 * Get remote theme data
 * @param {string} appUrl - Application URL
 * @param {string} accessToken - Access token
 * @param {string} blockletDid - Blocklet DID
 * @returns {Promise<Object>} - Remote theme data
 */
async function getRemoteThemeData(appUrl, accessToken, blockletDid) {
  const url = new URL(appUrl);
  const apiUrl = joinURL(url.origin, WELLKNOWN_SERVICE_PATH_PREFIX, `/api/theme?id=${blockletDid}`);

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get remote theme data: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Upload theme data
 * @param {string} appUrl - Application URL
 * @param {string} accessToken - Access token
 * @param {string} blockletDid - Blocklet DID
 * @param {Object} themeData - Theme data
 * @returns {Promise<Object>} - Upload result
 */
async function uploadThemeData(appUrl, accessToken, blockletDid, themeData) {
  const url = new URL(appUrl);
  const apiUrl = joinURL(url.origin, WELLKNOWN_SERVICE_PATH_PREFIX, `/api/theme?id=${blockletDid}`);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme: themeData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload theme data: ${response.status} ${response.statusText}\n${errorText}`,
    );
  }

  return await response.json();
}

export default async function applyTheme({ appUrl, config = WEB_SMITH_CONFIG_PATH }, options) {
  // Step 1: Process appUrl
  try {
    let finalAppUrl;

    if (appUrl) {
      finalAppUrl = appUrl.trim();

      // Ensure appUrl has protocol
      finalAppUrl = finalAppUrl.includes("://") ? finalAppUrl : `https://${finalAppUrl}`;

      // Basic format validation
      try {
        new URL(finalAppUrl);
      } catch {
        throw new Error(`Invalid URL format: ${finalAppUrl}. Please enter a valid website URL.`);
      }
    } else {
      // If no appUrl parameter, use config file or default value
      const configData = await loadConfigFromFile();
      finalAppUrl = configData?.appUrl || CLOUD_SERVICE_URL_PROD;
    }

    // Step 2: Get access token
    const accessToken = await getAccessToken(finalAppUrl);

    // Step 3: get blocklet configuration and DID
    const blockletConfig = await getBlockletConfig(finalAppUrl);
    const blockletDid = blockletConfig.did;
    const appName = blockletConfig.appName;

    // Step 4: CLI interactive theme selection
    let selectedTheme;
    const cacheDir = join(dirname(config), "themes");

    console.log("config: ", config, " cacheDir: ", cacheDir);

    const files = await readdir(cacheDir);
    const themeFiles = files.filter((file) => file.endsWith(".yaml"));

    if (themeFiles.length === 0) {
      throw new Error(`No themes found. Please create a theme first.`);
    }

    const themes = [];

    // Read all theme files and sort by creation time (newest first)
    for (const file of themeFiles) {
      try {
        const themePath = join(cacheDir, file);
        const themeContent = await readFile(themePath, "utf-8");
        const theme = YAML.parse(themeContent);

        if (theme.name) {
          themes.push({
            name: theme.name,
            file: file,
            theme: theme,
            generatedAt: theme.generatedAt || new Date(0).toISOString(),
            primaryColor: theme.light?.primary || "N/A",
            headingFont: theme.fonts?.heading?.fontFamily || "N/A",
            bodyFont: theme.fonts?.body?.fontFamily || "N/A",
          });
        }
      } catch {
        // Skip invalid theme files
      }
    }

    // Sort by generation time (newest first)
    themes.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

    if (themes.length === 0) {
      throw new Error(`No themes found. Please create a theme first.`);
    }

    // Create interactive selection options
    const choices = themes.map((theme, index) => ({
      name: `${index + 1}. ${theme.name} (${chalk.hex(theme.primaryColor)(theme.primaryColor)}) - ${theme.headingFont}/${theme.bodyFont}`,
      value: theme.name,
      description: `Generated: ${theme.generatedAt}`,
    }));

    // Let user select theme
    const selectedThemeName = await options.prompts.select({
      message: "Select a theme to apply to your website:",
      choices: choices,
    });

    if (!selectedThemeName) {
      throw new Error("Please select a theme to continue");
    }

    // Find selected theme
    const foundTheme = themes.find((t) => t.name === selectedThemeName);
    if (foundTheme) {
      selectedTheme = foundTheme.theme;
    } else {
      throw new Error(`Theme "${selectedThemeName}" not found`);
    }

    // Validate theme data structure
    if (
      !selectedTheme.name ||
      !selectedTheme.light ||
      !selectedTheme.dark ||
      !selectedTheme.fonts
    ) {
      throw new Error(
        "Theme data is incomplete. Missing required fields: name, light colors, dark colors, and fonts",
      );
    }

    // Step 5: Get remote theme data
    let remoteThemeData;
    try {
      remoteThemeData = await getRemoteThemeData(finalAppUrl, accessToken, blockletDid);
    } catch (error) {
      // If no remote theme data, create an empty theme object
      console.log(
        chalk.yellow(
          `⚠️ Could not retrieve existing themes: ${error.message}. Creating a new theme collection.`,
        ),
      );
      remoteThemeData = { concepts: [] };
    }

    // Step 6: User confirmation before applying theme
    console.log(chalk.yellow("\n⚠️  Warning: This will replace your current website theme."));
    console.log(
      chalk.blue(`\nTarget Website: ${appName ? `${appName} (${finalAppUrl})` : finalAppUrl}`),
    );
    // Display current theme information if available
    let currentTheme = null;
    if (remoteThemeData.concepts && remoteThemeData.concepts.length > 0) {
      currentTheme = remoteThemeData.concepts.find(
        (t) => t.id === remoteThemeData.currentConceptId,
      );
    }
    if (currentTheme) {
      console.log(chalk.blue(`Current Theme: "${currentTheme.name}"`));
    } else {
      console.log(chalk.blue(`Current Theme: Default`));
    }
    console.log(chalk.blue(`New Theme: "${selectedTheme.name}"`));

    const confirmed = await options.prompts.confirm({
      message: "Apply this theme to your website?",
      default: false,
    });

    if (!confirmed) {
      return {
        message: chalk.yellow("Theme not applied."),
      };
    }

    // Step 7: Update or insert theme data
    if (!remoteThemeData.concepts) {
      remoteThemeData.concepts = [];
    }

    // Convert theme data to MUI Theme standard structure
    const formattedTheme = formatToMUITheme(selectedTheme);

    // Check if theme with same name already exists
    const existingThemeIndex = remoteThemeData.concepts.findIndex(
      (t) => t.name === selectedTheme.name,
    );

    if (existingThemeIndex >= 0) {
      // Update existing theme
      remoteThemeData.concepts[existingThemeIndex].themeConfig = formattedTheme;
      remoteThemeData.currentConceptId = remoteThemeData.concepts[existingThemeIndex].id;
    } else {
      // Insert new theme
      const id = nanoid();
      remoteThemeData.concepts.push({
        id,
        name: selectedTheme.name,
        template: "Default",
        mode: "light",
        prefer: "system",
        themeConfig: formattedTheme,
        editor: {
          colors: {},
          styles: {},
          typography: {},
        },
      });
      remoteThemeData.currentConceptId = id;
    }

    // Step 8: Upload updated theme data
    console.log(chalk.blue("🚀 Applying theme to your website..."));
    await uploadThemeData(finalAppUrl, accessToken, blockletDid, remoteThemeData);

    return {
      message: chalk.green(
        `Theme "${selectedTheme.name}" applied successfully to ${appName ? `${appName} (${finalAppUrl})` : finalAppUrl}`,
      ),
    };
  } catch (error) {
    return {
      message: chalk.red(`Failed to apply theme: ${error.message}`),
    };
  }
}

applyTheme.input_schema = {
  type: "object",
  properties: {
    appUrl: {
      type: "string",
      description: "Your website URL",
    },
    config: {
      type: "string",
      description: "Configuration file location",
    },
  },
};

applyTheme.taskTitle = "Apply theme to your website";
