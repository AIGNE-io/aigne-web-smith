import {
  fileNameToFlatPath,
  findItemByFlatName,
  findItemByPath as findItemByPathUtil,
  getActionText,
  getMainLanguageFiles,
  readFileContent,
} from "../utils/pages-finder-utils.mjs";

export default async function findItemByPath(
  { page, structurePlanResult, projectId, pagesDir, isTranslate, feedback, locale },
  options,
) {
  let foundItem = null;
  let selectedFileContent = null;
  let pagePath = page;

  // If pagePath is empty, let user select from available pages
  if (!pagePath) {
    try {
      // Get all main language page files in pagesDir
      const mainLanguageFiles = await getMainLanguageFiles(pagesDir, locale, structurePlanResult);

      if (mainLanguageFiles.length === 0) {
        throw new Error("No pages found in the pages directory");
      }

      // Let user select a file
      const selectedFile = await options.prompts.search({
        message: getActionText(isTranslate, "Select a page to {action}:"),
        source: async (input) => {
          if (!input || input.trim() === "") {
            return mainLanguageFiles.map((file) => ({
              name: file,
              value: file,
            }));
          }

          const searchTerm = input.trim().toLowerCase();
          const filteredFiles = mainLanguageFiles.filter((file) =>
            file.toLowerCase().includes(searchTerm),
          );

          return filteredFiles.map((file) => ({
            name: file,
            value: file,
          }));
        },
      });

      if (!selectedFile) {
        throw new Error("No page selected");
      }

      // Read the selected page file content
      selectedFileContent = await readFileContent(pagesDir, selectedFile);

      // Convert filename back to path
      const flatName = fileNameToFlatPath(selectedFile);

      // Try to find matching item by comparing flattened paths
      const foundItemByFile = findItemByFlatName(structurePlanResult, flatName);

      if (!foundItemByFile) {
        throw new Error("No page found");
      }

      pagePath = foundItemByFile.path;
    } catch (error) {
      console.debug(error?.message);
      throw new Error(
        getActionText(
          isTranslate,
          "Please run 'aigne page generate' first to generate pages, then select which page to {action}",
        ),
      );
    }
  }

  // Use the utility function to find item and read content
  foundItem = await findItemByPathUtil(structurePlanResult, pagePath, projectId, pagesDir, locale);

  if (!foundItem) {
    throw new Error(`Item with path "${pagePath}" not found in structurePlanResult`);
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

  // Merge the found item and ensure content is available
  const result = {
    ...foundItem,
  };

  // Add content if we read it from user selection (takes precedence over utility method content)
  if (selectedFileContent !== null) {
    result.content = selectedFileContent;
  }

  // Add feedback to result if provided
  if (userFeedback?.trim()) {
    result.feedback = userFeedback.trim();
  }

  return result;
}
