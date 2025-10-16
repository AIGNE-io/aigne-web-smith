import { rm } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";
import fastGlob from "fast-glob";

import { WEB_SMITH_ENV_FILE } from "../../utils/constants.mjs";
import { getMediaDescriptionCachePath, getTranslationCachePath } from "../../utils/file-utils.mjs";
import { pathExists, resolveToAbsolute, toDisplayPath } from "../../utils/utils.mjs";

export default async function chooseContents(input = {}, options = {}) {
  const { targets: rawTargets, tmpDir, outputDir, pagesDir, configPath } = input;

  const derivedConfigPath = pagesDir ? resolvePath(pagesDir, "..", "config.yaml") : undefined;
  const finalConfigPath = configPath || derivedConfigPath;

  const websiteStructureCandidate = resolveToAbsolute(join(tmpDir, "website-structure.yaml"));
  const generatedPagesCandidate = resolveToAbsolute(tmpDir);
  const configCandidate = resolveToAbsolute(finalConfigPath);
  const mediaDescriptionPath = getMediaDescriptionCachePath();
  const translationCachePath = getTranslationCachePath();

  const results = [];
  let configCleared = false;

  const targetsDefinition = {
    websiteStructure: {
      path: websiteStructureCandidate,
      label: "website structure",
      description: ({ tmpDir }) =>
        `Delete website structure in './${toDisplayPath(join(tmpDir, "website-structure.yaml"))}' (pages stays)`,
      onClear: async ({ displayPath, results, targetPath }) => {
        await rm(targetPath, { recursive: true, force: true });
        results.push({
          status: "removed",
          message: `🧹 Cleared ${displayPath}`,
          path: displayPath,
        });
      },
    },
    generatedPages: {
      path: generatedPagesCandidate,
      label: "generated pages",
      description: ({ tmpDir }) =>
        `Delete all generated pages in './${toDisplayPath(tmpDir)}' (website structure stays)`,
      onClear: async ({ results, targetPath, displayPath, definition }) => {
        // find targetPath without website-structure.yaml
        const targetDirs = fastGlob.sync(join(targetPath, "**"), {
          ignore: ["website-structure.yaml"],
          deep: 1,
          onlyDirectories: true,
        });

        if (!targetDirs?.length) {
          results.push({
            status: "noop",
            message: `📦 The ${definition.label} is already empty (${displayPath})`,
            path: displayPath,
          });
          return;
        }

        await Promise.all(
          targetDirs.map(async (dir) => {
            await rm(dir, { recursive: true, force: true });
            results.push({
              status: "removed",
              message: `🧹 Cleared ${toDisplayPath(dir)}`,
              path: toDisplayPath(dir),
            });
          }),
        );
      },
    },
    websiteConfig: {
      path: configCandidate,
      label: "website configuration",
      description: ({ finalConfigPath }) =>
        `Delete the config.yaml file './${toDisplayPath(finalConfigPath)}'(requires 'aigne web init' to regenerate)`,
      onClear: async ({ displayPath, results, targetPath }) => {
        configCleared = true;
        await rm(targetPath, { recursive: true, force: true });
        results.push({
          status: "removed",
          message: `🧹 Cleared ${displayPath}`,
          path: displayPath,
        });
      },
    },
    deploymentConfig: {
      path: configCandidate,
      label: "deployment config",
      description: ({ finalConfigPath }) =>
        `Delete appUrl from './${toDisplayPath(finalConfigPath)}'.`,
      onClear: async ({ displayPath, results }) => {
        const clearAgent = options.context?.agents?.["clearDeploymentConfig"];
        if (!clearAgent) {
          throw new Error("Clear agent clearDeploymentConfig not found in context");
        }

        const result = await options.context.invoke(clearAgent, input);

        results.push({
          status: result.error ? "error" : "removed",
          message: result.message,
          path: displayPath,
        });
      },
    },
    authTokens: {
      path: WEB_SMITH_ENV_FILE,
      label: "authorizations",
      description: () =>
        `Delete authorization information in '${WEB_SMITH_ENV_FILE}' (requires re-authorization after clearing).`,
      onClear: async ({ displayPath, results }) => {
        const clearAgent = options.context?.agents?.["clearAuthTokens"];
        if (!clearAgent) {
          throw new Error("Clear agent clearAuthTokens not found in context");
        }

        const result = await options.context.invoke(clearAgent, input);

        results.push({
          status: result.error ? "error" : "removed",
          message: result.message,
          path: displayPath,
        });
      },
    },
    mediaDescription: {
      path: mediaDescriptionPath,
      label: "media file descriptions",
      description: ({ mediaDescriptionPath }) =>
        `Delete AI-generated descriptions in './${toDisplayPath(mediaDescriptionPath)}' (will regenerate on next generation).`,
      onClear: async ({ displayPath, results }) => {
        const clearAgent = options.context?.agents?.["clearMediaDescription"];
        if (!clearAgent) {
          throw new Error(
            "Required agent 'clearMediaDescription' not found in context. Please ensure the agent is properly registered.",
          );
        }

        const result = await options.context.invoke(clearAgent, input);

        results.push({
          status: result.error ? "error" : "removed",
          message: result.message,
          path: displayPath,
        });
      },
    },
    translationCaches: {
      path: translationCachePath,
      label: "translation caches",
      description: () =>
        `Delete AI-generated caches in './${toDisplayPath(translationCachePath)}' (will regenerate on next publish).`,
      onClear: async ({ displayPath, results, targetPath }) => {
        await rm(targetPath, { recursive: true, force: true });

        results.push({
          status: "removed",
          message: `🧹 Cleared ${displayPath}`,
          path: displayPath,
        });
      },
    },
  };

  const availabilityEntries = await Promise.all(
    Object.entries(targetsDefinition).map(async ([key, def]) => {
      if (!def.path) return [key, false];
      const exists = await pathExists(def.path);
      return [key, exists];
    }),
  );
  const availableTargets = Object.fromEntries(availabilityEntries);
  const normalizedTargets = Array.isArray(rawTargets)
    ? rawTargets.map((target) => targetsDefinition[target]).filter(Boolean)
    : [];

  let selectedTargets = [...new Set(normalizedTargets)];

  if (selectedTargets.length === 0) {
    if (options?.prompts?.checkbox) {
      const choices = Object.entries(targetsDefinition)
        .filter(([value, def]) => Boolean(def.path) && availableTargets[value])
        .map(([value, def]) => {
          return {
            name: def.label,
            value,
            description: def.description({
              outputDir,
              tmpDir,
              finalConfigPath,
              mediaDescriptionPath,
            }),
          };
        });

      if (choices.length === 0) {
        return {
          message: "📦 No items are available to clear.",
        };
      }

      selectedTargets = await options.prompts.checkbox({
        message: "Select items to clear:",
        choices,
        validate: (answer) => (answer.length > 0 ? true : "Select at least one item."),
      });
    } else {
      selectedTargets = Object.entries(targetsDefinition)
        .filter(([value, def]) => Boolean(def.path) && availableTargets[value])
        .map(([value]) => value);

      if (selectedTargets.length === 0) {
        return {
          message: "📦 No items are available to clear.",
        };
      }
    }
  }

  selectedTargets = selectedTargets.filter((target) => {
    const definition = targetsDefinition[target];
    return Boolean(definition?.path) && availableTargets[target];
  });

  if (selectedTargets.length === 0) {
    return {
      message: "📦 No items are available to clear.",
    };
  }

  for (const target of selectedTargets) {
    const definition = targetsDefinition[target];
    const targetPath = definition.path;

    if (!targetPath) {
      results.push({
        status: "skip",
        message: `⚠️ Skipped ${definition.label} because no path is configured.`,
      });
      continue;
    }

    const displayPath = toDisplayPath(targetPath);

    try {
      const existed = await pathExists(targetPath);
      const onClear = definition.onClear;

      if (onClear) {
        await onClear({ displayPath, results, targetPath, existed, definition });
      }
    } catch (error) {
      results.push({
        status: "error",
        message: `❌ Failed to clear ${definition.label}: ${error.message}`,
        path: displayPath,
      });
    }
  }

  const hasError = results.some((item) => item.status === "error");
  const header = hasError ? "⚠️ Cleanup finished with some issues." : "✅ Cleanup successfully!";

  const detailLines = results.map((item) => `   ${item.message}`).join("\n");

  const suggestions = [];
  if (configCleared) {
    suggestions.push("👉 Run `aigne web init` to generate a fresh configuration file.");
  }

  const message = [
    header,
    "\n",
    detailLines,
    suggestions.length ? "" : null,
    suggestions.join("\n"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    message: message,
  };
}

chooseContents.taskTitle = "Choose contents to clear";
