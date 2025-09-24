import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function applyTheme({ config }, options) {
  try {
    // Get theme from cache
    let themeData;
    const cacheDir = join(process.cwd(), ".aigne", "web-smith", "themes");

    try {
      const { readdir } = await import("node:fs/promises");
      const files = await readdir(cacheDir);
      const themeFiles = files.filter(file => file.endsWith('.json'));

      if (themeFiles.length === 0) {
        throw new Error(`No cached themes found. Please generate a theme first.`);
      }

      {
        // Interactive theme selection
        const themes = [];
        
        // Read all theme files and sort by creation time (newest first)
        for (const file of themeFiles) {
          try {
            const themePath = join(cacheDir, file);
            const themeContent = await readFile(themePath, "utf-8");
            const theme = JSON.parse(themeContent);
            
            if (theme?.name) {
              themes.push({
                name: theme.name,
                file: file,
                theme: theme,
                generatedAt: theme.metadata?.generatedAt || "Unknown",
                primaryColor: theme.light?.primary || "N/A",
                headingFont: theme.fonts?.heading?.fontFamily || "N/A",
                bodyFont: theme.fonts?.body?.fontFamily || "N/A"
              });
            }
          } catch {
            // Skip invalid theme files
          }
        }

        // Sort by generation time (newest first)
        themes.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

        if (themes.length === 0) {
          throw new Error(`No valid themes found in cache. Please generate a theme first.`);
        }

        // Create choices for interactive selection
        const choices = themes.map((theme, index) => ({
          name: `${index + 1}. ${theme.name} (${theme.primaryColor}) - ${theme.headingFont}/${theme.bodyFont}`,
          value: theme.name,
          description: `Generated: ${theme.generatedAt}`
        }));

        // Let user select a theme
        const selectedThemeName = await options.prompts.select({
          message: "Select a theme to apply:",
          choices: choices,
        });

        if (!selectedThemeName) {
          throw new Error("No theme selected");
        }

        // Find the selected theme
        const selectedTheme = themes.find(t => t.name === selectedThemeName);
        if (selectedTheme) {
          themeData = selectedTheme.theme;
        } else {
          throw new Error(`Selected theme "${selectedThemeName}" not found`);
        }
      }
    } catch (error) {
      if (error.message.includes("No cached themes") || error.message.includes("No valid themes")) {
        throw error;
      }
      throw new Error(`No cached themes found. Please generate a theme first.`);
    }

    // Validate theme data structure
    if (!themeData.name || !themeData.light || !themeData.dark || !themeData.fonts) {
      throw new Error(
        "Invalid theme data structure. Missing required fields: name, light, dark, fonts",
      );
    }

    // Read configuration file
    const configPath = config || join(process.cwd(), "aigne.yaml");
    const configContent = await readFile(configPath, "utf-8");

    // Parse YAML configuration
    const yaml = await import("yaml");
    const configData = yaml.parse(configContent);

    // Update theme information in configuration
    if (!configData.theme) {
      configData.theme = {};
    }

    configData.theme = {
      name: themeData.name,
      light: themeData.light,
      dark: themeData.dark,
      fonts: themeData.fonts,
      metadata: {
        ...themeData.metadata,
        appliedAt: new Date().toISOString(),
        appliedBy: "theme-apply-agent",
      },
    };

    // Save updated configuration
    const updatedConfigContent = yaml.stringify(configData, { indent: 2 });
    await writeFile(configPath, updatedConfigContent, "utf-8");

    return {
      success: true,
      message: `Theme "${themeData.name}" has been successfully applied to the configuration`,
      themeName: themeData.name,
      appliedAt: new Date().toISOString(),
      configPath: configPath,
      themeDetails: {
        primaryColor: themeData.light.primary,
        headingFont: themeData.fonts.heading.fontFamily,
        bodyFont: themeData.fonts.body.fontFamily,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to apply theme: ${error.message}`,
      error: error.message,
    };
  }
}

applyTheme.input_schema = {
  type: "object",
  properties: {
    config: {
      type: "string",
      description: "Path to configuration file",
    },
  },
};
