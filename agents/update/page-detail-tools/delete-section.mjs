import isEqual from "lodash/isEqual.js";

import YAML from "yaml";
import {
  getDeleteSectionInputJsonSchema,
  getDeleteSectionOutputJsonSchema,
  validateDeleteSectionInput,
} from "../../../types/page-detail-schema.mjs";

export default async function deleteSection(input, options) {
  // Validate input using Zod schema
  const validation = validateDeleteSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot delete section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail: input.pageDetail,
      error: { message: errorMessage },
    };
  }

  const { name } = validation.data;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputs = options.context?.userContext?.lastToolInputs || {};
  const currentInput = { name };

  if (lastToolInputs.deleteSection && isEqual(lastToolInputs.deleteSection, currentInput)) {
    const errorMessage = `Cannot delete section: This operation has already been processed. Please do not call deleteSection again with the same parameters.`;
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot delete section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    const errorMessage = "Cannot delete section: No sections array found in page detail.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Find the section to delete
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    const errorMessage = `Cannot delete section: Section '${name}' not found. Please choose an existing section to delete.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  const sectionToDelete = parsedPageDetail.sections[sectionIndex];

  // Create new sections array without the deleted section
  const newSections = parsedPageDetail.sections.filter((_, index) => index !== sectionIndex);

  // Create updated page detail
  const updatedPageDetail = {
    ...parsedPageDetail,
    sections: newSections,
  };

  const successMessage = `deleteSection executed successfully.
  Successfully deleted section '${sectionToDelete.sectionName}'.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
    lineWidth: 0,
  });
  // update shared page detail
  options.context.userContext.currentPageDetail = latestPageDetail;

  // Save current input to prevent duplicate calls
  if (!options.context.userContext.lastToolInputs) {
    options.context.userContext.lastToolInputs = {};
  }
  options.context.userContext.lastToolInputs.deleteSection = currentInput;

  return {
    status: "success",
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

deleteSection.taskTitle = "Delete section";
deleteSection.description = "Delete a section from the page detail by its name";
deleteSection.inputSchema = getDeleteSectionInputJsonSchema();
deleteSection.outputSchema = getDeleteSectionOutputJsonSchema();
