import { rm } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { WEB_SMITH_ENV_FILE } from "../../utils/constants.mjs";
import { getMediaDescriptionCachePath } from "../../utils/file-utils.mjs";
import { pathExists, resolveToAbsolute, toDisplayPath } from "../../utils/utils.mjs";

const TARGET_METADATA = {
  workspace: {
    label: "workspace",
    description: ({ tmpDir }) =>
      `Delete website structure in './${toDisplayPath(tmpDir)}' (pages stays)`,
  },
  generatedPages: {
    label: "generated pages",
    description: ({ outputDir }) =>
      `Delete all generated pages in './${toDisplayPath(outputDir)}' (website structure stays)`,
  },
  websiteConfig: {
    label: "website configuration",
    description: ({ finalConfigPath }) =>
      `Delete the config.yaml file './${toDisplayPath(finalConfigPath)}'(requires 'aigne web init' to regenerate)`,
  },
  authTokens: {
    label: "authorizations",
    description: () =>
      `Delete authorization information in '${WEB_SMITH_ENV_FILE}' (requires re-authorization after clearing).`,
  },
  deploymentConfig: {
    label: "deployment config",
    description: ({ finalConfigPath }) =>
      `Delete appUrl from './${toDisplayPath(finalConfigPath)}'.`,
  },
  mediaDescription: {
    label: "media file descriptions",
    description: ({ mediaDescriptionPath }) =>
      `Delete AI-generated descriptions in './${toDisplayPath(mediaDescriptionPath)}' (will regenerate on next generation).`,
  },
};

const TARGET_KEYS = Object.keys(TARGET_METADATA);

function normalizeTarget(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (TARGET_METADATA[trimmed]) return trimmed;

  const lowerMatched = TARGET_KEYS.find((key) => key.toLowerCase() === trimmed.toLowerCase());
  return lowerMatched || null;
}

export default async function chooseContents(input = {}, options = {}) {
  const { targets: rawTargets, tmpDir, outputDir, pagesDir, configPath } = input;

  const derivedConfigPath = pagesDir ? resolvePath(pagesDir, "..", "config.yaml") : undefined;
  const finalConfigPath = configPath || derivedConfigPath;

  const workspaceCandidate = resolveToAbsolute(tmpDir);
  const generatedPagesCandidate = resolveToAbsolute(outputDir);
  const configCandidate = resolveToAbsolute(finalConfigPath);
  const mediaDescriptionPath = getMediaDescriptionCachePath();

  const targetsDefinition = {
    workspace: {
      path: workspaceCandidate,
      label: TARGET_METADATA.workspace.label,
      description: TARGET_METADATA.workspace.description,
    },
    generatedPages: {
      path: generatedPagesCandidate,
      label: TARGET_METADATA.generatedPages.label,
      description: TARGET_METADATA.generatedPages.description,
    },
    websiteConfig: {
      path: configCandidate,
      label: TARGET_METADATA.websiteConfig.label,
      description: TARGET_METADATA.websiteConfig.description,
    },
    deploymentConfig: {
      path: configCandidate,
      label: TARGET_METADATA.deploymentConfig.label,
      description: TARGET_METADATA.deploymentConfig.description,
    },
    authTokens: {
      path: WEB_SMITH_ENV_FILE,
      label: TARGET_METADATA.authTokens.label,
      description: TARGET_METADATA.authTokens.description,
    },
    mediaDescription: {
      path: mediaDescriptionPath,
      label: TARGET_METADATA.mediaDescription.label,
      description: TARGET_METADATA.mediaDescription.description,
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
    ? rawTargets.map(normalizeTarget).filter(Boolean)
    : [];

  let selectedTargets = [...new Set(normalizedTargets)];

  if (selectedTargets.length === 0) {
    if (options?.prompts?.checkbox) {
      const choices = Object.entries(targetsDefinition)
        .filter(([value, def]) => Boolean(def.path) && availableTargets[value])
        .map(([value, def]) => ({
          name: def.label,
          value,
          description: def.description({
            outputDir,
            tmpDir,
            finalConfigPath,
            mediaDescriptionPath,
          }),
        }));

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

  const results = [];
  let configCleared = false;

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

      if (target === "authTokens") {
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
      } else if (target === "deploymentConfig") {
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
      } else if (target === "mediaDescription") {
        const clearAgent = options.context?.agents?.["clearMediaDescription"];
        if (!clearAgent) {
          throw new Error("Clear agent clearMediaDescription not found in context");
        }

        const result = await options.context.invoke(clearAgent, input);

        results.push({
          status: result.error ? "error" : "removed",
          message: result.message,
          path: displayPath,
        });
      } else {
        await rm(targetPath, { recursive: true, force: true });

        if (target === "websiteConfig" && existed) {
          configCleared = true;
        }

        results.push({
          status: existed ? "removed" : "noop",
          message: existed
            ? `🧹 Cleared ${definition.label} (${displayPath})`
            : `📦 ${definition.label} already empty (${displayPath})`,
          path: displayPath,
        });
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

  const detailLines = results.map((item) => `- ${item.message}`).join("\n");

  const suggestions = [];
  if (configCleared) {
    suggestions.push("👉 Run `aigne web init` to generate a fresh configuration file.");
  }

  const message = [header, "", detailLines, suggestions.length ? "" : null, suggestions.join("\n")]
    .filter(Boolean)
    .join("\n");

  return {
    message: message,
  };
}

chooseContents.taskTitle = "Choose contents to clear";
