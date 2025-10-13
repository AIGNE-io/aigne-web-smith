import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import chalk from "chalk";
import slugify from "slugify";
import { transliterate } from "transliteration";
import { stringify as yamlStringify } from "yaml";
import { validateSelection } from "../../utils/conflict-detector.mjs";
import {
  PAGE_STYLES,
  SCALE_RECOMMENDATION_LOGIC,
  SUPPORTED_LANGUAGES,
  TARGET_AUDIENCES,
  WEB_SMITH_DIR,
  WEBSITE_SCALE,
} from "../../utils/constants.mjs";
import {
  detectSystemLanguage,
  getAvailablePaths,
  getPagePurpose,
  getProjectInfo,
  getTargetAudienceTypes,
  isGlobPattern,
  validatePath,
} from "../../utils/utils.mjs";
import { listContentRelevantFiles } from "../utils/datasource.mjs";

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
  { outputPath = WEB_SMITH_DIR, fileName = "config.yaml", skipIfExists = false },
  options,
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
  console.log("Let's create your website configuration.\n");

  // Collect user information
  const input = {};

  // 1. Primary purpose - what type of website are you building?
  const purposeChoices = await options.prompts.checkbox({
    message: "📝 [1/8]: What type of website are you building? (Select all that apply)",
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

  // 2. Target audience - who will visit your website most often?
  const audienceChoices = await options.prompts.checkbox({
    message: "👥 [2/8]: Who is the primary audience for your website?",
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

  // 3. Website scale - how many pages should be generated?
  // Determine default based on priority: Purpose > Audience
  const getScaleDefault = () => {
    // Check priority order: purposes -> audiences
    const checks = [
      () => {
        const purpose = prioritizedPurposes.find((p) => SCALE_RECOMMENDATION_LOGIC.purposes[p]);
        return purpose ? SCALE_RECOMMENDATION_LOGIC.purposes[purpose] : null;
      },
      () => {
        const audience = audienceChoices.find((a) => SCALE_RECOMMENDATION_LOGIC.audiences[a]);
        return audience ? SCALE_RECOMMENDATION_LOGIC.audiences[audience] : null;
      },
    ];

    return checks.find((check) => check())?.() || "standard";
  };

  const defaultScale = getScaleDefault();

  const scaleChoice = await options.prompts.select({
    message: "📊 [3/8]: How many pages should your website have?",
    choices: Object.entries(WEBSITE_SCALE).map(([key, scale]) => ({
      name: `${scale.name}`,
      description: scale.description,
      value: key,
    })),
    default: defaultScale,
  });

  // Save website scale choice as key
  input.websiteScale = scaleChoice;

  // 4. Language settings
  // Detect system language and use as default
  const systemLanguage = detectSystemLanguage();

  // Let user select primary language from supported list
  const primaryLanguageChoice = await options.prompts.select({
    message: "🌐 [4/8]: Choose primary website language:",
    choices: SUPPORTED_LANGUAGES.map((lang) => ({
      name: `${lang.label} - ${lang.sample}`,
      value: lang.code,
    })),
    default: systemLanguage,
  });

  input.locale = primaryLanguageChoice;

  // 5. Translation languages
  // Filter out the primary language from available choices
  const availableTranslationLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) => lang.code !== primaryLanguageChoice,
  );

  const translateLanguageChoices = await options.prompts.checkbox({
    message: "🔄 [5/8]: Select translation languages:",
    choices: availableTranslationLanguages.map((lang) => ({
      name: `${lang.label} - ${lang.sample}`,
      value: lang.code,
    })),
  });

  input.translateLanguages = translateLanguageChoices;

  // 6. Website pages directory
  const pagesDirInput = await options.prompts.input({
    message: `📁 [6/8]: Where to save generated website pages:`,
    default: `${outputPath}/pages`,
  });
  input.pagesDir = pagesDirInput.trim() || `${outputPath}/pages`;

  // 7. Source code paths
  console.log("\n📁 [7/8]: DataSource Paths");
  console.log(
    "Enter paths to include as dataSource for website generation (e.g., ./docs, ./content)",
  );
  console.log("💡 You can use glob patterns like docs/**/*.md");
  console.log(
    "💡 If no paths provided, we will suggest source paths based on the working directory",
  );

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
            description: "This input will be used as a glob pattern for file matching",
          });
        }

        return options;
      },
    });

    // Check if user chose to exit
    if (!selectedPath || selectedPath.trim() === "" || selectedPath === _PRESS_ENTER_TO_FINISH) {
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

  // If no paths entered, automatically suggest source paths
  if (sourcePaths.length === 0 || (sourcePaths.length === 1 && sourcePaths[0] === "./")) {
    const relevantFiles = await listContentRelevantFiles(process.cwd());
    if (relevantFiles.length > 0) {
      const suggestSourcePathAgent = options.context.agents["suggestSourcePath"];
      const result = await options.context.invoke(suggestSourcePathAgent, {
        sourceFiles: relevantFiles.map((file) => `- ${file.path}`).join("\n"),
        pagePurpose: getPagePurpose(prioritizedPurposes).join("\n"),
        targetAudienceTypes: getTargetAudienceTypes(audienceChoices).join("\n"),
        maxFiles: 50,
      });
      const selectedFiles = result.selectedFiles.map((file) => file.path);
      const finalSelectedFiles = await options.prompts.checkbox({
        message: "Review the suggested source paths:",
        choices: selectedFiles.map((file) => ({
          name: `${file}`,
          value: file,
        })),
        validate: (input) => {
          if (input.length === 0) {
            return "Please select at least one source path.";
          }
          return true;
        },
      });
      input.sourcesPath = finalSelectedFiles;
    } else {
      console.log(
        "⚠️ Seems we've got an empty directory, will use the entire directory as datasource.",
      );
      input.sourcesPath = ["./"];
    }
  } else {
    input.sourcesPath = sourcePaths.filter((path) => path !== "./");
  }

  // 8. Custom rules - any specific requirements for the website?
  const rulesInput = await options.prompts.input({
    message:
      "📋 [8/8]: Any custom rules or requirements for your website? (Optional, press Enter to skip)",
    default: "",
  });
  input.rules = rulesInput.trim();

  // Save project info to config
  const projectInfo = await getProjectInfo();
  input.projectName = projectInfo.name;
  input.projectDesc = projectInfo.description;
  input.projectLogo = projectInfo.icon;
  input.projectId = projectInfo.id;
  // Generate slug from project name using transliteration and slugify
  input.projectSlug = input.projectName
    ? slugify(transliterate(input.projectName), { lower: true, strict: true })
    : "";

  // Generate YAML content
  const yamlContent = generateYAML(input);

  // Save file
  try {
    const filePath = join(outputPath, fileName);
    const dirPath = dirname(filePath);

    // Create directory if it doesn't exist
    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, yamlContent, "utf8");
    // Print YAML content for user review
    console.log(chalk.cyan("----"));
    console.log(chalk.cyan(yamlContent));
    console.log(chalk.cyan("----"));
    console.log(`🎉 Configuration saved to: ${chalk.cyan(filePath)}`);
    console.log("💡 You can edit the configuration file anytime to modify settings.");
    console.log(`🚀 Run ${chalk.cyan("'aigne web generate'")} to start website generation!\n`);

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
    projectId: input.projectId || crypto.randomUUID(),
    projectSlug: input.projectSlug || "",

    // Page configuration
    pagePurpose: input.pagePurpose || [],
    targetAudienceTypes: input.targetAudienceTypes || [],
    websiteScale: input.websiteScale || "",

    // Custom rules and target audience (empty for user to fill)
    rules: input.rules || "",

    // Language settings
    locale: input.locale || "en",
    translateLanguages: input.translateLanguages?.filter((lang) => lang.trim()) || [],

    // Paths
    pagesDir: input.pagesDir || "./aigne/web-smith/pages",
    sourcesPath: input.sourcesPath || [],

    // Default datasources to include in every page
    defaultDatasources: input.defaultDatasources || ["./media.md"],

    media: {
      // Image filtering settings
      minImageWidth: input.minImageWidth || 800,
    },
  };

  // Generate comments and structure
  let yaml = "# Project information for page publishing\n";

  // Serialize the project info section safely
  const projectSection = yamlStringify({
    projectName: config.projectName,
    projectDesc: config.projectDesc,
    projectLogo: config.projectLogo,
    projectId: config.projectId,
    projectSlug: config.projectSlug,
  }).trim();

  yaml += `${projectSection}\n\n`;

  // Add page configuration with comments
  yaml += "# =============================================================================\n";
  yaml += "# Website Configuration\n";
  yaml += "# =============================================================================\n\n";

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
      yaml += `#   ${key.padEnd(16)} - ${audience.name}: ${audience.description}\n`;
    }
  });

  // Safely serialize targetAudienceTypes
  const targetAudienceTypesSection = yamlStringify({
    targetAudienceTypes: config.targetAudienceTypes,
  }).trim();
  yaml += `${targetAudienceTypesSection.replace(/^targetAudienceTypes:/, "targetAudienceTypes:")}\n\n`;

  // Website Scale with all available options
  yaml += "# Website Scale: How many pages should your website have?\n";
  yaml += "# Available options (uncomment and modify as needed):\n";
  Object.entries(WEBSITE_SCALE).forEach(([key, scale]) => {
    yaml += `#   ${key.padEnd(18)} - ${scale.name}: ${scale.description}\n`;
  });

  if (config.websiteScale) {
    // Safely serialize websiteScale
    const websiteScaleSection = yamlStringify({
      websiteScale: config.websiteScale,
    }).trim();
    yaml += `${websiteScaleSection.replace(/^websiteScale:/, "websiteScale:")}\n\n`;
  }

  // Custom Page Rules and Requirements
  yaml += "# Custom Rules: Define specific page generation rules and requirements\n";
  const rulesSection = yamlStringify({ rules: config.rules }).trim();
  yaml += `${rulesSection}\n\n`;

  // Glossary Configuration
  yaml += "# Glossary: Define project-specific terms and definitions\n";
  yaml += '# glossary: "@glossary.md"  # Path to markdown file containing glossary definitions\n\n';

  // Language settings - safely serialize
  const localeSection = yamlStringify({ locale: config.locale }).trim();
  yaml += `${localeSection.replace(/^locale:/, "locale:")}\n`;

  // Translation languages
  if (config.translateLanguages.length > 0) {
    const translateLanguagesSection = yamlStringify({
      translateLanguages: config.translateLanguages,
    }).trim();
    yaml += `${translateLanguagesSection.replace(/^translateLanguages:/, "translateLanguages:")}\n`;
  } else {
    yaml += "# translateLanguages:  # List of languages to translate the pages to\n";
    yaml += "#   - zh  # Example: Chinese translation\n";
    yaml += "#   - en  # Example: English translation\n";
  }

  // Directory and source path configurations - safely serialize
  const pagesDirSection = yamlStringify({ pagesDir: config.pagesDir }).trim();
  yaml += `${pagesDirSection.replace(/^pagesDir:/, "pagesDir:")}  # Directory to save generated pages\n`;

  const sourcesPathSection = yamlStringify({
    sourcesPath: config.sourcesPath,
  }).trim();
  yaml += `${sourcesPathSection.replace(/^sourcesPath:/, "sourcesPath:  # Source code paths to analyze")}\n`;

  // Default datasources included in every page
  const defaultDatasourcesSection = yamlStringify({
    defaultDatasources: config.defaultDatasources,
  }).trim();
  yaml += `${defaultDatasourcesSection.replace(/^defaultDatasources:/, "defaultDatasources:  # Default datasources included in every page")}\n`;

  // Image filtering settings
  const mediaInfoSection = yamlStringify({
    media: config.media,
  }).trim();
  yaml += `# minImageWidth: Only images wider than this value (in pixels) will be used in page generation\n${mediaInfoSection}\n`;

  return yaml;
}

init.description = "Generate a configuration file for the website generation process";
init.task_title = "Generate website configuration";
