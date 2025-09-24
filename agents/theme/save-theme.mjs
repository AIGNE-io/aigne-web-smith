import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";

export default async function saveTheme({ theme, config }) {
  if (!theme) {
    return {
      saveThemeStatus: false,
      saveThemePath: null,
      error: "No theme data found to save.",
    };
  }
  if (!config) {
    return {
      saveThemeStatus: false,
      saveThemePath: null,
      error: "No config file path found to save theme.",
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

    // Save theme directly
    const themeObj = theme;

    // Check for existing themes with the same name and delete them
    try {
      const files = await fs.readdir(cacheDir);
      const existingThemes = files.filter(
        (file) => file === `${themeName}.json`,
      );

      for (const existingFile of existingThemes) {
        const existingPath = join(cacheDir, existingFile);
        await fs.unlink(existingPath);
      }
    } catch {
      // Ignore errors when checking for existing files
    }

    // Save theme to file as JSON
    const content = JSON.stringify(themeObj, null, 2);
    await fs.writeFile(filePath, content, "utf8");

    return {
      saveThemeStatus: true,
      saveThemePath: filePath,
      themeName: themeName,
    };
  } catch (error) {
    return {
      saveThemeStatus: false,
      saveThemePath: null,
      error: error.message,
    };
  }
}


saveTheme.description = "Save a structured theme configuration to the theme cache directory";

saveTheme.input_schema = {
  type: "object",
  properties: {
    theme: { type: "object", description: "A structured JSON object containing theme configuration" },
    config: { type: "string", description: "Path to configuration file" },
  },
};