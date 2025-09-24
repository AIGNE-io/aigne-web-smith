import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";

export default async function saveTheme({ theme, config }) {
  if (!theme) {
    return {
      message: chalk.red("No theme data provided for saving"),
    };
  }
  if (!config) {
    return {
      message: chalk.red("No configuration file path provided"),
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
      console.warn(chalk.yellow(`Warning: Error checking existing themes: ${error.message}`));
    }

    // Save theme to file as JSON
    const content = JSON.stringify(theme, null, 2);
    await fs.writeFile(filePath, content, "utf8");

    return {
      message: chalk.green(`Theme "${themeName}" saved successfully`),
    };
  } catch (error) {
    return {
      message: chalk.red(`Failed to save theme: ${error.message}`),
    };
  }
}

saveTheme.description = "Save a structured theme configuration to the theme cache directory";

saveTheme.input_schema = {
  type: "object",
  properties: {
    theme: {
      type: "object",
      description: "A structured JSON object containing theme configuration",
    },
    config: {
      type: "string",
      description: "Path to configuration file",
      default: "./.aigne/web-smith/config.yaml",
    },
  },
};
