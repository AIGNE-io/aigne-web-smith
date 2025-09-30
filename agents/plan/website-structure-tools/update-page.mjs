import {
  getUpdatePageInputJsonSchema,
  getUpdatePageOutputJsonSchema,
  validateUpdatePageInput,
} from "../../../types/website-structure-schema.mjs";

export default async function updatePage(input) {
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

  const { websiteStructure, path, title, description, sourceIds } = validation.data;

  // Find the page to update
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot update page: Page '${path}' does not exist. Choose an existing page to update.`;
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

  const successMessage = `Successfully updated page '${originalPage.title}' at path '${path}': ${updatedFields.join(", ")}.`;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

updatePage.taskTitle = "Update page";
updatePage.description = "Update properties of an existing page in the website structure";
updatePage.inputSchema = getUpdatePageInputJsonSchema();
updatePage.outputSchema = getUpdatePageOutputJsonSchema();
