import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { LINK_PROTOCOL } from "../../../utils/constants.mjs";
import {
  buildAllowedLinksFromStructure,
  validateInternalLinks,
} from "../../../utils/protocol-utils.mjs";
import { getFileName } from "../../../utils/utils.mjs";

/**
 * Find pages with invalid links after structure changes
 * @param {Object} input - Input parameters
 * @param {string} input.tmpDir - Temporary directory path (workspace directory)
 * @param {string} input.locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @param {Array} input.websiteStructure - Updated website structure
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Result with list of page paths containing invalid links
 */
export default async function findPagesWithInvalidLinks(input = {}) {
  const { tmpDir, locale = "en", websiteStructure } = input;

  if (!tmpDir) {
    return {
      pagesWithInvalidLinks: [],
      message: "No tmpDir provided. Cannot check for invalid links.",
    };
  }

  if (!websiteStructure || !Array.isArray(websiteStructure)) {
    return {
      pagesWithInvalidLinks: [],
      message: "No website structure provided. Cannot check for invalid links.",
    };
  }

  // Build allowed links from updated website structure
  const allowedLinks = buildAllowedLinksFromStructure(websiteStructure, locale, getFileName);

  // Get locale directory
  const localeDir = join(tmpDir, locale);
  const pagesWithInvalidLinks = [];

  // Iterate through websiteStructure to check each page
  for (const pageInfo of websiteStructure) {
    try {
      // Generate file name from page path
      const flatName = pageInfo.path.replace(/^\//, "").replace(/\//g, "-");
      const fileFullName = getFileName({ locale, fileName: flatName });
      const filePath = join(localeDir, fileFullName);

      // Try to read the page file
      let content;
      try {
        content = await readFile(filePath, "utf8");
      } catch (error) {
        // Skip if file doesn't exist
        if (error.code === "ENOENT") {
          console.warn(`⚠️  Page file not found: ${filePath}`);
          continue;
        }
      }
      // Parse YAML content
      const parsedContent = parse(content);

      // Validate links against allowed links
      const linkErrors = validateInternalLinks(parsedContent, allowedLinks, LINK_PROTOCOL);

      if (linkErrors.length > 0) {
        pagesWithInvalidLinks.push({
          ...pageInfo,
          invalidLinks: linkErrors.map((err) => err.message),
        });
      }
    } catch (error) {
      // Skip pages that can't be read or parsed
      console.warn(`⚠️  Failed to check page ${pageInfo.path}: ${error.message}`);
    }
  }
  return {
    pagesWithInvalidLinks,
  };
}

findPagesWithInvalidLinks.taskTitle = "Find pages with invalid links";
findPagesWithInvalidLinks.description =
  "Programmatically identify pages that contain invalid internal links after structure changes";
