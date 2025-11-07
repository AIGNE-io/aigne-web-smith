import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parse } from "yaml";

/**
 * Get output file path for a given file path
 * @param {Object} options - Options
 * @param {string} options.outputDir - Output directory path
 * @param {string} options.filePath - File path (e.g., "home.yaml" or "about.yaml")
 * @param {Function} options.getFileName - Function to get file name
 * @returns {string} Full output file path
 */
export function getOutputFilePath({ outputDir, filePath, getFileName }) {
  const fileBaseName = basename(filePath).split(".")?.[0] || filePath;
  const flatName = fileBaseName.replace(/^\//, "").replace(/\//g, "-");
  const fileName = getFileName({ fileName: flatName });
  return join(outputDir, fileName);
}

/**
 * Load existing file metadata from output directory
 * @param {Object} options - Load options
 * @param {string} options.outputDir - Output directory path
 * @param {string} options.filePath - File path (e.g., "home.yaml")
 * @param {Function} options.getFileName - Function to get file name
 * @returns {Promise<{createdAt: string, updatedAt: string, publishedAt: string}|null>}
 */
export async function loadExistingMetadata({ outputDir, filePath, getFileName }) {
  try {
    const fullPath = getOutputFilePath({ outputDir, filePath, getFileName });
    const content = await readFile(fullPath, "utf8");
    const parsed = parse(content);

    return {
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
      publishedAt: parsed.publishedAt,
    };
  } catch (_err) {
    // File doesn't exist or can't be read
    return null;
  }
}
