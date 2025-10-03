import {
  getUpdatePageInputJsonSchema,
  getUpdatePageOutputJsonSchema,
  validateUpdatePageInput,
} from "../../../types/website-structure-schema.mjs";

export default async function updatePage(input, options) {
  // Validate input using Zod schema
  const validation = validateUpdatePageInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update page: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure: input.websiteStructure,
      message: errorMessage,
    };
  }

  const { path, title, description, sourceIds } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Find the page to update
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot update page: Page '${path}' does not exist. Please specify an existing page path.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      message: errorMessage,
    };
  }

  const originalPage = websiteStructure[pageIndex];

  // Create updated page object
  const updatedPage = {
    ...originalPage,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(sourceIds !== undefined && { sourceIds: [...sourceIds] }), // Create a copy of the array
  };

  // Update the website structure
  const updatedStructure = [...websiteStructure];
  updatedStructure[pageIndex] = updatedPage;

  const updatedFields = [];
  if (title !== undefined) updatedFields.push(`title to '${title}'`);
  if (description !== undefined) updatedFields.push(`description`);
  if (sourceIds !== undefined) updatedFields.push(`sourceIds (${sourceIds.length} sources)`);

  const successMessage = `updatePage executed successfully.
  Successfully updated page '${originalPage.title}' at path '${path}': ${updatedFields.join(", ")}.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

updatePage.taskTitle = "Update Page Properties";
updatePage.description = "Update properties of an existing page in the website structure";
updatePage.inputSchema = getUpdatePageInputJsonSchema();
updatePage.outputSchema = getUpdatePageOutputJsonSchema();
