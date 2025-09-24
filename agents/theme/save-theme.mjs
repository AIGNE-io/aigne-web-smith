import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";

export default async function saveTheme({ theme, config }) {
  if (!theme) {
    return {
      message: chalk.red("Please provide theme data to save"),
    };
  }
  if (!config) {
    return {
      message: chalk.red("Please provide a configuration file path"),
    };
  }

  try {
    // Create theme cache directory
    const cacheDir = join(dirname(config), "themes");
    await fs.mkdir(cacheDir, { recursive: true });

    // Generate theme filename
    const themeName = theme.name;
    const filename = `${themeName}.json`;
    const filePath = join(cacheDir, filename);

    // Check for existing themes with the same name and delete them
    try {
      const files = await fs.readdir(cacheDir);
      const existingThemes = files.filter((file) => file === `${themeName}.json`);

      for (const existingFile of existingThemes) {
        const existingPath = join(cacheDir, existingFile);
        await fs.unlink(existingPath);
      }
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not check existing themes: ${error.message}`));
    }

    // Save theme to file as JSON
    const content = JSON.stringify(theme, null, 2);
    await fs.writeFile(filePath, content, "utf8");

    return {
      message: chalk.green(`Theme "${themeName}" saved successfully`),
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
      default: "./.aigne/web-smith/config.yaml",
    },
  },
};

saveTheme.taskRenderMode = "hide";
