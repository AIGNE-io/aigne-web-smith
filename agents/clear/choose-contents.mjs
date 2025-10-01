import { rm } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { pathExists, resolveToAbsolute, toDisplayPath } from "../../utils/utils.mjs";

const TARGET_METADATA = {
  workspace: {
    label: "workspace",
    description: "Remove workspace such as website structure before regenerating.",
  },
  generatedPages: {
    label: "generated pages",
    description: "Remove previously generated pages.",
  },
  websiteConfig: {
    label: "website configuration",
    description: "Remove website configuration, you need to re-run 'aigne web init' again.",
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
          description: def.description,
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
