import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";
import YAML from "yaml";

import { toKebabCase } from "../../utils/utils.mjs";

export default async function saveTheme({ theme, config = "./.aigne/web-smith/config.yaml" }, options) {
  if (!theme) {
    return {
      message: chalk.red("Please provide theme data to save"),
    };
  }

  try {
    // Create theme cache directory
    const cacheDir = join(dirname(config), "themes");
    await fs.mkdir(cacheDir, { recursive: true });

    // Generate theme filename using kebab-case
    const themeName = theme.name;
    const kebabCaseName = toKebabCase(themeName);
    const filename = `${kebabCaseName}.yaml`;
    const filePath = join(cacheDir, filename);

    // Check for existing themes with the same name and ask for confirmation
    try {
      const files = await fs.readdir(cacheDir);
      const existingThemes = files.filter((file) => file === filename);

      if (existingThemes.length > 0) {
        const confirmed = await options.prompts.confirm({
          message: `Theme "${themeName}" already exists. Do you want to overwrite it?`,
          default: false,
        });

        if (!confirmed) {
          return {
            message: chalk.yellow(`Save cancelled.`),
          };
        }

        // Delete existing theme files
        for (const existingFile of existingThemes) {
          const existingPath = join(cacheDir, existingFile);
          await fs.unlink(existingPath);
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not check existing themes: ${error.message}`));
    }

    // Save theme to file as YAML
    const themeWithTimestamp = {
      ...theme,
      createdAt: new Date().toISOString(),
    };
    const content = YAML.stringify(themeWithTimestamp, { indent: 2 });
    await fs.writeFile(filePath, content, "utf8");

    return {
      message: chalk.green(`Theme "${themeName}" saved as "${filename}"`),
    };
  } catch (error) {
    return {
      message: chalk.red(`Unable to save theme: ${error.message}`),
    };
  }
}

saveTheme.description = "Save theme configuration to your local cache";

saveTheme.input_schema = {
  type: "object",
  properties: {
    theme: {
      type: "object",
      description: "Theme configuration data",
    },
    config: {
      type: "string",
      description: "Configuration file location",
    },
  },
};

saveTheme.taskTitle = "Save theme to local storage";
