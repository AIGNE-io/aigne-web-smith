import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import slugify from "slugify";
import { transliterate } from "transliteration";
import { parse } from "yaml";
import { DEFAULT_EXCLUDE_PATTERNS, WEB_SMITH_CONFIG_PATH } from "../../utils/constants.mjs";
import { findInvalidSourcePaths } from "../../utils/file-utils.mjs";
import { processConfigFields, resolveFileReferences, toDisplayPath } from "../../utils/utils.mjs";

export default async function loadConfig({ config, appUrl }) {
  const configPath = path.join(process.cwd(), config);

  try {
    // Check if config file exists
    await fs.access(configPath);
  } catch (_error) {
    console.log(
      `Config file not found: ${configPath}\nPlease run 'aigne web init' to create the config file.`,
    );
    throw new Error(`Config file not found: ${configPath}`);
  }

  try {
    // Read and parse YAML file
    const configContent = await fs.readFile(configPath, "utf-8");

    let parsedConfig = parse(configContent);

    // Resolve file references (@ prefixed values)
    parsedConfig = await resolveFileReferences(parsedConfig);

    if (appUrl) {
      parsedConfig.appUrl = appUrl.includes("://") ? appUrl : `https://${appUrl}`;
    }

    // ensure projectSlug is generated
    parsedConfig.projectSlug = slugify(
      transliterate(parsedConfig?.projectSlug || parsedConfig.projectName),
      {
        lower: true,
        strict: true,
      },
    );

    // collect locales
    const locales = Array.from(
      new Set([parsedConfig?.locale, ...(parsedConfig?.translateLanguages || [])]),
    ).filter(Boolean);

    // Parse new configuration fields and convert keys to actual content
    const processedConfig = processConfigFields(parsedConfig);

    // Validate sourcePaths against exclude patterns
    const sourcesPath = processedConfig.sourcesPath || parsedConfig.sourcesPath;
    if (sourcesPath) {
      const excludePatterns = [
        ...DEFAULT_EXCLUDE_PATTERNS,
        ...(processedConfig.excludePatterns || parsedConfig.excludePatterns || []),
      ];

      const invalidPaths = await findInvalidSourcePaths(sourcesPath, excludePatterns);
      if (invalidPaths.length > 0) {
        console.warn(
          `⚠️  Some source paths have been excluded and will not be processed:\n${invalidPaths
            .map((p) => `  - ${chalk.yellow(p)}`)
            .join("\n")}\n💡 Tip: You can remove these paths in ${toDisplayPath(configPath)}\n`,
        );
      }
    }

    return {
      lastGitHead: parsedConfig.lastGitHead || "",
      ...parsedConfig,
      ...processedConfig,
      locales,
    };
  } catch (error) {
    console.error(`Error parsing config file: ${error.message}`);
    throw new Error(`Failed to parse config file: ${error.message}`);
  }
}

loadConfig.input_schema = {
  type: "object",
  properties: {
    config: {
      type: "string",
      default: WEB_SMITH_CONFIG_PATH,
    },
    appUrl: {
      type: "string",
      description: "The application URL to override the configuration.",
    },
  },
};

loadConfig.task_render_mode = "hide";
