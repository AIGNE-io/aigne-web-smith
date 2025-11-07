import { join } from "node:path";
import fs from "fs-extra";
import { parse, stringify } from "yaml";
import { generateSitemapYaml, loadNavigationLocalesMap } from "../agents/utils/save-pages.mjs";

/**
 * Update publishedAt timestamp for successfully published pages
 * @param {Object} params - Parameters object
 * @param {Array} params.publishResults - Array of publish results
 * @param {string} params.pagesDir - Temporary pages directory
 * @param {string} params.tmpPagesDir - Temporary pages directory
 * @param {string} params.outputDir - Output directory to copy files back to
 * @param {string} params.locale - Main locale
 * @param {Array<string>} params.translateLanguages - Translation languages
 * @param {string} params.projectName - Project name
 * @param {Array<{path: string, title: string, parentId?: string}>} params.websiteStructure - Website structure
 * @returns {Promise<void>}
 */
export async function updatePublishedAtTimestamp({
  publishResults,
  pagesDir,
  tmpPagesDir,
  outputDir,
  locale,
  translateLanguages = [],
  projectName,
  websiteStructure,
}) {
  const now = new Date().toISOString();
  const successfulPages = publishResults.filter((result) => result?.success && result?.file);
  const updatedFiles = [];

  for (const result of successfulPages) {
    try {
      const filePath = join(tmpPagesDir, result.file);
      const pageContent = await fs.readFile(filePath, "utf-8");
      const parsedPageContent = parse(pageContent);

      // Update publishedAt to current timestamp
      parsedPageContent.publishedAt = now;

      // Write back to temp file
      const updatedContent = stringify(parsedPageContent, { aliasDuplicateObjects: false });
      await fs.writeFile(filePath, updatedContent, "utf-8");

      // Copy updated file back to outputDir
      const outputFilePath = join(outputDir, result.file);
      await fs.copy(filePath, outputFilePath, { overwrite: true });

      updatedFiles.push({
        filePath: result.file,
        content: updatedContent,
      });
    } catch (error) {
      // Silently ignore errors when updating publishedAt
      console.warn(`Failed to update publishedAt for ${result.file}: ${error.message}`);
    }
  }

  // Regenerate and update _sitemap.yaml if any pages were updated
  if (updatedFiles.length > 0) {
    await regenerateSitemap({
      pagesDir,
      outputDir,
      locale,
      translateLanguages,
      projectName,
      websiteStructure,
    });
  }
}

/**
 * Regenerate _sitemap.yaml using generateSitemapYaml
 * @param {Object} params - Parameters object
 * @param {string} params.pagesDir - Temporary pages directory (for loading navigation locales)
 * @param {string} params.outputDir - Output directory
 * @param {string} params.locale - Main locale
 * @param {Array<string>} params.translateLanguages - Translation languages
 * @param {string} params.projectName - Project name
 * @param {Array<{path: string, title: string, parentId?: string}>} params.websiteStructure - Website structure
 * @returns {Promise<void>}
 */
async function regenerateSitemap({
  pagesDir,
  outputDir,
  locale,
  translateLanguages = [],
  projectName,
  websiteStructure,
}) {
  try {
    const sitemapPath = join(outputDir, "_sitemap.yaml");

    // Read all page files from outputDir to build allPagesKitYaml
    const files = await fs.readdir(outputDir);
    const yamlFiles = files.filter(
      (file) => (file.endsWith(".yaml") || file.endsWith(".yml")) && !file.startsWith("_"),
    );

    const allPagesKitYaml = [];
    for (const file of yamlFiles) {
      try {
        const filePath = join(outputDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        allPagesKitYaml.push({
          filePath: file,
          content,
        });
      } catch (error) {
        console.warn(`Failed to read page file ${file}: ${error.message}`);
      }
    }

    // Load navigation locales using the same logic as save-pages.mjs
    let navigationLocalesMap = new Map();
    try {
      navigationLocalesMap = await loadNavigationLocalesMap(pagesDir, [
        locale,
        ...translateLanguages,
      ]);
    } catch (error) {
      console.warn("Failed to load localized navigations:", error.message);
    }

    // Regenerate sitemap using the same logic as save-pages.mjs
    const newSitemapContent = generateSitemapYaml(
      websiteStructure,
      allPagesKitYaml,
      locale,
      translateLanguages,
      projectName,
      navigationLocalesMap,
    );

    // Write regenerated sitemap
    await fs.writeFile(sitemapPath, newSitemapContent, "utf-8");
  } catch (error) {
    console.warn(`Failed to regenerate _sitemap.yaml: ${error.message}`);
  }
}
