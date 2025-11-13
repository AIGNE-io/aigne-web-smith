import { WEB_ACTION } from "../../../utils/constants.mjs";
import { loadWebsiteStructureResult } from "../../../utils/pages-finder-utils.mjs";
import choosePages from "../../utils/choose-pages.mjs";
import deletePage from "../website-structure-tools/delete-page.mjs";

/**
 * Remove selected pages from website structure
 * @param {Object} input - Input parameters from config
 * @param {Object} options - Additional options with prompts and context
 * @returns {Promise<Object>} Result with deleted pages and updated structure
 */
export default async function removePagesFromStructure(input = {}, options = {}) {
  const { tmpDir, locale = "en", projectId = [] } = input;

  if (!tmpDir) {
    return {
      message: "🗑️ Remove Pages\n  • No tmpDir found in config. Nothing to remove.",
      error: true,
    };
  }

  // Load website structure
  const websiteStructure = await loadWebsiteStructureResult(tmpDir);

  if (!websiteStructure || websiteStructure.length === 0) {
    return {
      message: "🗑️ Remove Pages\n  • No website structure found. Please generate pages first.",
      error: true,
    };
  }

  // Use choose-pages to get selected pages
  const choosePagesResult = await choosePages(
    {
      websiteStructureResult: websiteStructure,
      projectId,
      tmpDir,
      isTranslate: false,
      feedback: null,
      locale,
      requiredFeedback: false,
      multipleSelection: true,
      action: WEB_ACTION.clear,
    },
    options,
  );

  const selectedPages = choosePagesResult.selectedPages;

  if (!selectedPages || selectedPages.length === 0) {
    return {
      message: "🗑️ Remove Pages\n  • No pages selected to remove.",
      websiteStructure: websiteStructure,
      deletedPages: [],
      errors: [],
    };
  }

  // Initialize context for deletePage tool
  if (!options.context.userContext) {
    options.context.userContext = {};
  }
  options.context.userContext.currentStructure = [...websiteStructure];
  options.context.userContext.lastToolInputs = {};

  // Delete each selected page
  const deletedPages = [];
  const errors = [];

  for (const page of selectedPages) {
    try {
      const deleteResult = await deletePage(
        {
          path: page.path,
          recursive: true,
        },
        options,
      );

      if (deleteResult.error) {
        errors.push({
          path: page.path,
          title: page.title || page.path,
          error: deleteResult.error.message,
        });
      } else {
        deletedPages.push({
          path: page.path,
          title: page.title || page.path,
        });
        // Update current structure for next iteration
        options.context.userContext.currentStructure = deleteResult.websiteStructure;
      }
    } catch (error) {
      errors.push({
        path: page.path,
        title: page.title || page.path,
        error: error.message,
      });
    }
  }

  if (errors.length > 0 && deletedPages.length === 0) {
    console.warn(
      `🗑️ Remove Pages\n  • Failed to remove pages:\n${errors.map((e) => `    - ${e.title}: ${e.error}`).join("\n")}`,
    );
    process.exit(0);
  }

  // Get updated website structure
  const updatedWebsiteStructure = options.context.userContext.currentStructure;

  return {
    originalWebsiteStructure: JSON.parse(JSON.stringify(updatedWebsiteStructure)),
    websiteStructure: updatedWebsiteStructure,
    deletedPages: deletedPages.map((p) => p.path),
  };
}

removePagesFromStructure.taskTitle = "Remove pages from structure";
removePagesFromStructure.description = "Select and remove pages from website structure";
