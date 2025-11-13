import isEqual from "lodash/isEqual.js";
import {
  getDeletePageInputJsonSchema,
  getDeletePageOutputJsonSchema,
  validateDeletePageInput,
} from "../../../types/website-structure-schema.mjs";

export default async function deletePage(input, options) {
  // Validate input using Zod schema
  const validation = validateDeletePageInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot delete page: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure: input.websiteStructure,
      error: { message: errorMessage },
    };
  }

  const { path, recursive = false } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputs = options.context?.userContext?.lastToolInputs || {};
  const currentInput = { path, recursive };

  if (lastToolInputs.deletePage && isEqual(lastToolInputs.deletePage, currentInput)) {
    const errorMessage = `Cannot delete page: This operation has already been processed. Please do not call deletePage again with the same parameters.`;
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  // Find the page to delete
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot delete page: Page '${path}' does not exist. Please choose an existing page to delete.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  const pageToDelete = websiteStructure[pageIndex];

  // Check if any other pages have this page as parent
  const childPages = websiteStructure.filter((item) => item.parentId === path);
  if (childPages.length > 0 && !recursive) {
    const errorMessage = `Cannot delete page: Page '${path}' has ${childPages.length} child page(s): ${childPages.map((p) => p.path).join(", ")}. Please first move or delete these child pages, or set recursive=true to delete them all.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  // Collect all pages to delete
  const pathsToDelete = new Set([path]);
  if (recursive) {
    const collectDescendants = (parentPath) => {
      websiteStructure
        .filter((item) => item.parentId === parentPath)
        .forEach((child) => {
          pathsToDelete.add(child.path);
          collectDescendants(child.path);
        });
    };
    collectDescendants(path);
  }

  // Remove all pages to delete from the structure
  const updatedStructure = websiteStructure.filter((item) => !pathsToDelete.has(item.path));
  const deletedCount = pathsToDelete.size - 1; // Exclude the main page from count

  const successMessage = `deletePage executed successfully.
  Successfully deleted page '${pageToDelete.title}' from path '${path}'${recursive && deletedCount > 0 ? ` along with ${deletedCount} child page(s)` : ""}.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

  // Save current input to prevent duplicate calls
  if (!options.context.userContext.lastToolInputs) {
    options.context.userContext.lastToolInputs = {};
  }
  options.context.userContext.lastToolInputs.deletePage = currentInput;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

deletePage.taskTitle = "Delete page";
deletePage.description = "Delete a page from the website structure";
deletePage.inputSchema = getDeletePageInputJsonSchema();
deletePage.outputSchema = getDeletePageOutputJsonSchema();
