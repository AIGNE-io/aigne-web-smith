import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { loadWebsiteStructureResult, getMainLanguageFiles, fileNameToFlatPath, findItemByFlatName } from "../../utils/pages-finder-utils.mjs";
import { getFileName, toDisplayPath } from "../../utils/utils.mjs";

const title = "Pages";

/**
 * Clear generated pages - allows interactive selection of pages to delete
 * @param {Object} input - Input parameters
 * @param {string} input.tmpDir - Temporary directory path (workspace directory)
 * @param {string} input.locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @param {Array<string>} input.locales - All available locales including translations
 * @param {Array<string>} [input.pages] - Optional array of page paths to clear (bypasses selection)
 * @param {Object} options - Additional options with prompts and context
 * @returns {Promise<Object>} Result with message and cleared pages info
 */
export default async function clearGeneratedPages(input = {}, options = {}) {
  const { tmpDir, locale = "en", locales = [], pages } = input;

  if (!tmpDir) {
    return {
      message: `🗂️ ${title}\n  • No tmpDir provided. Nothing to clear.`,
      error: true,
    };
  }

  // Load website structure result (may be null)
  const websiteStructureResult = await loadWebsiteStructureResult(tmpDir);

  const mainFileTmpDir = join(tmpDir, locale);
  let selectedPages = [];

  // If pages parameter is provided, use it directly
  if (pages && pages.length > 0) {
    // Convert page paths to selectedPages format
    for (const pagePath of pages) {
      // Convert page path to flatName
      const flatName = fileNameToFlatPath(pagePath.replace(/^\//, "").replace(/\//g, "-"));
      const foundItem = websiteStructureResult
        ? findItemByFlatName(websiteStructureResult, flatName)
        : null;

      // Generate expected file name for main locale
      const fileName = getFileName({
        locale,
        fileName: flatName,
      });

      selectedPages.push({
        fileName,
        flatName,
        title: foundItem?.title,
      });
    }
  } else {
    // Get all main language page files
    const mainLanguageFiles = await getMainLanguageFiles(
      mainFileTmpDir,
      locale,
      websiteStructureResult,
    );

    if (mainLanguageFiles.length === 0) {
      return {
        message: `🗂️ ${title}\n  • No pages found to clear.`,
      };
    }

    // Create choices with title and filename
    const choices = mainLanguageFiles.map((fileName) => {
      const flatName = fileNameToFlatPath(fileName);
      const foundItem = websiteStructureResult
        ? findItemByFlatName(websiteStructureResult, flatName)
        : null;

      const displayName = foundItem?.title
        ? `${foundItem.title} (${fileName})`
        : fileName;

      return {
        name: displayName,
        value: fileName,
        flatName,
        title: foundItem?.title,
      };
    });

    // Let user select files
    const selectedFileNames = await options.prompts.checkbox({
      message: "Select pages to clear:",
      source: (term) => {
        if (!term) return choices;

        return choices.filter((choice) =>
          choice.name.toLowerCase().includes(term.toLowerCase()),
        );
      },
      validate: (answer) => {
        if (answer.length === 0) {
          return "Please select at least one page";
        }
        return true;
      },
    });

    if (!selectedFileNames || selectedFileNames.length === 0) {
      return {
        message: `🗂️ ${title}\n  • No pages selected to clear.`,
      };
    }

    // Convert selected files to selectedPages format using choice data
    const choiceMap = new Map(choices.map((v) => [v.value, v]));
    selectedPages = selectedFileNames.map((fileName) => {
      const item = choiceMap.get(fileName);
      const flatName = fileNameToFlatPath(fileName);

      return {
        fileName, 
        flatName, 
        title: item?.title, 
      };
    });
  }

  if (selectedPages.length === 0) {
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
    const { fileName, flatName, title } = page;
    const pageTitle = title || fileName;

    let pageCleared = false;

    // Delete the page file from each locale directory
    for (const currentLocale of allLocales) {
      const localeDir = join(tmpDir, currentLocale);

      // Skip if locale directory doesn't exist
      if (!existsSync(localeDir)) {
        continue;
      }

      const filePath = join(localeDir, fileName);

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
        path: flatName,
        title: pageTitle,
      });
    } else {
      results.push({
        status: "noop",
        message: `• ${pageTitle} not found in generated pages`,
        path: flatName,
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
  };
}

clearGeneratedPages.taskTitle = "Clear generated pages";
clearGeneratedPages.description = "Interactively select and clear specific generated pages";
