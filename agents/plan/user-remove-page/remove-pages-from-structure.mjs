import { loadWebsiteStructureResult } from "../../../utils/pages-finder-utils.mjs";
import { buildChoicesFromTree, buildWebsiteTree } from "../../../utils/website-structure-utils.mjs";
import deletePage from "../website-structure-tools/delete-page.mjs";

/**
 * Remove selected pages from website structure
 * @param {Object} input - Input parameters from config
 * @param {Object} options - Additional options with prompts and context
 * @returns {Promise<Object>} Result with deleted pages and updated structure
 */
export default async function removePagesFromStructure(input = {}, options = {}) {
  const { tmpDir, locale = "en" } = input;

  if (!tmpDir) {
    return {
      message: "🗑️ Remove Pages\n  • No tmpDir found in config. Nothing to remove.",
      error: true,
    };
  }

  // Load website structure
  const websiteStructure = await loadWebsiteStructureResult(tmpDir);

  if (!websiteStructure || websiteStructure.length === 0) {
    console.warn("🗑️ Remove Pages\n  • No website structure found. Please generate pages first.");
    process.exit(0);
  }

  const websiteStructureMap = new Map(websiteStructure.map((page) => [page.path, page]));

  // Build tree structure
  const { rootNodes } = buildWebsiteTree(websiteStructure);

  // Build choices with tree structure visualization
  const choices = await buildChoicesFromTree(rootNodes, "", 0, { locale, tmpDir });

  // Let user select pages to delete
  let selectedPaths = [];
  try {
    selectedPaths = await options.prompts.checkbox({
      message: "Select pages to remove (Press Enter with no selection to finish):",
      choices,
    });
  } catch {
    // User cancelled or no selection made
    console.log("No pages were removed.");
    process.exit(0);
  }

  // If no pages selected, exit
  if (!selectedPaths || selectedPaths.length === 0) {
    console.log("No pages were removed.");
    process.exit(0);
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

  for (const path of selectedPaths) {
    const page = websiteStructureMap.get(path);

    try {
      const deleteResult = await deletePage(
        {
          path,
          recursive: true,
        },
        options,
      );

      if (deleteResult.error) {
        errors.push({
          path: path,
          title: page?.title || path,
          error: deleteResult.error.message,
        });
      } else {
        deletedPages.push({
          path: path,
          title: page?.title || path,
        });
        // Update current structure for next iteration
        options.context.userContext.currentStructure = deleteResult.websiteStructure;
      }
    } catch (error) {
      errors.push({
        path,
        title: page?.title || path,
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

  if (deletedPages.length === 0) {
    console.log("No pages were removed.");
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
