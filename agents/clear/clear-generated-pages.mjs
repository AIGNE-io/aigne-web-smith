import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { loadWebsiteStructureResult } from "../../utils/pages-finder-utils.mjs";
import { getFileName, toDisplayPath } from "../../utils/utils.mjs";
import choosePages from "../utils/choose-pages.mjs";

const title = "Pages";

/**
 * Clear generated pages - allows interactive selection of pages to delete
 * @param {Object} input - Input parameters
 * @param {string} input.tmpDir - Temporary directory path (workspace directory)
 * @param {string} input.locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @param {Array<string>} input.locales - All available locales including translations
 * @param {string} input.projectId - Project identifier
 * @param {Array<string>} [input.pages] - Optional array of page paths to clear (bypasses selection)
 * @param {Object} options - Additional options with prompts and context
 * @returns {Promise<Object>} Result with message and cleared pages info
 */
export default async function clearGeneratedPages(input = {}, options = {}) {
  const { tmpDir, locale = "en", locales = [], projectId, pages } = input;

  if (!tmpDir) {
    return {
      message: `🗂️ ${title}\n  • No tmpDir provided. Nothing to clear.`,
      error: true,
    };
  }

  // Load website structure result
  const websiteStructureResult = await loadWebsiteStructureResult(tmpDir);

  // Use choose-pages to get selected pages
  const choosePagesResult = await choosePages(
    {
      pages,
      websiteStructureResult,
      projectId,
      tmpDir,
      isTranslate: false,
      feedback: null,
      locale,
      requiredFeedback: false, // Don't require feedback for clearing
      multipleSelection: true,
    },
    options,
  );

  const selectedPages = choosePagesResult.selectedPages;

  if (!selectedPages || selectedPages.length === 0) {
    return {
      message: `🗂️ ${title}\n  • No pages selected to clear.`,
    };
  }

  // Get all available locales (fallback to just the main locale if none provided)
  const allLocales = Array.isArray(locales) && locales.length > 0 ? locales : [locale];

  const results = [];
  let clearedCount = 0;
  const clearedPages = [];

  // For each selected page, delete its files from all locale directories
  for (const page of selectedPages) {
    const pagePath = page.path;
    const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-");
    const pageTitle = page.title || pagePath;

    let pageCleared = false;

    // Delete the page file from each locale directory
    for (const currentLocale of allLocales) {
      const localeDir = join(tmpDir, currentLocale);

      // Skip if locale directory doesn't exist
      if (!existsSync(localeDir)) {
        continue;
      }

      // Generate the expected file name for this locale
      const expectedFileName = getFileName({
        locale: currentLocale,
        fileName: flatName,
      });

      const filePath = join(localeDir, expectedFileName);

      // Check if file exists and delete it
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
          pageCleared = true;
          results.push({
            status: "removed",
            message: `✔ Cleared ${pageTitle} (${currentLocale})`,
            path: toDisplayPath(filePath),
            locale: currentLocale,
          });
        } catch (error) {
          results.push({
            status: "error",
            message: `✗ Failed to clear ${pageTitle} (${currentLocale}): ${error.message}`,
            path: toDisplayPath(filePath),
            locale: currentLocale,
          });
        }
      }
    }

    if (pageCleared) {
      clearedCount++;
      clearedPages.push({
        path: pagePath,
        title: pageTitle,
      });
    } else {
      results.push({
        status: "noop",
        message: `• ${pageTitle} not found in generated pages`,
        path: pagePath,
      });
    }
  }

  const hasError = results.some((item) => item.status === "error");
  const header = hasError
    ? `⚠️ ${title}(Cleanup finished with some issues)`
    : clearedCount > 0
      ? `🗂️ ${title}`
      : `🗂️ ${title}\n  • No pages were cleared`;

  const detailLines = results.map((item) => `  ${item.message}`).join("\n");

  const message = [header, "", detailLines, ""].filter(Boolean).join("\n");

  return {
    message,
    clearedCount,
    clearedPages,
    results,
  };
}

clearGeneratedPages.taskTitle = "Clear generated pages";
clearGeneratedPages.description = "Interactively select and clear specific generated pages";
