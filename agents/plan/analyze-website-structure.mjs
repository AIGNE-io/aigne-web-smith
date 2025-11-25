import { access } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { PAGE_FILE_EXTENSION, WEB_SMITH_CONFIG_PATH } from "../../utils/constants.mjs";
import { getCoverImagePath } from "../../utils/file-utils.mjs";
import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";
import {
  getProjectInfo,
  loadConfigFromFile,
  saveValueToConfig,
  toRelativePath,
  validateProjectDesc,
  validateProjectName,
  validateWebsiteStructure,
} from "../../utils/utils.mjs";

export default async function analyzeWebsiteStructure(
  { originalWebsiteStructure, lastGitHead, pagesDir, forceRegenerate, locale, projectCover, ...rest },
  options,
) {
  // Helper function to check and streamline navigation items
  async function streamlineNavigationIfNeeded(websiteStructure) {
    if (!websiteStructure || !Array.isArray(websiteStructure)) {
      return;
    }

    const itemsNeedingStreamline = websiteStructure.filter(
      (item) =>
        item.navigation &&
        (item.navigation.title?.length > 18 || item.navigation.description?.length > 40),
    );

    if (itemsNeedingStreamline.length > 0) {
      const navigationList = itemsNeedingStreamline.map((item) => ({
        path: item.path,
        title: item.navigation.title,
        description: item.navigation.description,
      }));

      const streamlineResult = await options.context.invoke(
        options.context.agents["navigationStreamline"],
        {
          navigationList,
        },
      );

      // Update the navigation items with streamlined versions using path as the key
      if (streamlineResult.navigationList && Array.isArray(streamlineResult.navigationList)) {
        const streamlineMap = new Map(
          streamlineResult.navigationList.map((item) => [item.path, item]),
        );

        for (const item of websiteStructure) {
          const streamlined = streamlineMap.get(item.path);
          if (streamlined && item.navigation) {
            item.navigation.title = streamlined.title;
            item.navigation.description = streamlined.description;
          }
        }
      }
    }
  }

  // Check if originalWebsiteStructure is empty and prompt user
  if (!originalWebsiteStructure) {
    const choice = await options.prompts.select({
      message: "Project configured successfully. Generate the website structure now?",
      choices: [
        {
          name: "Yes, generate now",
          value: "generate",
        },
        {
          name: "No, review configuration first",
          value: "later",
        },
      ],
    });

    if (choice === "later") {
      console.log(`\nConfiguration file: ${chalk.cyan(WEB_SMITH_CONFIG_PATH)}`);
      console.log(
        "Review and edit your configuration as needed, then run `aigne web generate` to continue.",
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

  // Check if a cover image already exists.
  const coverPath = getCoverImagePath(projectCover);
  let coverExists = false;
  try {
    await access(coverPath);
    coverExists = true;
  } catch {
    // Cover does not exist.
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
      
      Update website structure based on the latest data sources:
        1. For new content, add new nodes or supplement existing nodes as needed.
        2. Delete nodes only if all associated source IDs are removed.
      `;
    }
  }

  // user requested regeneration
  if (forceRegenerate) {
    shouldRegenerate = true;
    finalFeedback = `
    ${finalFeedback || ""}

    Force regeneration requested: regenerate based on the latest data sources and user requirements, allowing any modifications.
    `;
  }

  // Check if cover image exists
  if (!coverExists) {
    shouldRegenerate = true;
    finalFeedback = `
    ${finalFeedback || ""}

    Cover image does not exist. Generate a cover image prompt based on the project info.
    `;
  }

  // If no regeneration is needed, return the original structure plan.
  if (originalWebsiteStructure && !finalFeedback && !shouldRegenerate) {
    // Check and streamline navigation items for existing structure to handle legacy data
    await streamlineNavigationIfNeeded(originalWebsiteStructure);

    return {
      websiteStructure: originalWebsiteStructure,
    };
  }

  // Get user preferences for structure planning and the global scope.
  const structureRules = getActiveRulesForScope("structure", []);
  const globalRules = getActiveRulesForScope("global", []);

  // Combine structure and global rules, extracting only the rule text.
  const allApplicableRules = [...structureRules, ...globalRules];
  const ruleTexts = allApplicableRules.map((rule) => rule.rule);

  // Convert rule texts to string format for passing to the agent.
  const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";

  const result = await options.context.invoke(options.context.agents["generateWebsiteStructure"], {
    feedback: finalFeedback || "",
    originalWebsiteStructure,
    userPreferences,
    ...rest,
  });

  // Check and streamline navigation items for both new and existing results
  await streamlineNavigationIfNeeded(result.websiteStructure);

  let message = "";

  // Check and save project information if the user has not modified it.
  if (result.projectName || result.projectDesc) {
    try {
      const currentConfig = await loadConfigFromFile();
      const projectInfo = await getProjectInfo();

      // Check if the user has modified project information.
      const userModifiedProjectName =
        currentConfig?.projectName && currentConfig.projectName !== projectInfo.name;
      const userModifiedProjectDesc =
        currentConfig?.projectDesc && currentConfig.projectDesc !== projectInfo.description;

      // If the user has not modified project info and it's not from GitHub, save AI output.
      if (!userModifiedProjectName && !userModifiedProjectDesc) {
        let hasUpdated = false;
        // Do not update if the current info is from GitHub (meaningful repository information).
        if (
          result.projectName &&
          result.projectName !== projectInfo.name &&
          !projectInfo.fromGitHub
        ) {
          const nameValidation = validateProjectName(result.projectName);
          if (nameValidation.isValid) {
            await saveValueToConfig("projectName", nameValidation.value);
            message += `Project name: \`${nameValidation.value}\``;
            hasUpdated = true;
          } else {
            console.warn(chalk.yellow(`⚠️  ${nameValidation.warning}`));
            // Still save the value but warn the user
            await saveValueToConfig("projectName", nameValidation.value);
            message += `Project name: \`${nameValidation.value}\` ⚠️ (exceeds 40 character limit)`;
            hasUpdated = true;
          }
        }

        if (
          result.projectDesc &&
          result.projectDesc !== projectInfo.description &&
          !projectInfo.fromGitHub
        ) {
          const descValidation = validateProjectDesc(result.projectDesc);
          if (descValidation.isValid) {
            await saveValueToConfig("projectDesc", descValidation.value);
            message += `\nProject description: \`${descValidation.value}\``;
            hasUpdated = true;
          } else {
            console.warn(chalk.yellow(`⚠️  ${descValidation.warning}`));
            // Still save the value but warn the user
            await saveValueToConfig("projectDesc", descValidation.value);
            message += `\nProject description: \`${descValidation.value}\` ⚠️ (exceeds 160 character limit)`;
            hasUpdated = true;
          }
        }

        if (hasUpdated) {
          message = `\n### Auto-updated Project Info to \`${WEB_SMITH_CONFIG_PATH}\`\n\n${message}\n\n`;
        }
      }
    } catch (error) {
      console.warn("Failed to check/save project information:", error.message);
    }
  }

  // Check and generate a cover image if needed.
  if (result.projectCoverPrompt) {
    // Generate a cover if it does not exist.
    if (!coverExists) {
      try {
        const coverResult = await options.context.invoke(options.context.agents["generateCoverTeam"], {
          aiPrompt: result.projectCoverPrompt,
        });

        // Save the actual path returned by the cover generation
        if (coverResult.savedPath) {
          await saveValueToConfig("projectCover", toRelativePath(coverResult.savedPath));
        }
      } catch (error) {
        console.warn("Failed to generate cover image:", error.message);
      }
    }
  }

  return {
    ...result,
    feedback: "", // Clear feedback.
    projectInfoMessage: message,
    // Update originalWebsiteStructure.
    originalWebsiteStructure: JSON.parse(JSON.stringify(result.websiteStructure || [])),
  };
}
analyzeWebsiteStructure.taskTitle = "Analyze website structure need generate or update";
