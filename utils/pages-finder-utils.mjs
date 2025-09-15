import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PAGE_FILE_EXTENSION } from "./constants.mjs";
import { getFileName } from "./utils.mjs";

/**
 * Get action-specific text based on isTranslate flag
 * @param {boolean} isTranslate - Whether this is a translation action
 * @param {string} baseText - Base text template with {action} placeholder
 * @returns {string} Text with action replaced
 */
export function getActionText(isTranslate, baseText) {
  const action = isTranslate ? "translate" : "update";
  return baseText.replace("{action}", action);
}

/**
 * Find a single item by path in structure plan result and read its content
 * @param {Array} structurePlanResult - Array of structure plan items
 * @param {string} pagePath - Page path to find (supports page filenames)
 * @param {string} projectId - Project ID for fallback matching
 * @param {string} pagesDir - Pages directory path for reading content
 * @param {string} locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @returns {Promise<Object|null>} Found item with content or null
 */
export async function findItemByPath(
  structurePlanResult,
  pagePath,
  projectId,
  pagesDir,
  locale = "en",
) {
  let foundItem = null;
  let fileName = null;

  // Check if pagePath is a page filename
  if (pagePath.endsWith(PAGE_FILE_EXTENSION)) {
    fileName = pagePath;
    const flatName = fileNameToFlatPath(pagePath);
    foundItem = findItemByFlatName(structurePlanResult, flatName);
  } else {
    // First try direct path matching
    foundItem = structurePlanResult.find((item) => item.path === pagePath);

    // If not found and projectId is provided, try projectId-flattenedPath format matching
    if (!foundItem && projectId) {
      // Check if path starts with projectId followed by a dash
      if (pagePath.startsWith(`${projectId}-`)) {
        // Extract the flattened path part after projectId-
        const flattenedPath = pagePath.substring(projectId.length + 1);

        // Find item by comparing flattened paths
        foundItem = structurePlanResult.find((item) => {
          // Convert item.path to flattened format (replace / with -)
          const itemFlattenedPath = item.path.replace(/^\//, "").replace(/\//g, "-");
          return itemFlattenedPath === flattenedPath;
        });
      }
    }

    // Generate filename from found item path
    if (foundItem) {
      const itemFlattenedPath = foundItem.path.replace(/^\//, "").replace(/\//g, "-");
      fileName = getFileName({ locale, fileName: itemFlattenedPath });
    }
  }

  if (!foundItem) {
    return null;
  }

  // Read file content if pagesDir is provided
  let content = null;
  if (pagesDir && fileName) {
    content = await readFileContent(pagesDir, fileName);
  }

  // Return item with content
  const result = {
    ...foundItem,
  };

  if (content !== null) {
    result.content = content;
  }

  return result;
}

/**
 * Read file content from pages directory
 * @param {string} pagesDir - Pages directory path
 * @param {string} fileName - File name to read
 * @returns {Promise<string|null>} File content or null if failed
 */
export async function readFileContent(pagesDir, fileName) {
  try {
    const filePath = join(pagesDir, fileName);
    return await readFile(filePath, "utf-8");
  } catch (readError) {
    console.warn(`⚠️  Could not read content from ${fileName}:`, readError.message);
    return null;
  }
}

/**
 * Get main language markdown files from pages directory
 * @param {string} pagesDir - Pages directory path
 * @param {string} locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @param {Array} structurePlanResult - Array of structure plan items to determine file order
 * @returns {Promise<string[]>} Array of main language page files ordered by structurePlanResult
 */
export async function getMainLanguageFiles(pagesDir, locale, structurePlanResult = null) {
  const files = await readdir(pagesDir);

  // Filter for main language page files (exclude _sidebar file)
  const filteredFiles = files.filter((file) => {
    // Skip non-page files and _sidebar file
    if (!file.endsWith(PAGE_FILE_EXTENSION) || file === `_sidebar${PAGE_FILE_EXTENSION}`) {
      return false;
    }

    return !file.match(new RegExp(`\\.\\w+(-\\w+)?\\${PAGE_FILE_EXTENSION.replace(".", "\\.")}$`));
  });

  // If structurePlanResult is provided, sort files according to the order in structurePlanResult
  if (structurePlanResult && Array.isArray(structurePlanResult)) {
    // Create a map from flat file name to structure plan order
    const orderMap = new Map();
    structurePlanResult.forEach((item, index) => {
      const itemFlattenedPath = item.path.replace(/^\//, "").replace(/\//g, "-");
      const expectedFileName = getFileName({
        locale,
        fileName: itemFlattenedPath,
      });
      orderMap.set(expectedFileName, index);
    });

    // Sort filtered files based on their order in structurePlanResult
    return filteredFiles.sort((a, b) => {
      const orderA = orderMap.get(a);
      const orderB = orderMap.get(b);

      // If both files are in the structure plan, sort by order
      if (orderA !== undefined && orderB !== undefined) {
        return orderA - orderB;
      }

      // If only one file is in the structure plan, it comes first
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;

      // If neither file is in the structure plan, maintain alphabetical order
      return a.localeCompare(b);
    });
  }

  // If no structurePlanResult provided, return files in alphabetical order
  return filteredFiles.sort();
}

/**
 * Convert filename to flattened path format
 * @param {string} fileName - File name to convert
 * @returns {string} Flattened path without page extension and language suffix
 */
export function fileNameToFlatPath(fileName) {
  // Remove page extension first
  let flatName = fileName.replace(new RegExp(`\\${PAGE_FILE_EXTENSION.replace(".", "\\.")}$`), "");

  // Remove language suffix if present (e.g., .zh, .zh-CN, .fr, etc.)
  flatName = flatName.replace(/\.\w+(-\w+)?$/, "");

  return flatName;
}

/**
 * Find structure plan item by flattened file name
 * @param {Array} structurePlanResult - Array of structure plan items
 * @param {string} flatName - Flattened file name
 * @returns {Object|null} Found item or null
 */
export function findItemByFlatName(structurePlanResult, flatName) {
  return structurePlanResult.find((item) => {
    const itemFlattenedPath = item.path.replace(/^\//, "").replace(/\//g, "-");
    return itemFlattenedPath === flatName;
  });
}

/**
 * Process selected files and convert to found items with content
 * @param {string[]} selectedFiles - Array of selected file names
 * @param {Array} structurePlanResult - Array of structure plan items
 * @param {string} pagesDir - Pages directory path
 * @returns {Promise<Object[]>} Array of found items with content
 */
export async function processSelectedFiles(selectedFiles, structurePlanResult, pagesDir) {
  const foundItems = [];

  for (const selectedFile of selectedFiles) {
    // Read the selected page file content
    const selectedFileContent = await readFileContent(pagesDir, selectedFile);

    // Convert filename back to path
    const flatName = fileNameToFlatPath(selectedFile);

    // Try to find matching item by comparing flattened paths
    const foundItemByFile = findItemByFlatName(structurePlanResult, flatName);

    if (foundItemByFile) {
      const result = {
        ...foundItemByFile,
      };

      // Add content if we read it from user selection
      if (selectedFileContent !== null) {
        result.content = selectedFileContent;
      }

      foundItems.push(result);
    } else {
      console.warn(`⚠️  No structure plan item found for file: ${selectedFile}`);
    }
  }

  return foundItems;
}

/**
 * Add feedback to all items in the array
 * @param {Object[]} items - Array of items to add feedback to
 * @param {string} feedback - Feedback text to add
 * @returns {Object[]} Items with feedback added
 */
export function addFeedbackToItems(items, feedback) {
  if (!feedback?.trim()) {
    return items;
  }

  return items.map((item) => ({
    ...item,
    feedback: feedback.trim(),
  }));
}
