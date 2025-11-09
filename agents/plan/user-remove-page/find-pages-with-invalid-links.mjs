import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { LINK_PROTOCOL } from "../../../utils/constants.mjs";
import {
  buildAllowedLinksFromStructure,
  scanForProtocolUrls,
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
  let totalPagesChecked = 0;

  try {
    // Read all YAML files in the locale directory
    const files = await readdir(localeDir);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml") && !file.startsWith("_"));

    totalPagesChecked = yamlFiles.length;

    // Check each page file for invalid links
    for (const file of yamlFiles) {
      try {
        const filePath = join(localeDir, file);
        const content = await readFile(filePath, "utf8");

        // Parse YAML content
        const parsedContent = parse(content);

        // Scan for link:// protocol URLs
        const foundLinks = new Set();
        scanForProtocolUrls(parsedContent, foundLinks, LINK_PROTOCOL);

        // Validate links against allowed links
        const linkErrors = validateInternalLinks(parsedContent, allowedLinks, LINK_PROTOCOL);

        if (linkErrors.length > 0) {
          // Find the page path from website structure
          const flatName = file.replace(/\.yaml$/, "").replace(new RegExp(`^${locale}-`), "");
          const pageInfo = websiteStructure.find((item) => {
            const itemFlatName = item.path.replace(/^\//, "").replace(/\//g, "-");
            const itemFileName = getFileName({ locale, fileName: itemFlatName });
            return itemFileName === file || itemFlatName === flatName;
          });

          if (pageInfo) {
            pagesWithInvalidLinks.push({
              ...pageInfo,
              path: pageInfo.path,
              invalidLinks: linkErrors.map((err) => err.message),
              linkCount: foundLinks.size,
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read or parsed
        console.warn(`⚠️  Failed to check file ${file}: ${error.message}`);
      }
    }
  } catch (error) {
    // If locale directory doesn't exist, return empty result
    if (error.code === "ENOENT") {
      return {
        pagesWithInvalidLinks: [],
        message: `Locale directory ${localeDir} does not exist. No pages to check.`,
      };
    }
    throw error;
  }

  const message =
    pagesWithInvalidLinks.length > 0
      ? `Found ${pagesWithInvalidLinks.length} page(s) with invalid links out of ${totalPagesChecked} checked.`
      : `All ${totalPagesChecked} page(s) have valid links.`;

  return {
    pagesWithInvalidLinks,
    totalPagesChecked,
    message,
  };
}

findPagesWithInvalidLinks.taskTitle = "Find pages with invalid links";
findPagesWithInvalidLinks.description =
  "Programmatically identify pages that contain invalid internal links after structure changes";
