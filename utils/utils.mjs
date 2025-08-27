import { execSync } from "node:child_process";
import { accessSync, constants, existsSync, mkdirSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { SUPPORTED_FILE_EXTENSIONS, SUPPORTED_LANGUAGES } from "./constants.mjs";

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
 * Save website pages and their translations to files
 * @param {Object} params
 * @param {string} params.path - Page path (e.g., '/about')
 * @param {string} params.content - Page YAML content
 * @param {string} params.outputDir - Output directory
 * @param {string} params.locale - Main content language
 * @param {Array<{language: string, content: string}>} [params.translations] - Translation content
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
export async function savePageWithTranslations({
  path: pagePath,
  content,
  outputDir,
  locale,
  translations = [],
}) {
  const results = [];
  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Generate filename based on page path
    const fileName = pagePath === "/" ? "index" : pagePath.replace(/^\//, "").replace(/\//g, "-");

    // Helper function to generate filename based on language
    const getFileName = (language) => {
      const isEnglish = language === "en";
      return isEnglish ? `${fileName}.yaml` : `${fileName}.${language}.yaml`;
    };

    // Save main content
    const mainFileName = getFileName(locale);
    const mainFilePath = path.join(outputDir, mainFileName);
    await fs.writeFile(mainFilePath, content, "utf8");
    results.push({ path: mainFilePath, success: true });

    // Process all translations
    for (const translation of translations) {
      const translateFileName = getFileName(translation.language);
      const translatePath = path.join(outputDir, translateFileName);
      await fs.writeFile(translatePath, translation.content, "utf8");
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
    console.warn("Failed to get git HEAD:", error.message);
    return null;
  }
}

/**
 * Save git HEAD to config.yaml file
 * @param {string} gitHead - The current git HEAD commit hash
 */
export async function saveGitHeadToConfig(gitHead) {
  if (!gitHead) {
    return;
  }

  try {
    const webSmithDir = path.join(process.cwd(), "./.aigne/web-smith");
    if (!existsSync(webSmithDir)) {
      mkdirSync(webSmithDir, { recursive: true });
    }

    const inputFilePath = path.join(webSmithDir, "config.yaml");
    let fileContent = "";

    if (existsSync(inputFilePath)) {
      fileContent = await fs.readFile(inputFilePath, "utf8");
    }

    const lastGitHeadRegex = /^lastGitHead:\s*.*$/m;
    const newLastGitHeadLine = `lastGitHead: ${gitHead}`;

    if (lastGitHeadRegex.test(fileContent)) {
      fileContent = fileContent.replace(lastGitHeadRegex, newLastGitHeadLine);
    } else {
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
 * Load config from config.yaml file
 * @returns {Promise<Object|null>} - The config object or null if file doesn't exist
 */
export async function loadConfigFromFile() {
  const configPath = path.join(process.cwd(), "./.aigne/web-smith", "config.yaml");

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
 * @param {string|Array} value - The value to save
 * @param {string} [comment] - Optional comment
 */
export async function saveValueToConfig(key, value, comment) {
  if (value === undefined) {
    return;
  }

  try {
    const webSmithDir = path.join(process.cwd(), "./.aigne/web-smith");
    if (!existsSync(webSmithDir)) {
      mkdirSync(webSmithDir, { recursive: true });
    }

    const configPath = path.join(webSmithDir, "config.yaml");
    let fileContent = "";

    if (existsSync(configPath)) {
      fileContent = await fs.readFile(configPath, "utf8");
    }

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
 * Handle array value formatting and updating in YAML config
 */
function handleArrayValueUpdate(key, value, comment, fileContent) {
  const formattedValue =
    value.length === 0 ? `${key}: []` : `${key}:\n${value.map((item) => `  - ${item}`).join("\n")}`;

  const lines = fileContent.split("\n");
  const keyStartIndex = lines.findIndex((line) => line.match(new RegExp(`^${key}:\\s*`)));

  if (keyStartIndex !== -1) {
    let keyEndIndex = keyStartIndex;
    for (let i = keyStartIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "" || line.startsWith("#") || (!line.startsWith("- ") && !line.match(/^\w+:/))) {
        if (!line.startsWith("- ")) {
          keyEndIndex = i - 1;
          break;
        }
      } else if (line.match(/^\w+:/)) {
        keyEndIndex = i - 1;
        break;
      } else if (line.startsWith("- ")) {
        keyEndIndex = i;
      }
    }

    const replacementLines = formattedValue.split("\n");
    lines.splice(keyStartIndex, keyEndIndex - keyStartIndex + 1, ...replacementLines);

    if (comment && keyStartIndex > 0 && !lines[keyStartIndex - 1].trim().startsWith("# ")) {
      lines.splice(keyStartIndex, 0, `# ${comment}`);
    }

    return lines.join("\n");
  } else {
    let updatedContent = fileContent;
    if (updatedContent && !updatedContent.endsWith("\n")) {
      updatedContent += "\n";
    }

    if (comment) {
      updatedContent += `# ${comment}\n`;
    }

    updatedContent += `${formattedValue}\n`;
    return updatedContent;
  }
}

/**
 * Handle string value formatting and updating in YAML config
 */
function handleStringValueUpdate(key, value, comment, fileContent) {
  const formattedValue = `${key}: "${value}"`;
  const lines = fileContent.split("\n");

  const keyRegex = new RegExp(`^${key}:\\s*.*$`);
  const keyIndex = lines.findIndex((line) => keyRegex.test(line));

  if (keyIndex !== -1) {
    lines[keyIndex] = formattedValue;

    if (comment) {
      const hasCommentAbove = keyIndex > 0 && lines[keyIndex - 1].trim().startsWith("# ");
      if (!hasCommentAbove) {
        lines.splice(keyIndex, 0, `# ${comment}`);
      }
    }

    return lines.join("\n");
  } else {
    let updatedContent = fileContent;
    if (updatedContent && !updatedContent.endsWith("\n")) {
      updatedContent += "\n";
    }

    if (comment) {
      updatedContent += `# ${comment}\n`;
    }

    updatedContent += `${formattedValue}\n`;
    return updatedContent;
  }
}

/**
 * Validate if a path exists and is accessible
 * @param {string} filePath - The path to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export function validatePath(filePath) {
  try {
    const absolutePath = normalizePath(filePath);

    if (!existsSync(absolutePath)) {
      return {
        isValid: false,
        error: `Path does not exist: ${filePath}`,
      };
    }

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
 * Get GitHub repository URL from git remote
 * @returns {string} GitHub repository URL or empty string
 */
export function getGithubRepoUrl() {
  try {
    const gitRemote = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (gitRemote.includes("github.com")) {
      return gitRemote;
    }

    return "";
  } catch {
    return "";
  }
}

/**
 * Get project information automatically
 * @returns {Promise<Object>} - Project information
 */
export async function getProjectInfo() {
  let defaultName = path.basename(process.cwd());
  let defaultDescription = "";
  let defaultIcon = "";
  let fromGitHub = false;

  try {
    const gitRemote = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    const repoName = gitRemote.split("/").pop().replace(".git", "");
    defaultName = repoName;

    if (gitRemote.includes("github.com")) {
      // Try to get GitHub info
      try {
        const match = gitRemote.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
        if (match) {
          const [, owner, repo] = match;
          const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            defaultDescription = data.description || "";
            defaultIcon = data.owner?.avatar_url || "";
            fromGitHub = true;
          }
        }
      } catch (error) {
        console.warn("Failed to fetch GitHub info:", error.message);
      }
    }
  } catch (_error) {
    console.warn("No git repository found, using current directory name");
  }

  return {
    name: defaultName,
    description: defaultDescription,
    icon: defaultIcon,
    fromGitHub,
  };
}

/**
 * Recursively resolves file references in a configuration object
 * @param {any} obj - The configuration object to process
 * @param {string} basePath - Base path for resolving relative file paths
 * @returns {Promise<any>} - The processed configuration
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
 * @returns {Promise<any>} - The loaded content
 */
async function loadFileContent(filePath, basePath) {
  try {
    const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath);

    if (!existsSync(resolvedPath)) {
      return `@${filePath}`;
    }

    const ext = path.extname(resolvedPath).toLowerCase();

    if (!SUPPORTED_FILE_EXTENSIONS.includes(ext)) {
      return `@${filePath}`;
    }

    const content = await fs.readFile(resolvedPath, "utf-8");

    if (ext === ".json") {
      try {
        return JSON.parse(content);
      } catch {
        return content;
      }
    }

    if (ext === ".yaml" || ext === ".yml") {
      try {
        return parse(content);
      } catch {
        return content;
      }
    }

    return content;
  } catch {
    return `@${filePath}`;
  }
}

/**
 * Detect system language and map to supported language code
 * @returns {string} - Supported language code
 */
export function detectSystemLanguage() {
  try {
    let systemLocale = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;

    if (!systemLocale) {
      try {
        systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      } catch (_error) {
        return "en";
      }
    }

    if (!systemLocale) {
      return "en";
    }

    const langCode = systemLocale.split(/[-_]/)[0].toLowerCase();

    const supportedLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === langCode);
    if (supportedLang) {
      return supportedLang.code;
    }

    if (langCode === "zh") {
      const fullLocale = systemLocale.toLowerCase();
      if (fullLocale.includes("tw") || fullLocale.includes("hk") || fullLocale.includes("mo")) {
        return "zh-TW";
      }
      return "zh";
    }

    return "en";
  } catch (_error) {
    return "en";
  }
}
