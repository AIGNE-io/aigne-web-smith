import { readFile, writeFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import yaml from "yaml";
import { pathExists, resolveToAbsolute, toDisplayPath } from "../../utils/utils.mjs";

const title = 'Deployment Config'

export default async function clearDeploymentConfig(input = {}) {
  const { pagesDir, configPath } = input;

  // Determine config file path
  const derivedConfigPath = pagesDir ? resolvePath(pagesDir, "..", "config.yaml") : undefined;
  const finalConfigPath = configPath || derivedConfigPath;

  if (!finalConfigPath) {
    return {
      message: `📦 ${title}\n  • No config file path specified. No need to clear appUrl.`,
    };
  }

  const configFilePath = resolveToAbsolute(finalConfigPath);
  const displayPath = toDisplayPath(configFilePath);

  try {
    // Check if config file exists
    const exists = await pathExists(configFilePath);
    if (!exists) {
      return {
        message: `📦 ${title}\n  • Config file not found (${displayPath}). No need to clear appUrl.`,
      };
    }

    // Remove appUrl field while preserving comments
    const configContent = await readFile(configFilePath, "utf-8");
    const doc = yaml.parseDocument(configContent);

    if (doc.has("appUrl")) {
      doc.delete("appUrl");
      await writeFile(
        configFilePath,
        doc.toString({
          keepSourceTokens: true,
          indent: 2,
          lineWidth: 0,
          minContentWidth: 0,
        }),
        "utf-8",
      );
    }

    return {
      message: `📦 ${title}\n  ✔ Cleared appUrl from config file (${displayPath})`,
    };
  } catch (error) {
    return {
      error: true,
      message: `⚠️ ${title}\n  ✗ Failed to clear deployment config: ${error.message}`,
    };
  }
}

clearDeploymentConfig.taskTitle = "Clear deployment configuration";
