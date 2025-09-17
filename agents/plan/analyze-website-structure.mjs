import { access } from "node:fs/promises";
import { join } from "node:path";
import { PAGE_FILE_EXTENSION } from "../../utils/constants.mjs";
import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";
import {
  getCurrentGitHead,
  getProjectInfo,
  hasFileChangesBetweenCommits,
  loadConfigFromFile,
  saveValueToConfig,
} from "../../utils/utils.mjs";

export default async function analyzeWebsiteStructure(
  { originalWebsiteStructure, feedback, lastGitHead, pagesDir, forceRegenerate, ...rest },
  options,
) {
  // Check if we need to regenerate structure plan
  let shouldRegenerate = false;
  let finalFeedback = feedback;
  let submittedFeedback = feedback;

  // Prompt for feedback if originalWebsiteStructure exists and no feedback provided
  if (originalWebsiteStructure && !feedback) {
    const userFeedback = await options.prompts.input({
      message: "Please provide feedback for website structure (press Enter to skip):",
    });

    if (userFeedback?.trim()) {
      finalFeedback = userFeedback.trim();
      submittedFeedback = userFeedback.trim();
    }
  }

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
    } else {
      // Check if there are relevant file changes since last generation
      const currentGitHead = getCurrentGitHead();
      if (currentGitHead && currentGitHead !== lastGitHead) {
        const hasChanges = hasFileChangesBetweenCommits(lastGitHead, currentGitHead);
        if (hasChanges) {
          // @FIXME: 临时禁用
          shouldRegenerate = false;
        }
      }
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

  const panningAgent = options.context.agents["generateWebsiteStructure"];

  // Get user preferences for structure planning and global scope
  const structureRules = getActiveRulesForScope("structure", []);
  const globalRules = getActiveRulesForScope("global", []);

  // Combine structure and global rules, extract only rule text
  const allApplicableRules = [...structureRules, ...globalRules];
  const ruleTexts = allApplicableRules.map((rule) => rule.rule);

  // Convert rule texts to string format for passing to the agent
  const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";

  const result = await options.context.invoke(panningAgent, {
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
          message = `\n### Auto-updated Project Info to \`.aigne/web-smith/config.yaml\`\n\n${message}\n\n`;
        }
      }
    } catch (error) {
      console.warn("Failed to check/save project information:", error.message);
    }
  }

  return {
    ...result,
    feedback: "", // clear feedback
    websiteStructureFeedback: submittedFeedback,
    projectInfoMessage: message,
    originalWebsiteStructure: originalWebsiteStructure
      ? originalWebsiteStructure
      : JSON.parse(JSON.stringify(result.websiteStructure || [])),
  };
}
analyzeWebsiteStructure.taskTitle = "Analyze website structure need generate or update";
