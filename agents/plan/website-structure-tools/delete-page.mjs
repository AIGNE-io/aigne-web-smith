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
      message: errorMessage,
      error: { message: errorMessage },
    };
  }

  const { path } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Find the page to delete
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot delete page: Page '${path}' does not exist. Please choose an existing page to delete.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      message: errorMessage,
      error: { message: errorMessage },
    };
  }

  const pageToDelete = websiteStructure[pageIndex];

  // Check if any other pages have this page as parent
  const childPages = websiteStructure.filter((item) => item.parentId === path);
  if (childPages.length > 0) {
    const errorMessage = `Cannot delete page: Page '${path}' has ${childPages.length} child page(s): ${childPages.map((p) => p.path).join(", ")}. Please first move or delete these child pages.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      message: errorMessage,
      error: { message: errorMessage },
    };
  }

  // Remove the page from the website structure
  const updatedStructure = websiteStructure.filter((_, index) => index !== pageIndex);

  const successMessage = `deletePage executed successfully.
  Successfully deleted page '${pageToDelete.title}' from path '${path}'.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

deletePage.taskTitle = "Delete page";
deletePage.description = "Delete a page from the website structure";
deletePage.inputSchema = getDeletePageInputJsonSchema();
deletePage.outputSchema = getDeletePageOutputJsonSchema();
