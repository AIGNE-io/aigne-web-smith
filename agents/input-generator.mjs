import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { stringify as yamlStringify } from "yaml";
import {
  getFilteredOptions,
  validateSelection,
} from "../utils/conflict-detector.mjs";
import {
  DEPTH_RECOMMENDATION_LOGIC,
  PAGE_CONTENT_DEPTH,
  PAGE_STYLES,
  PURPOSE_TO_KNOWLEDGE_MAPPING,
  READER_KNOWLEDGE_LEVELS,
  SUPPORTED_LANGUAGES,
  TARGET_AUDIENCES,
} from "../utils/constants.mjs";
import {
  detectSystemLanguage,
  getAvailablePaths,
  getProjectInfo,
  isGlobPattern,
  validatePath,
} from "../utils/utils.mjs";

// UI constants
const _PRESS_ENTER_TO_FINISH = "Press Enter to finish";

/**
 * Guide users through multi-turn dialogue to collect information and generate YAML configuration
 * @param {Object} params
 * @param {string} params.outputPath - Output file path
 * @param {string} params.fileName - File name
 * @returns {Promise<Object>}
 */
export default async function init(
  {
    outputPath = ".aigne/web-smith",
    fileName = "config.yaml",
    skipIfExists = false,
  },
  options
) {
  if (skipIfExists) {
    const filePath = join(outputPath, fileName);
    const configContent = await readFile(filePath, "utf8").catch(() => null);
    // Only skip if file exists AND has non-empty content
    if (configContent && configContent.trim() !== "") {
      return {};
    }
  }

  console.log("🚀 Welcome to AIGNE WebSmith!");
  console.log("Let's create your website page configuration.\n");

  // Collect user information
  const input = {};

  // 1. Primary purpose - what's the main outcome you want visitors to achieve?
  const purposeChoices = await options.prompts.checkbox({
    message:
      "📝 [1/8]: What is the primary goal for your website visitors? (Select all that apply)",
    choices: Object.entries(PAGE_STYLES)
      .filter(([key]) => key !== "custom") // Remove custom option for multiselect
      .map(([key, style]) => ({
        name: `${style.name}`,
        description: style.description,
        value: key,
      })),
    validate: (input) => {
      if (input.length === 0) {
        return "Please select at least one purpose.";
      }
      return validateSelection("pagePurpose", input);
    },
  });

  // Follow-up logic: If ONLY mixedPurpose selected, ask for priority ranking
  let prioritizedPurposes = purposeChoices;
  if (purposeChoices.length === 1 && purposeChoices.includes("mixedPurpose")) {
    const topPriorities = await options.prompts.checkbox({
      message: "🎯 Which is most important? (Select top 2 priorities)",
      choices: Object.entries(PAGE_STYLES)
        .filter(([key]) => key !== "custom" && key !== "mixedPurpose") // Filter out custom and mixedPurpose
        .map(([key, style]) => ({
          name: `${style.name}`,
          description: style.description,
          value: key,
        })),
      validate: (input) => {
        if (input.length === 0) {
          return "Please select at least one priority.";
        }
        if (input.length > 2) {
          return "Please select maximum 2 priorities.";
        }
        return true;
      },
    });

    // Replace mixedPurpose with selected priorities
    prioritizedPurposes = topPriorities;
  }

  // Save page purpose choices as keys
  input.pagePurpose = prioritizedPurposes;

  // 2. Target audience - who will be reading this most often?
  const audienceChoices = await options.prompts.checkbox({
    message: "👥 [2/8]: Who is the primary audience for these pages?",
    choices: Object.entries(TARGET_AUDIENCES)
      .filter(([key]) => key !== "custom") // Remove custom option for multiselect
      .map(([key, audience]) => ({
        name: `${audience.name}`,
        description: audience.description,
        value: key,
      })),
    validate: (input) => {
      if (input.length === 0) {
        return "Please select at least one audience.";
      }
      return validateSelection("targetAudienceTypes", input);
    },
  });

  // Save target audience choices as keys
  input.targetAudienceTypes = audienceChoices;

  // 3. Reader knowledge level - what do readers typically know when they arrive?
  // Determine default based on selected purposes using mapping
  const mappedPurpose = prioritizedPurposes.find(
    (purpose) => PURPOSE_TO_KNOWLEDGE_MAPPING[purpose]
  );
  const defaultKnowledge = mappedPurpose
    ? PURPOSE_TO_KNOWLEDGE_MAPPING[mappedPurpose]
    : null;

  // Filter knowledge level options based on previous selections
  const { filteredOptions: filteredKnowledgeOptions } = getFilteredOptions(
    "readerKnowledgeLevel",
    {
      pagePurpose: prioritizedPurposes,
      targetAudienceTypes: audienceChoices,
    },
    READER_KNOWLEDGE_LEVELS
  );

  const knowledgeChoice = await options.prompts.select({
    message:
      "🧠 [3/8]: What is your reader's typical starting knowledge level?",
    choices: Object.entries(filteredKnowledgeOptions).map(([key, level]) => ({
      name: `${level.name}`,
      description: level.description,
      value: key,
    })),
    default: defaultKnowledge,
  });

  // Save reader knowledge level choice as key
  input.readerKnowledgeLevel = knowledgeChoice;

  // 4. Page content depth - how comprehensive should the page content be?
  // Determine default based on priority: Purpose > Audience > Knowledge Level
  const getDepthDefault = () => {
    // Check priority order: purposes -> audiences -> knowledgeLevels
    const checks = [
      () => {
        const purpose = prioritizedPurposes.find(
          (p) => DEPTH_RECOMMENDATION_LOGIC.purposes[p]
        );
        return purpose ? DEPTH_RECOMMENDATION_LOGIC.purposes[purpose] : null;
      },
      () => {
        const audience = audienceChoices.find(
          (a) => DEPTH_RECOMMENDATION_LOGIC.audiences[a]
        );
        return audience ? DEPTH_RECOMMENDATION_LOGIC.audiences[audience] : null;
      },
      () => DEPTH_RECOMMENDATION_LOGIC.knowledgeLevels[knowledgeChoice] || null,
    ];

    return checks.find((check) => check())?.() || null;
  };

  const defaultDepth = getDepthDefault();

  // Filter page content depth options based on all previous selections
  const { filteredOptions: filteredDepthOptions } = getFilteredOptions(
    "pageContentDepth",
    {
      pagePurpose: prioritizedPurposes,
      targetAudienceTypes: audienceChoices,
      readerKnowledgeLevel: knowledgeChoice,
    },
    PAGE_CONTENT_DEPTH
  );

  const depthChoice = await options.prompts.select({
    message: "📊 [4/8]: How comprehensive should the page content be?",
    choices: Object.entries(filteredDepthOptions).map(([key, depth]) => ({
      name: `${depth.name}`,
      description: depth.description,
      value: key,
    })),
    default: defaultDepth,
  });

  // Save page content depth choice as key
  input.pageContentDepth = depthChoice;

  // 5. Language settings
  // Detect system language and use as default
  const systemLanguage = detectSystemLanguage();

  // Let user select primary language from supported list
  const primaryLanguageChoice = await options.prompts.select({
    message: "🌐 [5/8]: Choose primary page language:",
    choices: SUPPORTED_LANGUAGES.map((lang) => ({
      name: `${lang.label} - ${lang.sample}`,
      value: lang.code,
    })),
    default: systemLanguage,
  });

  input.locale = primaryLanguageChoice;

  // 6. Translation languages
  // Filter out the primary language from available choices
  const availableTranslationLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) => lang.code !== primaryLanguageChoice
  );

  const translateLanguageChoices = await options.prompts.checkbox({
    message: "🔄 [6/8]: Select translation languages:",
    choices: availableTranslationLanguages.map((lang) => ({
      name: `${lang.label} - ${lang.sample}`,
      value: lang.code,
    })),
  });

  input.translateLanguages = translateLanguageChoices;

  // 7. Page directory
  const pagesDirInput = await options.prompts.input({
    message: `📁 [7/8]: Where to save generated pages:`,
    default: `${outputPath}/pages`,
  });
  input.pagesDir = pagesDirInput.trim() || `${outputPath}/pages`;

  // 8. Source code paths
  console.log("\n🔍 [8/8]: Source Code Paths");
  console.log(
    "Enter paths to analyze for page generation (e.g., ./src, ./lib)"
  );
  console.log(
    "💡 You can also enter glob patterns (e.g., src/**/*.js, **/*.md)"
  );
  console.log("💡 If no paths are configured, './' will be used as default");

  const sourcePaths = [];
  while (true) {
    const selectedPath = await options.prompts.search({
      message: "Path or glob pattern:",
      source: async (input) => {
        if (!input || input.trim() === "") {
          return [
            {
              name: "",
              value: "",
              description: _PRESS_ENTER_TO_FINISH,
            },
          ];
        }

        const searchTerm = input.trim();

        // Search for matching files and folders in current directory
        const availablePaths = getAvailablePaths(searchTerm);

        // Also add option to use as glob pattern
        const options = [...availablePaths];

        // Check if input looks like a glob pattern
        const isGlobPatternResult = isGlobPattern(searchTerm);
        if (isGlobPatternResult) {
          // If it looks like a glob pattern, allow direct input
          options.push({
            name: searchTerm,
            value: searchTerm,
            description:
              "This input will be used as a glob pattern for file matching",
          });
        }

        return options;
      },
    });

    // Check if user chose to exit
    if (
      !selectedPath ||
      selectedPath.trim() === "" ||
      selectedPath === _PRESS_ENTER_TO_FINISH
    ) {
      break;
    }

    const trimmedPath = selectedPath.trim();

    // Check if it's a glob pattern
    const isGlobPatternResult = isGlobPattern(trimmedPath);

    if (isGlobPatternResult) {
      // For glob patterns, just add them without validation
      if (sourcePaths.includes(trimmedPath)) {
        console.log(`⚠️ Pattern already exists: ${trimmedPath}`);
        continue;
      }
      sourcePaths.push(trimmedPath);
    } else {
      // Use validatePath to check if path is valid for regular paths
      const validation = validatePath(trimmedPath);

      if (!validation.isValid) {
        console.log(`⚠️ ${validation.error}`);
        continue;
      }

      // Avoid duplicate paths
      if (sourcePaths.includes(trimmedPath)) {
        console.log(`⚠️ Path already exists: ${trimmedPath}`);
        continue;
      }

      sourcePaths.push(trimmedPath);
    }
  }

  // If no paths entered, use default
  input.sourcesPath = sourcePaths.length > 0 ? sourcePaths : ["./"];

  // Save project info to config
  const projectInfo = await getProjectInfo();
  input.projectName = projectInfo.name;
  input.projectDesc = projectInfo.description;
  input.projectLogo = projectInfo.icon;

  // Generate YAML content
  const yamlContent = generateYAML(input, outputPath);

  // Save file
  try {
    const filePath = join(outputPath, fileName);
    const dirPath = dirname(filePath);

    // Create directory if it doesn't exist
    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, yamlContent, "utf8");
    console.log(`\n🎉 Configuration saved to: ${chalk.cyan(filePath)}`);
    // Print YAML content for user review
    console.log(chalk.cyan("---"));
    console.log(chalk.cyan(yamlContent));
    console.log(chalk.cyan("---"));
    console.log(
      "💡 You can edit the configuration file anytime to modify settings.\n"
    );
    console.log(
      `🚀 Run ${chalk.cyan("'aigne web generate'")} to start page generation!\n`
    );

    return {};
  } catch (error) {
    console.error(`❌ Failed to save configuration file: ${error.message}`);
    return {
      inputGeneratorStatus: false,
      inputGeneratorError: error.message,
    };
  }
}

/**
 * Generate YAML configuration content
 * @param {Object} input - Input object
 * @returns {string} YAML string
 */
export function generateYAML(input) {
  // Create the main configuration object that will be safely serialized
  const config = {
    // Project information (safely handled by yaml library)
    projectName: input.projectName || "",
    projectDesc: input.projectDesc || "",
    projectLogo: input.projectLogo || "",

    // Page configuration
    pagePurpose: input.pagePurpose || [],
    targetAudienceTypes: input.targetAudienceTypes || [],
    readerKnowledgeLevel: input.readerKnowledgeLevel || "",
    pageContentDepth: input.pageContentDepth || "",

    // Custom rules and target audience (empty for user to fill)
    rules: "",
    targetAudience: "",

    // Language settings
    locale: input.locale || "en",
    translateLanguages:
      input.translateLanguages?.filter((lang) => lang.trim()) || [],

    // Paths
    pagesDir: input.pagesDir || "./aigne/web-smith/pages",
    sourcesPath: input.sourcesPath || [],
  };

  // Generate comments and structure
  let yaml = "# Project information for page publishing\n";

  // Serialize the project info section safely
  const projectSection = yamlStringify({
    projectName: config.projectName,
    projectDesc: config.projectDesc,
    projectLogo: config.projectLogo,
  }).trim();

  yaml += `${projectSection}\n\n`;

  // Add page configuration with comments
  yaml +=
    "# =============================================================================\n";
  yaml += "# Page Configuration\n";
  yaml +=
    "# =============================================================================\n\n";

  // Page Purpose with all available options
  yaml += "# Purpose: What's the main outcome you want readers to achieve?\n";
  yaml += "# Available options (uncomment and modify as needed):\n";
  Object.entries(PAGE_STYLES).forEach(([key, style]) => {
    if (key !== "custom") {
      yaml += `#   ${key.padEnd(16)} - ${style.name}: ${style.description}\n`;
    }
  });

  // Safely serialize pagePurpose
  const pagePurposeSection = yamlStringify({
    pagePurpose: config.pagePurpose,
  }).trim();
  yaml += `${pagePurposeSection.replace(/^pagePurpose:/, "pagePurpose:")}\n\n`;

  // Target Audience Types with all available options
  yaml += "# Target Audience: Who will be reading this most often?\n";
  yaml += "# Available options (uncomment and modify as needed):\n";
  Object.entries(TARGET_AUDIENCES).forEach(([key, audience]) => {
    if (key !== "custom") {
      yaml += `#   ${key.padEnd(16)} - ${audience.name}: ${
        audience.description
      }\n`;
    }
  });

  // Safely serialize targetAudienceTypes
  const targetAudienceTypesSection = yamlStringify({
    targetAudienceTypes: config.targetAudienceTypes,
  }).trim();
  yaml += `${targetAudienceTypesSection.replace(
    /^targetAudienceTypes:/,
    "targetAudienceTypes:"
  )}\n\n`;

  // Reader Knowledge Level with all available options
  yaml +=
    "# Reader Knowledge Level: What do readers typically know when they arrive?\n";
  yaml += "# Available options (uncomment and modify as needed):\n";
  Object.entries(READER_KNOWLEDGE_LEVELS).forEach(([key, level]) => {
    yaml += `#   ${key.padEnd(20)} - ${level.name}: ${level.description}\n`;
  });

  // Safely serialize readerKnowledgeLevel
  const readerKnowledgeLevelSection = yamlStringify({
    readerKnowledgeLevel: config.readerKnowledgeLevel,
  }).trim();
  yaml += `${readerKnowledgeLevelSection.replace(
    /^readerKnowledgeLevel:/,
    "readerKnowledgeLevel:"
  )}\n\n`;

  // Page Content Depth with all available options
  yaml +=
    "# Page Content Depth: How comprehensive should the page content be?\n";
  yaml += "# Available options (uncomment and modify as needed):\n";
  Object.entries(PAGE_CONTENT_DEPTH).forEach(([key, depth]) => {
    yaml += `#   ${key.padEnd(18)} - ${depth.name}: ${depth.description}\n`;
  });

  if (config.pageContentDepth) {
    // Safely serialize pageContentDepth
    const pageContentDepthSection = yamlStringify({
      pageContentDepth: config.pageContentDepth,
    }).trim();
    yaml += `${pageContentDepthSection.replace(
      /^pageContentDepth:/,
      "pageContentDepth:"
    )}\n\n`;
  }

  // Custom Page Rules and Requirements
  yaml +=
    "# Custom Rules: Define specific page generation rules and requirements\n";
  const rulesSection = yamlStringify({ rules: config.rules }).trim();
  // Use literal style for multiline strings
  yaml += `${rulesSection.replace(/rules: ''/, "rules: |\n  ")}\n\n`;

  // Target Audience Description
  yaml +=
    "# Target Audience: Describe your specific target audience and their characteristics\n";
  const targetAudienceSection = yamlStringify({
    targetAudience: config.targetAudience,
  }).trim();
  // Use literal style for multiline strings
  yaml += `${targetAudienceSection.replace(
    /targetAudience: ''/,
    "targetAudience: |\n  "
  )}\n\n`;

  // Glossary Configuration
  yaml += "# Glossary: Define project-specific terms and definitions\n";
  yaml +=
    '# glossary: "@glossary.md"  # Path to markdown file containing glossary definitions\n\n';

  // Language settings - safely serialize
  const localeSection = yamlStringify({ locale: config.locale }).trim();
  yaml += `${localeSection.replace(/^locale:/, "locale:")}\n`;

  // Translation languages
  if (config.translateLanguages.length > 0) {
    const translateLanguagesSection = yamlStringify({
      translateLanguages: config.translateLanguages,
    }).trim();
    yaml += `${translateLanguagesSection.replace(
      /^translateLanguages:/,
      "translateLanguages:"
    )}\n`;
  } else {
    yaml +=
      "# translateLanguages:  # List of languages to translate the pages to\n";
    yaml += "#   - zh  # Example: Chinese translation\n";
    yaml += "#   - en  # Example: English translation\n";
  }

  // Directory and source path configurations - safely serialize
  const pagesDirSection = yamlStringify({ pagesDir: config.pagesDir }).trim();
  yaml += `${pagesDirSection.replace(
    /^pagesDir:/,
    "pagesDir:"
  )}  # Directory to save generated pages\n`;

  const sourcesPathSection = yamlStringify({
    sourcesPath: config.sourcesPath,
  }).trim();
  yaml += `${sourcesPathSection.replace(
    /^sourcesPath:/,
    "sourcesPath:  # Source code paths to analyze"
  )}\n`;

  return yaml;
}

init.description =
  "Generate a configuration file for the page generation process";
