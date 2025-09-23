import { promises as fs } from "node:fs";
import { join } from "node:path";
import { stringify } from "yaml";

export default async function saveTheme({ theme, config, themeName }) {
  if (!theme) {
    console.warn("No theme data found to save.");
    return {
      saveThemeStatus: false,
      saveThemePath: null,
    };
  }

  try {
    // Create theme cache directory
    const cacheDir = join(process.cwd(), ".aigne", "web-smith", "themes");
    await fs.mkdir(cacheDir, { recursive: true });

    // Generate theme filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = themeName 
      ? `${themeName}-${timestamp}.yaml`
      : `${theme.name}-${timestamp}.yaml`;
    
    const filePath = join(cacheDir, filename);

    // Add metadata
    const themeWithMetadata = {
      ...theme,
      metadata: {
        ...theme.metadata,
        generatedAt: new Date().toISOString(),
        configPath: config,
        themeName: themeName || theme.name,
      }
    };

    // Save theme to file
    const content = stringify(themeWithMetadata, {
      aliasDuplicateObjects: false,
    });
    
    await fs.writeFile(filePath, content, "utf8");

    // Also save as latest theme for easy access
    const latestPath = join(cacheDir, "latest.yaml");
    await fs.writeFile(latestPath, content, "utf8");

    console.log(`Theme saved successfully: ${filePath}`);
    console.log(`Latest theme cached: ${latestPath}`);

    return {
      saveThemeStatus: true,
      saveThemePath: filePath,
      latestThemePath: latestPath,
      themeName: theme.name,
    };
  } catch (error) {
    console.error(`Error saving theme: ${error.message}`);
    return {
      saveThemeStatus: false,
      saveThemePath: null,
      error: error.message,
    };
  }
}

saveTheme.task_render_mode = "hide";
