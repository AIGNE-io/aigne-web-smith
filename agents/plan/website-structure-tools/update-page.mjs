import isEqual from "lodash/isEqual.js";
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
      error: { message: errorMessage },
    };
  }

  const { path, title, description, navigation, sourceIds } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputs = options.context?.userContext?.lastToolInputs || {};
  const currentInput = { path, title, description, navigation, sourceIds };

  if (lastToolInputs.updatePage && isEqual(lastToolInputs.updatePage, currentInput)) {
    const errorMessage = `Cannot update page: This operation has already been processed. Please do not call updatePage again with the same parameters.`;
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  // Find the page to update
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot update page: Page '${path}' does not exist. Please specify an existing page path.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  const originalPage = websiteStructure[pageIndex];

  // Create updated page object
  const updatedPage = {
    ...originalPage,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(navigation !== undefined && { navigation: { ...navigation } }), // Create a copy of the navigation object
    ...(sourceIds !== undefined && { sourceIds: [...sourceIds] }), // Create a copy of the array
  };

  // Update the website structure
  const updatedStructure = [...websiteStructure];
  updatedStructure[pageIndex] = updatedPage;

  const updatedFields = [];
  if (title !== undefined) updatedFields.push(`title to '${title}'`);
  if (description !== undefined) updatedFields.push(`description`);
  if (navigation !== undefined) updatedFields.push(`navigation (title: '${navigation.title}')`);
  if (sourceIds !== undefined) updatedFields.push(`sourceIds (${sourceIds.length} sources)`);

  const successMessage = `updatePage executed successfully.
  Successfully updated page '${originalPage.title}' at path '${path}': ${updatedFields.join(", ")}.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

  // Save current input to prevent duplicate calls
  if (!options.context.userContext.lastToolInputs) {
    options.context.userContext.lastToolInputs = {};
  }
  options.context.userContext.lastToolInputs.updatePage = currentInput;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

updatePage.taskTitle = "Update Page Properties";
updatePage.description = "Update properties of an existing page in the website structure";
updatePage.inputSchema = getUpdatePageInputJsonSchema();
updatePage.outputSchema = getUpdatePageOutputJsonSchema();
