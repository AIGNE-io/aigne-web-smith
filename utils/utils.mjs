import { execSync } from "node:child_process";
import crypto from "node:crypto";
import {
  accessSync,
  constants,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import fs from "node:fs/promises";
import path, { isAbsolute, join, relative, resolve as resolvePath } from "node:path";
import slugify from "slugify";
import { transliterate } from "transliteration";
import { parse, stringify as yamlStringify } from "yaml";
import { z } from "zod";
import {
  detectResolvableConflicts,
  generateConflictResolutionRules,
} from "./conflict-detector.mjs";
import {
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_INCLUDE_PATTERNS,
  LIST_KEY,
  PAGE_FILE_EXTENSION,
  PAGE_STYLES,
  PAGES_OUTPUT_DIR,
  PAGES_TMP_DIR,
  SUPPORTED_FILE_EXTENSIONS,
  SUPPORTED_LANGUAGES,
  TARGET_AUDIENCES,
  WEB_SMITH_DIR,
  WEBSITE_SCALE,
} from "./constants.mjs";
import { extractContentFields } from "./generate-helper.mjs";

const pageDetailMetaSchema = z
  .object({
    title: z.string().min(1, "meta.title is required"),
    description: z.string().min(1, "meta.description is required"),
  })
  .catchall(z.unknown());

const pageDetailSectionSchema = z
  .object({
    sectionName: z.string().min(1, "sections[].sectionName is required"),
    sectionSummary: z
      .string()
      .min(1, "sections[].sectionSummary must be a non-empty string")
      .optional(),
  })
  .catchall(z.unknown());

const pageDetailSchema = z
  .object({
    meta: pageDetailMetaSchema,
    sections: z.array(pageDetailSectionSchema).min(1, "sections must contain at least one section"),
  })
  .catchall(z.unknown());

function normalizeFieldList(fields = []) {
  return Array.from(
    new Set((fields || []).filter((field) => typeof field === "string" && field.length > 0)),
  ).sort();
}

function stripNumericSegments(field) {
  return field
    .split(".")
    .filter((segment) => !/^\d+$/.test(segment))
    .join(".");
}

function hasNumericSegment(field) {
  return field.split(".").some((segment) => /^\d+$/.test(segment));
}

function collapseFieldAfterFirstNumeric(field) {
  const segments = field.split(".");
  const firstNumericIndex = segments.findIndex((segment) => /^\d+$/.test(segment));
  if (firstNumericIndex <= 0) {
    return field;
  }

  return segments.slice(0, firstNumericIndex).join(".");
}

function buildFieldCombinationIndex(componentLibrary = []) {
  if (!Array.isArray(componentLibrary) || componentLibrary.length === 0) {
    return null;
  }

  const byKey = new Map();
  const entries = [];

  componentLibrary.forEach((component) => {
    if (!component || component.type !== "composite") return;
    const comboFields = normalizeFieldList(component.fieldCombinations || []);
    if (comboFields.length === 0) return;

    const key = comboFields.join("|");
    let entry = byKey.get(key);
    if (!entry) {
      entry = {
        key,
        fields: comboFields,
        fieldSet: new Set(comboFields),
        components: new Set(),
      };
      byKey.set(key, entry);
      entries.push(entry);
    }

    const componentName = component.name || component.id || "unknown";
    entry.components.add(componentName);
  });

  return entries.length > 0 ? { byKey, entries } : null;
}

function findClosestFieldCombination(fields, index, { requireSuperset = false } = {}) {
  if (!index || index.entries.length === 0) {
    return null;
  }

  const sourceSet = new Set(fields);
  let bestMatch = null;

  index.entries.forEach((entry) => {
    const allowedSet = entry.fieldSet || new Set(entry.fields);
    const extra = fields.filter((field) => !allowedSet.has(field));
    if (requireSuperset && extra.length > 0) {
      return;
    }

    const missing = entry.fields.filter((field) => !sourceSet.has(field));
    const penalty = requireSuperset ? missing.length : extra.length + missing.length;

    if (!bestMatch || penalty < bestMatch.penalty) {
      bestMatch = {
        entry,
        extra,
        missing,
        penalty,
      };
    }
  });

  return bestMatch;
}

function validateSectionFieldCombination({ section, sectionPath, index, errors, existingKeys }) {
  if (!section || typeof section !== "object" || Array.isArray(section) || !index) {
    return;
  }

  const fields = normalizeFieldList(extractContentFields(section));
  const normalizedIndexFreeFields = new Set(fields.map(stripNumericSegments));
  if (fields.length > 0) {
    const key = fields.join("|");
    let matchingEntry = index.byKey?.get(key);

    if (!matchingEntry) {
      const collapsedFields = normalizeFieldList(
        fields.map((field) => collapseFieldAfterFirstNumeric(field)).filter(Boolean),
      );
      const collapsedKey = collapsedFields.join("|");
      if (collapsedKey && collapsedKey !== key) {
        matchingEntry = index.byKey?.get(collapsedKey);
      }
    }

    if (!matchingEntry) {
      const supersetMatch = findClosestFieldCombination(fields, index, { requireSuperset: true });
      const isListOnlyMissing =
        supersetMatch &&
        supersetMatch.extra.length === 0 &&
        supersetMatch.missing.every((field) => {
          if (!hasNumericSegment(field)) return false;
          const normalized = stripNumericSegments(field);
          return normalizedIndexFreeFields.has(normalized);
        });

      if (isListOnlyMissing) {
        // Allow shorter list instances; compose-pages-data will prune placeholders.
      } else {
        const closest = findClosestFieldCombination(fields, index);
        let message = `${sectionPath} has unsupported field combination: [${fields.join(", ")}].`;

        if (closest) {
          const { entry, extra, missing } = closest;
          const suggestionParts = [];
          if (extra.length > 0) {
            suggestionParts.push(`remove extra fields [${extra.join(", ")}]`);
          }
          if (missing.length > 0) {
            suggestionParts.push(`add required fields [${missing.join(", ")}]`);
          }
          const componentNames = Array.from(entry?.components ?? []);
          if (componentNames.length > 0) {
            suggestionParts.push(`match component(s): ${componentNames.join(", ")}`);
          }

          if (suggestionParts.length > 0) {
            message += ` Suggested fix: ${suggestionParts.join("; ")}.`;
          }
        }

        const error = {
          path: sectionPath,
          message,
          code: "UNKNOWN_FIELD_COMBINATION",
        };

        const errorKey = `${error.path}:${error.code}`;
        if (!existingKeys || !existingKeys.has(errorKey)) {
          errors.push(error);
          existingKeys?.add(errorKey);
        }
      }
    }
  }

  const listItems = section[LIST_KEY];
  if (Array.isArray(listItems)) {
    listItems.forEach((item, indexOfItem) => {
      const itemPath = `${sectionPath}.${LIST_KEY}.${indexOfItem}`;
      if (item && typeof item === "object" && !Array.isArray(item)) {
        validateSectionFieldCombination({
          section: item,
          sectionPath: itemPath,
          index,
          errors,
          existingKeys,
        });
      } else if (item != null) {
        const error = {
          path: itemPath,
          message: `${itemPath} must be an object with valid section fields`,
          code: "INVALID_LIST_ITEM_TYPE",
        };
        const errorKey = `${error.path}:${error.code}`;
        if (!existingKeys || !existingKeys.has(errorKey)) {
          errors.push(error);
          existingKeys?.add(errorKey);
        }
      }
    });
  }
}

/**
 * Normalize path to absolute path for consistent comparison
 * @param {string} filePath - The path to normalize
 * @returns {string} - Absolute path
 */
export function normalizePath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

/**
 * Convert path to relative path from current working directory
 * @param {string} filePath - The path to convert
 * @returns {string} - Relative path
 */
export function toRelativePath(filePath) {
  return path.isAbsolute(filePath) ? path.relative(process.cwd(), filePath) : filePath;
}

/**
 * Check if a string looks like a glob pattern
 * @param {string} pattern - The string to check
 * @returns {boolean} - True if the string contains glob pattern characters
 */
export function isGlobPattern(pattern) {
  if (pattern == null) return false;
  return /[*?[\]]|(\*\*)/.test(pattern);
}

export function processContent({ content }) {
  // Match markdown regular links [text](link), exclude images ![text](link)
  return content.replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    const trimLink = link.trim();
    // Exclude external links and mailto
    if (/^(https?:\/\/|mailto:)/.test(trimLink)) return match;
    // Preserve anchors
    const [path, hash] = trimLink.split("#");
    // Skip if already has extension
    if (/\.[a-zA-Z0-9]+$/.test(path)) return match;
    // Only process relative paths or paths starting with /
    if (!path) return match;
    // Flatten to ./xxx-yyy with page extension
    let finalPath = path;
    if (path.startsWith(".")) {
      finalPath = path.replace(/^\./, "");
    }
    let flatPath = finalPath.replace(/^\//, "").replace(/\//g, "-");
    flatPath = `./${flatPath}${PAGE_FILE_EXTENSION}`;
    const newLink = hash ? `${flatPath}#${hash}` : flatPath;
    return `[${text}](${newLink})`;
  });
}

export function validatePageDetail({
  pageDetailYaml,
  allowArrayFallback = false,
  componentLibrary,
}) {
  const errors = [];
  const fieldCombinationIndex = buildFieldCombinationIndex(componentLibrary);

  const toErrorKey = (error) => `${error.path}:${error.code}`;

  const buildInvalidResult = () => {
    const summary =
      errors.length === 1
        ? "Found 1 validation error:"
        : `Found ${errors.length} validation errors:`;
    const details = errors
      .map((error, index) => `${index + 1}. ${error.path}: ${error.message}`)
      .join("\n");

    return {
      isValid: false,
      validationFeedback: `${summary}\n${details}`,
      errors,
      errorCount: errors.length,
    };
  };

  if (typeof pageDetailYaml !== "string") {
    errors.push({
      path: "pageDetailYaml",
      message: "pageDetailYaml must be provided as a string",
      code: "INVALID_INPUT_TYPE",
    });
    return buildInvalidResult();
  }

  const trimmed = pageDetailYaml.trim();
  if (!trimmed) {
    errors.push({
      path: "pageDetailYaml",
      message: "YAML or JSON content must not be empty",
      code: "EMPTY_CONTENT",
    });
    return buildInvalidResult();
  }

  let parsed;
  let normalizedContent;
  let normalizedFromArray = false;
  try {
    parsed = parse(pageDetailYaml);
  } catch (parseError) {
    errors.push({
      path: "yaml_syntax",
      message: `Invalid YAML or JSON syntax: ${parseError.message}`,
      code: "YAML_SYNTAX_ERROR",
    });
    return buildInvalidResult();
  }

  if (Array.isArray(parsed)) {
    if (!allowArrayFallback) {
      errors.push({
        path: "pageDetailYaml",
        message: "Root array is not allowed when allowArrayFallback is false",
        code: "ARRAY_ROOT_NOT_ALLOWED",
      });
      return buildInvalidResult();
    }

    if (parsed.length === 0) {
      errors.push({
        path: "pageDetailYaml",
        message: "Root array must contain at least one detail object",
        code: "EMPTY_ARRAY_ROOT",
      });
      return buildInvalidResult();
    }

    const firstNode = parsed[0];
    normalizedFromArray = true;
    if (trimmed.startsWith("[")) {
      normalizedContent = JSON.stringify(firstNode, null, 2);
    } else {
      normalizedContent = yamlStringify(firstNode).trimEnd();
    }
    parsed = firstNode;
  }

  const isRootObject = parsed != null && typeof parsed === "object" && !Array.isArray(parsed);

  if (!isRootObject) {
    errors.push({
      path: "pageDetailYaml",
      message: "Root node must be an object containing meta and sections",
      code: "INVALID_ROOT_TYPE",
    });
    return buildInvalidResult();
  }

  const validationResult = pageDetailSchema.safeParse(parsed);
  const existingErrorKeys = new Set(errors.map(toErrorKey));
  const issues = validationResult.success
    ? []
    : validationResult.error?.errors || validationResult.error?.issues || [];

  for (const issue of issues) {
    const path = Array.isArray(issue.path) ? issue.path.join(".") : String(issue.path || "unknown");
    let code = issue.code || "VALIDATION_ERROR";
    let message = issue.message || "Validation failed";

    if (path === "meta" && issue.code === "invalid_type") {
      if (issue.received === "undefined") {
        code = "MISSING_META";
        message = "meta field is required";
      } else {
        code = "INVALID_META_TYPE";
        message = "meta must be an object";
      }
    } else if (path === "sections" && issue.code === "invalid_type") {
      if (issue.received === "undefined") {
        code = "MISSING_SECTIONS";
        message = "sections field is required";
      } else {
        code = "INVALID_SECTIONS_TYPE";
        message = "sections must be an array of section objects";
      }
    }

    const error = { path, message, code };
    const key = toErrorKey(error);
    if (!existingErrorKeys.has(key)) {
      existingErrorKeys.add(key);
      errors.push(error);
    }
  }

  const parsedDataForValidation = validationResult.success ? validationResult.data : parsed;

  if (
    errors.length === 0 &&
    fieldCombinationIndex &&
    Array.isArray(parsedDataForValidation?.sections)
  ) {
    parsedDataForValidation.sections.forEach((section, index) => {
      validateSectionFieldCombination({
        section,
        sectionPath: `sections.${index}`,
        index: fieldCombinationIndex,
        errors,
        existingKeys: existingErrorKeys,
      });
    });
  }

  if (errors.length === 0) {
    const result = {
      isValid: true,
      validationFeedback: "Page detail YAML validation passed",
      parsedData: parsedDataForValidation,
    };
    if (normalizedContent) {
      result.normalizedContent = normalizedContent;
      result.normalizedFromArray = normalizedFromArray;
    }
    return result;
  }

  return buildInvalidResult();
}
// Helper function to generate filename based on language
export const getFileName = ({ fileName }) => {
  // const isEnglish = locale === "en" || !locale;

  // return isEnglish
  //   ? `${fileName}${PAGE_FILE_EXTENSION}`
  //   : `${fileName}.${locale}${PAGE_FILE_EXTENSION}`;

  return `${fileName}${PAGE_FILE_EXTENSION}`;
};

/**
 * Save a single page and its translations to files
 * @param {Object} params
 * @param {string} params.path - Relative path (without extension)
 * @param {string} params.content - Main page content
 * @param {string} params.pagesDir - Root directory
 * @param {string} params.tmpDir - Temporary directory
 * @param {string} params.locale - Main content language (e.g., 'en', 'zh', 'fr')
 * @param {Array<{language: string, translation: string}>} [params.translates] - Translation content
 * @param {Array<string>} [params.labels] - Page labels for front matter
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
export async function savePageWithTranslations({
  path: pagePath,
  content,
  pagesDir,
  tmpDir,
  locale,
  translates = [],
  isTranslate = false,
}) {
  const results = [];
  try {
    // Flatten path: remove leading /, replace all / with -
    const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-");
    await fs.mkdir(pagesDir, { recursive: true });
    await fs.mkdir(tmpDir, { recursive: true });

    // Save main content with appropriate filename based on locale (skip if isTranslate is true)
    if (!isTranslate) {
      const mainFileName = getFileName({ locale, fileName: flatName });
      const mainFilePath = path.join(tmpDir, locale, mainFileName);

      await fs.mkdir(path.dirname(mainFilePath), { recursive: true });

      const finalContent = processContent({ content });

      await fs.writeFile(mainFilePath, finalContent, "utf8");
      results.push({ path: mainFilePath, success: true });
    }

    // Process all translations
    for (const translate of translates) {
      const translateFileName = getFileName({
        locale: translate.language,
        fileName: flatName,
      });
      const translatePath = path.join(tmpDir, translate.language, translateFileName);

      await fs.mkdir(path.dirname(translatePath), { recursive: true });

      const finalTranslationContent = processContent({
        content: translate.translation,
      });

      await fs.writeFile(translatePath, finalTranslationContent, "utf8");
      results.push({ path: translatePath, success: true });
    }
  } catch (err) {
    results.push({ path: pagePath, success: false, error: err.message });
  }
  return results;
}

/**
 * Get current git HEAD commit hash
 * @returns {string} - The current git HEAD commit hash
 */
export function getCurrentGitHead() {
  try {
    return execSync("git rev-parse HEAD", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch (error) {
    // Not in git repository or git command failed
    console.warn("Failed to get git HEAD:", error.message);
    return null;
  }
}

/**
 * Save git HEAD to config.yaml file
 * @param {string} gitHead - The current git HEAD commit hash
 */
export async function saveGitHeadToConfig(gitHead) {
  if (!gitHead || process.env.NODE_ENV === "test" || process.env.BUN_TEST) {
    return; // Skip if no git HEAD available or in test environment
  }

  try {
    const webSmithDir = path.join(process.cwd(), WEB_SMITH_DIR);
    if (!existsSync(webSmithDir)) {
      mkdirSync(webSmithDir, { recursive: true });
    }

    const inputFilePath = path.join(webSmithDir, "config.yaml");
    let fileContent = "";

    // Read existing file content if it exists
    if (existsSync(inputFilePath)) {
      fileContent = await fs.readFile(inputFilePath, "utf8");
    }

    // Check if lastGitHead already exists in the file
    const lastGitHeadRegex = /^lastGitHead:\s*.*$/m;
    // Use yaml library to safely serialize the git head value
    const yamlContent = yamlStringify({ lastGitHead: gitHead }).trim();
    const newLastGitHeadLine = yamlContent;

    if (lastGitHeadRegex.test(fileContent)) {
      // Replace existing lastGitHead line
      fileContent = fileContent.replace(lastGitHeadRegex, newLastGitHeadLine);
    } else {
      // Add lastGitHead to the end of file
      if (fileContent && !fileContent.endsWith("\n")) {
        fileContent += "\n";
      }
      fileContent += `${newLastGitHeadLine}\n`;
    }

    await fs.writeFile(inputFilePath, fileContent);
  } catch (error) {
    console.warn("Failed to save git HEAD to config.yaml:", error.message);
  }
}

/**
 * Check if files have been modified between two git commits
 * @param {string} fromCommit - Starting commit hash
 * @param {string} toCommit - Ending commit hash (defaults to HEAD)
 * @param {Array<string>} filePaths - Array of file paths to check
 * @returns {Array<string>} - Array of modified file paths
 */
export function getModifiedFilesBetweenCommits(fromCommit, toCommit = "HEAD", filePaths = []) {
  try {
    // Get all modified files between commits
    const modifiedFiles = execSync(`git diff --name-only ${fromCommit}..${toCommit}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    // Filter to only include files we care about
    if (filePaths.length === 0) {
      return modifiedFiles;
    }

    return modifiedFiles.filter((file) =>
      filePaths.some((targetPath) => {
        const absoluteFile = normalizePath(file);
        const absoluteTarget = normalizePath(targetPath);
        return absoluteFile === absoluteTarget;
      }),
    );
  } catch (error) {
    console.warn(
      `Failed to get modified files between ${fromCommit} and ${toCommit}:`,
      error.message,
    );
    return [];
  }
}

/**
 * Check if any source files have changed based on modified files list
 * @param {Array<string>} sourceIds - Source file paths
 * @param {Array<string>} modifiedFiles - List of modified files between commits
 * @returns {boolean} - True if any source files have changed
 */
export function hasSourceFilesChanged(sourceIds, modifiedFiles) {
  if (!sourceIds || sourceIds.length === 0 || !modifiedFiles) {
    return false; // No source files or no modified files
  }

  return modifiedFiles.some((modifiedFile) =>
    sourceIds.some((sourceId) => {
      const absoluteModifiedFile = normalizePath(modifiedFile);
      const absoluteSourceId = normalizePath(sourceId);
      return absoluteModifiedFile === absoluteSourceId;
    }),
  );
}

/**
 * Check if there are any added or deleted files between two git commits that match the include/exclude patterns
 * @param {string} fromCommit - Starting commit hash
 * @param {string} toCommit - Ending commit hash (defaults to HEAD)
 * @param {Array<string>} includePatterns - Include patterns to match files
 * @param {Array<string>} excludePatterns - Exclude patterns to filter files
 * @returns {boolean} - True if there are relevant added/deleted files
 */
export function hasFileChangesBetweenCommits(
  fromCommit,
  toCommit = "HEAD",
  includePatterns = DEFAULT_INCLUDE_PATTERNS,
  excludePatterns = DEFAULT_EXCLUDE_PATTERNS,
) {
  try {
    // Get file changes with status (A=added, D=deleted, M=modified)
    const changes = execSync(`git diff --name-status ${fromCommit}..${toCommit}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    })
      .trim()
      .split("\n")
      .filter(Boolean);

    // Only check for added (A) and deleted (D) files
    const addedOrDeletedFiles = changes
      .filter((line) => {
        const [status, filePath] = line.split(/\s+/);
        return (status === "A" || status === "D") && filePath;
      })
      .map((line) => line.split(/\s+/)[1]);

    if (addedOrDeletedFiles.length === 0) {
      return false;
    }

    // Check if any of the added/deleted files match the include patterns and don't match exclude patterns
    return addedOrDeletedFiles.some((filePath) => {
      // Check if file matches any include pattern
      const matchesInclude = includePatterns.some((pattern) => {
        // First escape all regex special characters except * and ?
        const escapedPattern = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
        // Then convert glob wildcards to regex
        const regexPattern = escapedPattern.replace(/\*/g, ".*").replace(/\?/g, ".");
        const regex = new RegExp(regexPattern);
        return regex.test(filePath);
      });

      if (!matchesInclude) {
        return false;
      }

      // Check if file matches any exclude pattern
      const matchesExclude = excludePatterns.some((pattern) => {
        // First escape all regex special characters except * and ?
        const escapedPattern = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
        // Then convert glob wildcards to regex
        const regexPattern = escapedPattern.replace(/\*/g, ".*").replace(/\?/g, ".");
        const regex = new RegExp(regexPattern);
        return regex.test(filePath);
      });

      return !matchesExclude;
    });
  } catch (error) {
    console.warn(
      `Failed to check file changes between ${fromCommit} and ${toCommit}:`,
      error.message,
    );
    return false;
  }
}

/**
 * Load config from config.yaml file
 * @returns {Promise<Object|null>} - The config object or null if file doesn't exist
 */
export async function loadConfigFromFile() {
  const configPath = path.join(process.cwd(), WEB_SMITH_DIR, "config.yaml");

  try {
    if (!existsSync(configPath)) {
      return null;
    }

    const configContent = await fs.readFile(configPath, "utf8");
    return parse(configContent);
  } catch (error) {
    console.warn("Failed to read config file:", error.message);
    return null;
  }
}

/**
 * Save value to config.yaml file
 * @param {string} key - The config key to save
 * @param {string|Array} value - The value to save (can be string or array)
 * @param {string} [comment] - Optional comment to add above the key
 */
/**
 * Handle array value formatting and updating in YAML config
 * @param {string} key - The configuration key
 * @param {Array} value - The array value to save
 * @param {string} comment - Optional comment
 * @param {string} fileContent - Current file content
 * @returns {string} Updated file content
 */
function handleArrayValueUpdate(key, value, comment, fileContent) {
  // Use yaml library to safely serialize the key-value pair
  const yamlObject = { [key]: value };
  const yamlContent = yamlStringify(yamlObject).trim();
  const formattedValue = yamlContent;

  const lines = fileContent.split("\n");

  // Find the start line of the key
  const keyStartIndex = lines.findIndex((line) => line.match(new RegExp(`^${key}:\\s*`)));

  if (keyStartIndex !== -1) {
    // Find the end of the array (next non-indented line or end of file)
    let keyEndIndex = keyStartIndex;
    for (let i = keyStartIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      // If line is empty, starts with comment, or doesn't start with "- ", it's not part of the array
      if (line === "" || line.startsWith("#") || (!line.startsWith("- ") && !line.match(/^\w+:/))) {
        if (!line.startsWith("- ")) {
          keyEndIndex = i - 1;
          break;
        }
      } else if (line.match(/^\w+:/)) {
        // Found another key, stop here
        keyEndIndex = i - 1;
        break;
      } else if (line.startsWith("- ")) {
        keyEndIndex = i;
      }
    }

    // If we reached the end of file
    if (keyEndIndex === keyStartIndex) {
      // Check if the value is on the same line
      const keyLine = lines[keyStartIndex];
      if (keyLine.includes("[") || !keyLine.endsWith(":")) {
        keyEndIndex = keyStartIndex;
      } else {
        // Find the actual end of the array
        for (let i = keyStartIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("- ")) {
            keyEndIndex = i;
          } else if (line !== "" && !line.startsWith("#")) {
            break;
          }
        }
      }
    }

    // Replace the entire array section
    const replacementLines = formattedValue.split("\n");
    lines.splice(keyStartIndex, keyEndIndex - keyStartIndex + 1, ...replacementLines);

    // Add comment if provided and not already present
    if (comment && keyStartIndex > 0 && !lines[keyStartIndex - 1].trim().startsWith("# ")) {
      lines.splice(keyStartIndex, 0, `# ${comment}`);
    }

    return lines.join("\n");
  } else {
    // Add new array to end of file
    let updatedContent = fileContent;
    if (updatedContent && !updatedContent.endsWith("\n")) {
      updatedContent += "\n";
    }

    // Add comment if provided
    if (comment) {
      updatedContent += `# ${comment}\n`;
    }

    updatedContent += `${formattedValue}\n`;
    return updatedContent;
  }
}

/**
 * Handle string value formatting and updating in YAML config
 * @param {string} key - The configuration key
 * @param {string} value - The string value to save
 * @param {string} comment - Optional comment
 * @param {string} fileContent - Current file content
 * @returns {string} Updated file content
 */
function handleStringValueUpdate(key, value, comment, fileContent) {
  // Use yaml library to safely serialize the key-value pair
  const yamlObject = { [key]: value };
  const yamlContent = yamlStringify(yamlObject).trim();
  const formattedValue = yamlContent;
  const lines = fileContent.split("\n");

  // Handle string values (original logic)
  const keyRegex = new RegExp(`^${key}:\\s*.*$`);
  const keyIndex = lines.findIndex((line) => keyRegex.test(line));

  if (keyIndex !== -1) {
    // Replace existing key line
    lines[keyIndex] = formattedValue;

    // Add comment if provided and not already present
    if (comment) {
      const hasCommentAbove = keyIndex > 0 && lines[keyIndex - 1].trim().startsWith("# ");
      if (!hasCommentAbove) {
        // Add comment above the key if it doesn't already have one
        lines.splice(keyIndex, 0, `# ${comment}`);
      }
    }

    return lines.join("\n");
  } else {
    // Add key to the end of file
    let updatedContent = fileContent;
    if (updatedContent && !updatedContent.endsWith("\n")) {
      updatedContent += "\n";
    }

    // Add comment if provided
    if (comment) {
      updatedContent += `# ${comment}\n`;
    }

    updatedContent += `${formattedValue}\n`;
    return updatedContent;
  }
}

export async function saveValueToConfig(key, value, comment) {
  if (value === undefined) {
    return; // Skip if value is undefined
  }

  try {
    const webSmithDir = path.join(process.cwd(), WEB_SMITH_DIR);
    if (!existsSync(webSmithDir)) {
      mkdirSync(webSmithDir, { recursive: true });
    }

    const configPath = path.join(webSmithDir, "config.yaml");
    let fileContent = "";

    // Read existing file content if it exists
    if (existsSync(configPath)) {
      fileContent = await fs.readFile(configPath, "utf8");
    }

    // Use extracted helper functions for better maintainability
    let updatedContent;
    if (Array.isArray(value)) {
      updatedContent = handleArrayValueUpdate(key, value, comment, fileContent);
    } else {
      updatedContent = handleStringValueUpdate(key, value, comment, fileContent);
    }

    await fs.writeFile(configPath, updatedContent);
  } catch (error) {
    console.warn(`Failed to save ${key} to config.yaml:`, error.message);
  }
}

/**
 * Validate if a path exists and is accessible
 * @param {string} filePath - The path to validate (can be absolute or relative)
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export function validatePath(filePath) {
  try {
    const absolutePath = normalizePath(filePath);

    // Check if path exists
    if (!existsSync(absolutePath)) {
      return {
        isValid: false,
        error: `Path does not exist: ${filePath}`,
      };
    }

    // Check if path is accessible (readable)
    try {
      accessSync(absolutePath, constants.R_OK);
    } catch (_accessError) {
      return {
        isValid: false,
        error: `Path is not accessible: ${filePath}`,
      };
    }

    return {
      isValid: true,
      error: null,
    };
  } catch (_error) {
    return {
      isValid: false,
      error: `Invalid path format: ${filePath}`,
    };
  }
}

/**
 * Validate multiple paths and return validation results
 * @param {Array<string>} paths - Array of paths to validate
 * @returns {Object} - Validation results with validPaths array and errors array
 */
export function validatePaths(paths) {
  const validPaths = [];
  const errors = [];

  for (const path of paths) {
    const validation = validatePath(path);
    if (validation.isValid) {
      validPaths.push(path);
    } else {
      errors.push({
        path: path,
        error: validation.error,
      });
    }
  }

  return {
    validPaths,
    errors,
  };
}

/**
 * Check if input is a valid directory or file and add it to results if so
 * @param {string} searchTerm - The search term to check
 * @param {Array} results - The results array to modify
 */
function addExactPathMatch(searchTerm, results) {
  const inputValidation = validatePath(searchTerm);
  if (inputValidation.isValid) {
    const stats = statSync(normalizePath(searchTerm));
    const isDirectory = stats.isDirectory();
    results.unshift({
      name: searchTerm,
      value: searchTerm,
      description: isDirectory ? "📁 Directory" : "📄 File",
    });
  }
}

/**
 * Get available paths for search suggestions based on user input
 * @param {string} userInput - User's input string
 * @returns {Array<Object>} - Array of path objects with name, value, and description
 */
export function getAvailablePaths(userInput = "") {
  try {
    const searchTerm = userInput.trim();

    // If no input, return current directory contents
    if (!searchTerm) {
      return getDirectoryContents("./");
    }

    let results = [];

    // Handle absolute paths
    if (searchTerm.startsWith("/")) {
      const dirPath = path.dirname(searchTerm);
      const fileName = path.basename(searchTerm);
      results = getDirectoryContents(dirPath, fileName);
      addExactPathMatch(searchTerm, results);
    }
    // Handle relative paths
    else if (searchTerm.startsWith("./") || searchTerm.startsWith("../")) {
      // Extract directory path and search term
      const lastSlashIndex = searchTerm.lastIndexOf("/");
      if (lastSlashIndex === -1) {
        // No slash found, treat as current directory search
        results = getDirectoryContents("./", searchTerm);
        addExactPathMatch(searchTerm, results);
      } else {
        const dirPath = searchTerm.substring(0, lastSlashIndex + 1);
        const fileName = searchTerm.substring(lastSlashIndex + 1);

        // Validate directory path
        const validation = validatePath(dirPath);
        if (!validation.isValid) {
          return [
            {
              name: dirPath,
              value: dirPath,
              description: validation.error,
            },
          ];
        }

        results = getDirectoryContents(dirPath, fileName);
        addExactPathMatch(searchTerm, results);
      }
    }
    // Handle simple file/directory names (search in current directory)
    else {
      results = getDirectoryContents("./", searchTerm);
      addExactPathMatch(searchTerm, results);
    }

    // Remove duplicates based on value (path)
    const uniqueResults = [];
    const seenPaths = new Set();

    for (const item of results) {
      if (!seenPaths.has(item.value)) {
        seenPaths.add(item.value);
        uniqueResults.push(item);
      }
    }

    return uniqueResults;
  } catch (error) {
    console.warn(`Failed to get available paths for "${userInput}":`, error.message);
    return [];
  }
}

/**
 * Get directory contents for a specific path
 * @param {string} dirPath - Directory path to search in
 * @param {string} searchTerm - Optional search term to filter results
 * @returns {Array<Object>} - Array of path objects (both files and directories)
 */
function getDirectoryContents(dirPath, searchTerm = "") {
  try {
    const absoluteDirPath = normalizePath(dirPath);

    // Check if directory exists
    if (!existsSync(absoluteDirPath)) {
      return [
        {
          name: dirPath,
          value: dirPath,
          description: "Directory does not exist",
        },
      ];
    }

    const items = [];

    // Read directory contents
    const entries = readdirSync(absoluteDirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryName = entry.name;

      // Preserve ./ prefix when dirPath is "./"
      let relativePath = path.join(dirPath, entryName);
      if (dirPath?.startsWith("./")) {
        relativePath = `./${relativePath}`;
      }

      // Filter by search term if provided
      if (searchTerm && !entryName.toLowerCase().includes(searchTerm.toLowerCase())) {
        continue;
      }

      // Skip hidden files and common ignore patterns
      if (
        entryName.startsWith(".") ||
        entryName === "node_modules" ||
        entryName === ".git" ||
        entryName === "dist" ||
        entryName === "build"
      ) {
        continue;
      }

      const isDirectory = entry.isDirectory();

      // Include both directories and files
      items.push({
        name: relativePath,
        value: relativePath,
        description: isDirectory ? "📁 Directory" : "📄 File",
      });
    }

    // Sort alphabetically (directories first, then files)
    items.sort((a, b) => {
      const aIsDir = a.description === "📁 Directory";
      const bIsDir = b.description === "📁 Directory";

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;

      return a.name.localeCompare(b.name);
    });

    return items;
  } catch (error) {
    console.warn(`Failed to get directory contents from ${dirPath}:`, error.message);
    return [];
  }
}

/**
 * Get GitHub repository URL from git remote
 * @returns {string} GitHub repository URL or empty string if not a GitHub repo (e.g. git@github.com:xxxx/xxxx.git)
 */
export function getGithubRepoUrl() {
  try {
    const gitRemote = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    // Check if it's a GitHub repository
    if (gitRemote.includes("github.com")) {
      return gitRemote;
    }

    return "";
  } catch {
    // Not in git repository or no origin remote
    return "";
  }
}

/**
 * Get GitHub repository information
 * @param {string} repoUrl - The repository URL
 * @returns {Promise<Object>} - Repository information
 */
export async function getGitHubRepoInfo(repoUrl) {
  try {
    // Extract owner and repo from GitHub URL
    const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) return null;

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      name: data.name,
      description: data.description || "",
      icon: data.owner?.avatar_url || "",
    };
  } catch (error) {
    console.warn("Failed to fetch GitHub repository info:", error.message);
    return null;
  }
}

/**
 * Get project information automatically without user confirmation
 * @returns {Promise<Object>} - Project information including name, description, icon, and fromGitHub flag
 */
export async function getProjectInfo() {
  let repoInfo = null;
  let defaultName = path.basename(process.cwd());
  let defaultDescription = "";
  let defaultIcon = "";
  let fromGitHub = false;

  // Check if we're in a git repository
  try {
    const gitRemote = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    // Extract repository name from git remote URL
    const repoName = gitRemote.split("/").pop().replace(".git", "");
    defaultName = repoName;

    // If it's a GitHub repository, try to get additional info
    if (gitRemote.includes("github.com")) {
      repoInfo = await getGitHubRepoInfo(gitRemote);
      if (repoInfo) {
        defaultDescription = repoInfo.description;
        defaultIcon = repoInfo.icon;
        fromGitHub = true;
      }
    }
  } catch (_error) {
    // Not in git repository or no origin remote, use current directory name
    console.warn("No git repository found, using current directory name");
  }

  return {
    name: defaultName,
    description: defaultDescription,
    icon: defaultIcon,
    id: crypto.randomUUID(),
    slug: defaultName ? slugify(transliterate(defaultName), { lower: true, strict: true }) : "",
    fromGitHub,
  };
}

/**
 * Process configuration fields - convert keys to actual content
 * @param {Object} config - Parsed configuration
 * @returns {Object} Processed configuration with content fields
 */
export function processConfigFields(config) {
  const processed = {};
  const allRulesContent = [];

  // Set default values for missing or empty fields
  const defaults = {
    locale: "en",
    sourcesPath: ["./"],
    pagesDir: `${WEB_SMITH_DIR}/pages`,
    outputDir: `${WEB_SMITH_DIR}/output`,
    tmpDir: `${WEB_SMITH_DIR}/workspace`,
    translateLanguages: [],
    rules: "",
    targetAudience: "",
  };

  // Apply defaults for missing or empty fields
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (
      !config[key] ||
      (Array.isArray(defaultValue) && (!config[key] || config[key].length === 0)) ||
      (typeof defaultValue === "string" && (!config[key] || config[key].trim() === ""))
    ) {
      processed[key] = defaultValue;
    }
  }

  // Check if original rules field has content
  if (config.rules) {
    if (typeof config.rules === "string") {
      const existingRules = config.rules.trim();
      if (existingRules) {
        allRulesContent.push(existingRules);
      }
    } else if (Array.isArray(config.rules)) {
      // Handle array of rules - join them with newlines
      const rulesText = config.rules
        .filter((rule) => typeof rule === "string" && rule.trim())
        .join("\n\n");
      if (rulesText) {
        allRulesContent.push(rulesText);
      }
    }
  }

  // Process page purpose (array) - restructured format
  const pagePurposeItems = getPagePurpose(config.pagePurpose);
  if (pagePurposeItems.length > 0) {
    allRulesContent.push(`- Page Purpose:\n${pagePurposeItems.join("\n")}`);
  }

  // Process target audience types (array) - restructured format
  let audienceNames = "";
  if (config.targetAudienceTypes && Array.isArray(config.targetAudienceTypes)) {
    const audienceItems = getTargetAudienceTypes(config.targetAudienceTypes);
    if (audienceItems.length > 0) {
      allRulesContent.push(`- Target Audience:\n${audienceItems.join("\n")}`);
    }

    // Get names for targetAudience field
    audienceNames = config.targetAudienceTypes
      .map((key) => TARGET_AUDIENCES[key]?.name)
      .filter(Boolean)
      .join(", ");

    if (audienceNames) {
      // Check if original targetAudience field has content
      const existingTargetAudience = config.targetAudience?.trim();
      const newAudienceNames = audienceNames;

      if (existingTargetAudience) {
        processed.targetAudience = `${existingTargetAudience}\n\n${newAudienceNames}`;
      } else {
        processed.targetAudience = newAudienceNames;
      }
    }
  }

  // Process website scale (single value) - restructured format
  let scaleContent = "";
  if (config.websiteScale) {
    const scale = WEBSITE_SCALE[config.websiteScale];
    if (scale?.content) {
      scaleContent = scale.content;
      processed.websiteScaleContent = scaleContent;

      const lines = scale.content.split("\n").filter((line) => line.trim());
      const scaleRule = `- Website Scale: ${scale.name}\n${lines.map((line) => `  - ${line}`).join("\n")}`;
      allRulesContent.push(scaleRule);
    }
  }

  // Detect and handle conflicts in user selections
  const conflicts = detectResolvableConflicts(config);
  if (conflicts.length > 0) {
    const conflictResolutionRules = generateConflictResolutionRules(conflicts);
    allRulesContent.push(conflictResolutionRules);

    // Store conflict information for debugging/logging
    processed.detectedConflicts = conflicts;
  }

  // Combine all content into rules field
  if (allRulesContent.length > 0) {
    processed.rules = allRulesContent.join("\n\n");
  }

  if (config.pagesDir) {
    processed.tmpDir = join(config.pagesDir, PAGES_TMP_DIR);
    processed.outputDir = join(config.pagesDir, PAGES_OUTPUT_DIR);
  }

  return processed;
}

export function getPagePurpose(pagePurpose) {
  // Process page purpose (array) - restructured format
  if (pagePurpose && Array.isArray(pagePurpose)) {
    return pagePurpose
      .map((key) => {
        const style = PAGE_STYLES[key];
        if (!style) return null;
        const lines = style.content.split("\n").filter((line) => line.trim());
        return `  - ${style.name}:\n    - Goal: ${style.description}\n${lines.map((line) => `    - ${line}`).join("\n")}`;
      })
      .filter(Boolean);
  }

  return [];
}

export function getTargetAudienceTypes(targetAudienceTypes) {
  if (targetAudienceTypes && Array.isArray(targetAudienceTypes)) {
    return targetAudienceTypes
      .map((key) => {
        const audience = TARGET_AUDIENCES[key];
        if (!audience) return null;
        const lines = audience.content.split("\n").filter((line) => line.trim());
        return `  - ${audience.name}:\n    - Description: ${audience.description}\n${lines.map((line) => `    - ${line}`).join("\n")}`;
      })
      .filter(Boolean);
  }
  return [];
}

/**
 * Recursively resolves file references in a configuration object.
 *
 * This function traverses the input object, array, or string recursively. Any string value that starts
 * with '@' is treated as a file reference, and the file's content is loaded asynchronously. Supported
 * file formats include .txt, page files, .json, .yaml, and .yml. For .json and .yaml/.yml files, the content
 * is parsed into objects; for .txt and page files, the raw string is returned.
 *
 * If a file cannot be loaded (e.g., does not exist, is of unsupported type, or parsing fails), the
 * original string value (with '@' prefix) is returned in place of the file content.
 *
 * The function processes nested arrays and objects recursively, returning a new structure with file
 * contents loaded in place of references. The input object is not mutated.
 *
 * Examples of supported file reference formats:
 *   - "@notes.txt"
 *   - "@pages/readme" (with page extension)
 *   - "@config/settings.json"
 *   - "@data.yaml"
 *
 * @param {any} obj - The configuration object, array, or string to process.
 * @param {string} basePath - Base path for resolving relative file paths (defaults to process.cwd()).
 * @returns {Promise<any>} - The processed configuration with file content loaded in place of references.
 */
export async function resolveFileReferences(obj, basePath = process.cwd()) {
  if (typeof obj === "string" && obj.startsWith("@")) {
    return await loadFileContent(obj.slice(1), basePath);
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => resolveFileReferences(item, basePath)));
  }

  if (obj && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await resolveFileReferences(value, basePath);
    }
    return result;
  }

  return obj;
}

/**
 * Load content from a file path
 * @param {string} filePath - The file path to load
 * @param {string} basePath - Base path for resolving relative paths
 * @returns {Promise<any>} - The loaded content or original path if loading fails
 */
async function loadFileContent(filePath, basePath) {
  try {
    // Resolve path - if absolute, use as is; if relative, resolve from basePath
    const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath);

    // Check if file exists
    if (!existsSync(resolvedPath)) {
      return `@${filePath}`; // Return original value if file doesn't exist
    }

    // Check file extension
    const ext = path.extname(resolvedPath).toLowerCase();

    if (!SUPPORTED_FILE_EXTENSIONS.includes(ext)) {
      return `@${filePath}`; // Return original value if unsupported file type
    }

    // Read file content
    const content = await fs.readFile(resolvedPath, "utf-8");

    // Parse JSON/YAML files
    if (ext === ".json") {
      try {
        return JSON.parse(content);
      } catch {
        return content; // Return raw string if JSON parsing fails
      }
    }

    if (ext === ".yaml" || ext === ".yml") {
      try {
        return parse(content);
      } catch {
        return content; // Return raw string if YAML parsing fails
      }
    }

    // Return raw content for .txt and page files
    return content;
  } catch {
    // Return original value if any error occurs
    return `@${filePath}`;
  }
}

/**
 * Detect system language and map to supported language code
 * @returns {string} - Supported language code (defaults to 'en' if detection fails or unsupported)
 */
export function detectSystemLanguage() {
  try {
    // Try multiple methods to detect system language
    let systemLocale = null;

    // Method 1: Environment variables (most reliable on Unix systems)
    systemLocale = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;

    // Method 2: Node.js Intl API (fallback)
    if (!systemLocale) {
      try {
        systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      } catch (_error) {
        // Intl API failed, continue to fallback
      }
    }

    if (!systemLocale) {
      return "en"; // Default fallback
    }

    // Extract language code from locale (e.g., 'zh_CN' -> 'zh', 'en_US' -> 'en')
    const langCode = systemLocale.split(/[-_]/)[0].toLowerCase();

    // Map to supported language codes
    const supportedLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === langCode);
    if (supportedLang) {
      return supportedLang.code;
    }

    // Handle special cases for Chinese variants
    if (langCode === "zh") {
      // Check for Traditional Chinese indicators
      const fullLocale = systemLocale.toLowerCase();
      if (fullLocale.includes("tw") || fullLocale.includes("hk") || fullLocale.includes("mo")) {
        return "zh-TW";
      }
      return "zh"; // Default to Simplified Chinese
    }

    // Return default if no match found
    return "en";
  } catch (_error) {
    // Any error in detection, return default
    return "en";
  }
}

export function getContentHash(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Converts any string to kebab-case format
 * Handles various input formats: PascalCase, space-separated words, mixed case, and special characters
 * @param {string} str - Input string in any format
 * @returns {string} - kebab-case string
 */
export function toKebabCase(str) {
  if (!str || typeof str !== "string") {
    return "";
  }

  return (
    str
      // Replace special characters and spaces with hyphens
      .replace(/[\s_\\/&]+/g, "-")
      // Insert hyphens before uppercase letters (except the first one)
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Convert to lowercase
      .toLowerCase()
      // Remove any leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, "-")
  );
}

export function resolveToAbsolute(value) {
  if (!value) return undefined;
  return isAbsolute(value) ? value : resolvePath(process.cwd(), value);
}

export async function pathExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export function toDisplayPath(targetPath) {
  const rel = relative(process.cwd(), targetPath);
  return rel.startsWith("..") ? targetPath : rel || ".";
}

export function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/**
 * Clear directory contents while preserving whitelisted files/directories
 * @param {string} dir  target directory
 * @param {string[]} keep  the absolute paths of files/directories to keep
 */
export function clearDirExcept(dir, keep = []) {
  ensureDir(dir);
  const keepSet = new Set(keep.map((p) => path.resolve(p)));
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (keepSet.has(path.resolve(full))) continue; // 命中白名单则跳过

    if (ent.isDirectory()) {
      rmSync(full, { recursive: true, force: true });
    } else {
      rmSync(full, { force: true });
    }
  }
}
