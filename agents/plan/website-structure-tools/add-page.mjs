import isEqual from "lodash/isEqual.js";
import {
  getAddPageInputJsonSchema,
  getAddPageOutputJsonSchema,
  validateAddPageInput,
} from "../../../types/website-structure-schema.mjs";

export default async function addPage(input, options) {
  // Validate input using Zod schema
  const validation = validateAddPageInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot add page: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure: input.websiteStructure,
      error: { message: errorMessage },
    };
  }

  const { title, description, path, navigation, parentId, sourceIds } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputs = options.context?.userContext?.lastToolInputs || {};
  const currentInput = { title, description, path, navigation, parentId, sourceIds };

  if (lastToolInputs.addPage && isEqual(lastToolInputs.addPage, currentInput)) {
    const errorMessage = `Cannot add page: This operation has already been processed. Please do not call addPage again with the same parameters.`;
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  // Validate parent exists if parentId is provided
  if (parentId && parentId !== "null") {
    const parentExists = websiteStructure.some((item) => item.path === parentId);
    if (!parentExists) {
      const errorMessage = `Cannot add page: Parent page '${parentId}' not found.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        websiteStructure,
        error: { message: errorMessage },
      };
    }
  }

  // Check if page with same path already exists
  const existingPage = websiteStructure.find((item) => item.path === path);
  if (existingPage) {
    const errorMessage = `Cannot add page: A page with path '${path}' already exists. Choose a different path.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      error: { message: errorMessage },
    };
  }

  // Create new page object
  const newPage = {
    title,
    description,
    path,
    navigation: { ...navigation },
    parentId: parentId || null,
    sourceIds: [...sourceIds],
  };

  // Add the new page to the website structure
  const updatedStructure = [...websiteStructure, newPage];

  const successMessage = `**addPage executed successfully.**
  Successfully added page '${title}' at path '${path}'${parentId ? ` under parent '${parentId}'` : " as a top-level page"}.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

  // Save current input to prevent duplicate calls
  if (!options.context.userContext.lastToolInputs) {
    options.context.userContext.lastToolInputs = {};
  }
  options.context.userContext.lastToolInputs.addPage = currentInput;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

addPage.taskTitle = "Add page";
addPage.description =
  "Add a new page to the website structure with specified title, path and parent";
addPage.inputSchema = getAddPageInputJsonSchema();
addPage.outputSchema = getAddPageOutputJsonSchema();
