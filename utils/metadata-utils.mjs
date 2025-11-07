import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import _ from "lodash";
import { parse } from "yaml";

/**
 * Load existing file metadata from output directory
 * @param {Object} options - Load options
 * @param {string} options.outputDir - Output directory path
 * @param {string} options.filePath - File path (e.g., "home.yaml")
 * @param {Function} options.getFileName - Function to get file name
 * @returns {Promise<{createdAt: string, updatedAt: string, publishedAt: string, oldContent: Object}|null>}
 */
export async function loadExistingMetadata({ outputDir, filePath, getFileName }) {
  try {
    const fileBaseName = basename(filePath).split(".")?.[0] || filePath;
    const flatName = fileBaseName.replace(/^\//, "").replace(/\//g, "-");
    const fileName = getFileName({ fileName: flatName });
    const fullPath = join(outputDir, fileName);
    const content = await readFile(fullPath, "utf8");
    const parsed = parse(content);

    return {
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
      publishedAt: parsed.publishedAt,
      // Save old content for comparison (exclude timestamp fields)
      oldContent: _.omit(parsed, ["createdAt", "updatedAt", "publishedAt"]),
    };
  } catch (_err) {
    // File doesn't exist or can't be read
    return null;
  }
}

/**
 * Compare two objects to check if content has changed
 * @param {Object} newContent - New content object
 * @param {Object} oldContent - Old content object
 * @returns {boolean} True if content has changed
 */
export function hasContentChanged(newContent, oldContent) {
  return !_.isEqual(newContent, oldContent);
}

/**
 * Determine timestamps for page data based on existing metadata
 * @param {Object} options - Options
 * @param {Object} options.newContent - New content object (without timestamps)
 * @param {Object|null} options.existingMeta - Existing metadata (if file exists)
 * @param {string} options.now - Current timestamp (ISO string)
 * @returns {{createdAt: string, updatedAt: string, publishedAt: string}}
 */
export function determineTimestamps({ newContent, existingMeta, now }) {
  if (!existingMeta) {
    // New file: all timestamps are now
    return {
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    };
  }

  // Existing file: preserve createdAt and publishedAt
  const createdAt = existingMeta.createdAt;
  const publishedAt = existingMeta.publishedAt || now;

  // Check if content has changed
  const contentChanged = hasContentChanged(newContent, existingMeta.oldContent);

  // Update updatedAt only if content changed
  const updatedAt = contentChanged ? now : existingMeta.updatedAt;

  return {
    createdAt,
    updatedAt,
    publishedAt,
  };
}
