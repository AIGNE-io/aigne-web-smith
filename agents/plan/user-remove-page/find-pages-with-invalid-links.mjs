import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { LINK_PROTOCOL } from "../../../utils/constants.mjs";
import {
  buildAllowedLinksFromStructure,
  validateInternalLinks,
} from "../../../utils/protocol-utils.mjs";
import { getFileName } from "../../../utils/utils.mjs";
import formatWebsiteStructure from "../../utils/format-website-structure.mjs";

/**
 * Find pages with invalid links after page deletion
 */
export default async function findPagesWithInvalidLinks(input = {}) {
  const {
    websiteStructure: rawWebsiteStructure = [],
    originalWebsiteStructure = [],
    tmpDir,
    locale = "en",
  } = input;

  if (!tmpDir || !rawWebsiteStructure || rawWebsiteStructure.length === 0) {
    return {
      pagesWithInvalidLinks: [],
    };
  }

  // Build allowed links from updated website structure
  const { websiteStructure } = await formatWebsiteStructure({
    websiteStructure: rawWebsiteStructure,
    originalWebsiteStructure,
  });
  const allowedLinks = buildAllowedLinksFromStructure(websiteStructure, locale, getFileName);

  const pagesWithInvalidLinks = [];

  // Check each existing page for invalid links
  for (const page of websiteStructure) {
    const flatName = page.path.replace(/^\//, "").replace(/\//g, "-");
    const fileFullName = getFileName({ locale, fileName: flatName });
    const filePath = join(tmpDir, locale, fileFullName);

    let fileContent = null;
    try {
      fileContent = await readFile(filePath, "utf8");
    } catch {
      // File doesn't exist, skip
      continue;
    }

    // Parse YAML content, skip if parsing fails
    let parsedData = null;
    try {
      parsedData = parse(fileContent);
      // Handle array format (take first element if array)
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        parsedData = parsedData[0];
      }
    } catch {
      continue;
    }

    // Validate internal links only
    const linkErrors = validateInternalLinks(parsedData, allowedLinks, LINK_PROTOCOL);

    if (linkErrors.length > 0) {
      // Collect all invalid links
      const invalidLinks = linkErrors.map((error) => error.details?.invalidLink).filter(Boolean);

      if (invalidLinks.length > 0) {
        pagesWithInvalidLinks.push({
          path: page.path,
          title: page.title || page.path,
          invalidLinks,
        });
      }
    }
  }

  return {
    pagesWithInvalidLinks,
  };
}

findPagesWithInvalidLinks.taskTitle = "Find pages with invalid links";
findPagesWithInvalidLinks.description =
  "Detect pages with invalid internal links after page deletion";
