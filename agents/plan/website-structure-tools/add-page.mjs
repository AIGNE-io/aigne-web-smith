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
      message: errorMessage,
    };
  }

  const { title, description, path, parentId, sourceIds } = validation.data;
  let websiteStructure = options.context?.userContext?.currentStructure;

  if (!websiteStructure) {
    websiteStructure = input.websiteStructure;
  }

  // Validate parent exists if parentId is provided
  if (parentId && parentId !== "null") {
    const parentExists = websiteStructure.some((item) => item.path === parentId);
    if (!parentExists) {
      const errorMessage = `Cannot add page: Parent page '${parentId}' not found.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        websiteStructure,
        message: errorMessage,
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
      message: errorMessage,
    };
  }

  // Create new page object
  const newPage = {
    title,
    description,
    path,
    parentId: parentId || null,
    sourceIds: [...sourceIds], // Create a copy of the array
  };

  // Add the new page to the website structure
  const updatedStructure = [...websiteStructure, newPage];

  const successMessage = `**addPage executed successfully.**
  Successfully added page '${title}' at path '${path}'${parentId ? ` under parent '${parentId}'` : " as a top-level page"}.
  Check if this version of websiteStructure meets user feedback, if so, all operations have been successfully executed.`;

  // update shared website structure
  options.context.userContext.currentStructure = updatedStructure;

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
