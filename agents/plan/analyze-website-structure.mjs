import { access } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { PAGE_FILE_EXTENSION, WEB_SMITH_CONFIG_PATH } from "../../utils/constants.mjs";
import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";
import {
  getProjectInfo,
  loadConfigFromFile,
  saveValueToConfig,
  validateWebsiteStructure,
} from "../../utils/utils.mjs";

export default async function analyzeWebsiteStructure(
  { originalWebsiteStructure, lastGitHead, pagesDir, forceRegenerate, locale, ...rest },
  options,
) {
  // Check if originalWebsiteStructure is empty and prompt user
  if (!originalWebsiteStructure) {
    const choice = await options.prompts.select({
      message:
        "Your project configuration is complete. Would you like to generate the website structure now?",
      choices: [
        {
          name: "Generate now - Start generating the website structure",
          value: "generate",
        },
        {
          name: "Review configuration first - Edit configuration before generating",
          value: "later",
        },
      ],
    });

    if (choice === "later") {
      console.log(`\nConfiguration file: ${chalk.cyan(WEB_SMITH_CONFIG_PATH)}`);
      console.log(
        "Review and edit your configuration as needed, then run 'aigne web generate' to continue.",
      );

      // In test environment, return a special result instead of exiting
      if (process.env.NODE_ENV === "test") {
        return {
          userDeferred: true,
          websiteStructure: null,
        };
      }

      process.exit(0);
    }
  }

  // Check if we need to regenerate structure plan
  let shouldRegenerate = false;
  let finalFeedback = "";

  // If no feedback and originalWebsiteStructure exists, check for git changes
  if (originalWebsiteStructure) {
    // If no lastGitHead, check if _sitemap file exists to determine if we should regenerate
    if (!lastGitHead) {
      try {
        // Check if _sitemap file exists in pagesDir
        const sitemapPath = join(pagesDir, `_sitemap${PAGE_FILE_EXTENSION}`);
        await access(sitemapPath);
        // If _sitemap file exists, it means last execution was completed, need to regenerate
        shouldRegenerate = true;
      } catch {
        // If _sitemap file doesn't exist, it means last execution was interrupted, no need to regenerate
        shouldRegenerate = false;
      }
    }

    // validate website structure to check if navigation is complete
    const validationResult = validateWebsiteStructure(originalWebsiteStructure, [locale]);

    if (!validationResult.isValid) {
      shouldRegenerate = true;
      const missingDetails = validationResult.missingLocales
        .map((item) => `- ${item.path}: missing ${item.missing.join(", ")}`)
        .join("\n");

      finalFeedback = `${finalFeedback ? `${finalFeedback}\n\n` : ""}Missing navigation in existing structure.\n${missingDetails}\nEnsure navigation exists for locale: ${locale}.`;

      shouldRegenerate = true;
    }

    if (shouldRegenerate) {
      finalFeedback = `
      ${finalFeedback || ""}
      
      Update website structure based on latest datasources:
        1. For new content, add new nodes or supplement existing nodes as needed
        2. Delete nodes only if all associated sourceIds are removed
      `;
    }
  }

  // user requested regeneration
  if (forceRegenerate) {
    shouldRegenerate = true;
    finalFeedback = `
    ${finalFeedback || ""}

    Force regeneration requested: regenerate based on latest datasources and user requirements, any modifications allowed.
    `;
  }

  // If no regeneration needed, return original structure plan
  if (originalWebsiteStructure && !finalFeedback && !shouldRegenerate) {
    return {
      websiteStructure: originalWebsiteStructure,
    };
  }

  // Get user preferences for structure planning and global scope
  const structureRules = getActiveRulesForScope("structure", []);
  const globalRules = getActiveRulesForScope("global", []);

  // Combine structure and global rules, extract only rule text
  const allApplicableRules = [...structureRules, ...globalRules];
  const ruleTexts = allApplicableRules.map((rule) => rule.rule);

  // Convert rule texts to string format for passing to the agent
  const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";

  const result = await options.context.invoke(options.context.agents["generateWebsiteStructure"], {
    feedback: finalFeedback || "",
    originalWebsiteStructure,
    userPreferences,
    ...rest,
  });

  let message = "";

  // Check and save project information if user hasn't modified it
  if (result.projectName || result.projectDesc) {
    try {
      const currentConfig = await loadConfigFromFile();
      const projectInfo = await getProjectInfo();

      // Check if user has modified project information
      const userModifiedProjectName =
        currentConfig?.projectName && currentConfig.projectName !== projectInfo.name;
      const userModifiedProjectDesc =
        currentConfig?.projectDesc && currentConfig.projectDesc !== projectInfo.description;

      // If user hasn't modified project info and it's not from GitHub, save AI output
      if (!userModifiedProjectName && !userModifiedProjectDesc) {
        let hasUpdated = false;
        // Don't update if the current info is from GitHub (meaningful repository info)
        if (
          result.projectName &&
          result.projectName !== projectInfo.name &&
          !projectInfo.fromGitHub
        ) {
          await saveValueToConfig("projectName", result.projectName);
          message += `Project name: \`${result.projectName}\``;
          hasUpdated = true;
        }

        if (
          result.projectDesc &&
          result.projectDesc !== projectInfo.description &&
          !projectInfo.fromGitHub
        ) {
          await saveValueToConfig("projectDesc", result.projectDesc);
          message += `\nProject description: \`${result.projectDesc}\``;
          hasUpdated = true;
        }

        if (hasUpdated) {
          message = `\n### Auto-updated Project Info to \`${WEB_SMITH_CONFIG_PATH}\`\n\n${message}\n\n`;
        }
      }
    } catch (error) {
      console.warn("Failed to check/save project information:", error.message);
    }
  }

  return {
    ...result,
    feedback: "", // clear feedback
    projectInfoMessage: message,
    originalWebsiteStructure: originalWebsiteStructure
      ? originalWebsiteStructure
      : JSON.parse(JSON.stringify(result.websiteStructure || [])),
  };
}
analyzeWebsiteStructure.taskTitle = "Analyze website structure need generate or update";
