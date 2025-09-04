import {
  addFeedbackToItems,
  findItemByPath,
  getActionText,
  getMainLanguageFiles,
  processSelectedFiles,
} from "../utils/pages-finder-utils.mjs";

export default async function selectedPages(
  { pages, structurePlanResult, projectId, pagesDir, isTranslate, feedback, locale },
  options,
) {
  let foundItems = [];
  let selectedFiles = [];

  // If pages is empty or not provided, let user select multiple pages
  if (!pages || pages.length === 0) {
    try {
      // Get all main language page files in pagesDir
      const mainLanguageFiles = await getMainLanguageFiles(pagesDir, locale, structurePlanResult);

      if (mainLanguageFiles.length === 0) {
        throw new Error("No pages found in the pages directory");
      }

      // Let user select multiple files
      selectedFiles = await options.prompts.checkbox({
        message: getActionText(isTranslate, "Select pages to {action}:"),
        source: (term) => {
          const choices = mainLanguageFiles.map((file) => ({
            name: file,
            value: file,
          }));

          if (!term) return choices;

          return choices.filter((choice) => choice.name.toLowerCase().includes(term.toLowerCase()));
        },
        validate: (answer) => {
          if (answer.length === 0) {
            return "Please select at least one page";
          }
          return true;
        },
      });

      if (!selectedFiles || selectedFiles.length === 0) {
        throw new Error("No pages selected");
      }

      // Process selected files and convert to found items
      foundItems = await processSelectedFiles(selectedFiles, structurePlanResult, pagesDir);
    } catch (error) {
      console.error(error);
      throw new Error(
        getActionText(
          isTranslate,
          "Please provide a pages parameter to specify which pages to {action}",
        ),
      );
    }
  } else {
    // Process the provided pages array
    for (const pagePath of pages) {
      const foundItem = await findItemByPath(
        structurePlanResult,
        pagePath,
        projectId,
        pagesDir,
        locale,
      );

      if (!foundItem) {
        console.warn(`⚠️  Item with path "${pagePath}" not found in structurePlanResult`);
        continue;
      }

      foundItems.push({
        ...foundItem,
      });
    }

    if (foundItems.length === 0) {
      throw new Error("None of the specified page paths were found in structurePlanResult");
    }
  }

  // Prompt for feedback if not provided
  let userFeedback = feedback;
  if (!userFeedback) {
    const feedbackMessage = getActionText(
      isTranslate,
      "Please provide feedback for the {action} (press Enter to skip):",
    );

    userFeedback = await options.prompts.input({
      message: feedbackMessage,
    });
  }

  // Add feedback to all results if provided
  foundItems = addFeedbackToItems(foundItems, userFeedback);

  return {
    selectedPages: foundItems,
    feedback: userFeedback,
    selectedPaths: foundItems.map((item) => item.path),
  };
}
