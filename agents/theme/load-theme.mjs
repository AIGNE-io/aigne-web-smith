import { promises as fs } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

export default async function loadTheme({ config, forceRegenerate, themeName }) {
  if (forceRegenerate) {
    console.log("Force regenerate requested, skipping theme cache.");
    return {
      loadThemeStatus: false,
      cachedTheme: null,
      shouldGenerate: true,
    };
  }

  try {
    const cacheDir = join(process.cwd(), ".aigne", "web-smith", "themes");
    
    // Try to load latest theme first
    const latestPath = join(cacheDir, "latest.yaml");
    
    try {
      await fs.access(latestPath);
      const content = await fs.readFile(latestPath, "utf-8");
      const cachedTheme = parse(content);
      
      // Check if theme matches current config
      if (cachedTheme.metadata && cachedTheme.metadata.configPath === config) {
        console.log(`Found cached theme: ${cachedTheme.name}`);
        console.log(`Generated at: ${cachedTheme.metadata.generatedAt}`);
        
        return {
          loadThemeStatus: true,
          cachedTheme,
          shouldGenerate: false,
          themePath: latestPath,
        };
      } else {
        console.log("Cached theme doesn't match current config, will regenerate.");
      }
    } catch {
      console.log("No cached theme found, will generate new theme.");
    }

    // If specific theme name requested, try to find it
    if (themeName) {
      try {
        const files = await fs.readdir(cacheDir);
        const themeFile = files.find(file => 
          file.startsWith(themeName) && file.endsWith('.yaml')
        );
        
        if (themeFile) {
          const themePath = join(cacheDir, themeFile);
          const content = await fs.readFile(themePath, "utf-8");
          const cachedTheme = parse(content);
          
          console.log(`Found specific theme: ${themeName}`);
          return {
            loadThemeStatus: true,
            cachedTheme,
            shouldGenerate: false,
            themePath,
          };
        }
      } catch (error) {
        console.log(`Error loading specific theme ${themeName}: ${error.message}`);
      }
    }

    return {
      loadThemeStatus: false,
      cachedTheme: null,
      shouldGenerate: true,
    };
  } catch (error) {
    console.error(`Error loading theme: ${error.message}`);
    return {
      loadThemeStatus: false,
      cachedTheme: null,
      shouldGenerate: true,
      error: error.message,
    };
  }
}

loadTheme.input_schema = {
  type: "object",
  properties: {
    config: {
      type: "string",
      description: "Path to configuration file",
    },
    forceRegenerate: {
      type: "boolean",
      description: "Force regenerate theme even if cached version exists",
      default: false,
    },
    themeName: {
      type: "string",
      description: "Specific theme name to load",
    },
  },
};

loadTheme.task_render_mode = "hide";
