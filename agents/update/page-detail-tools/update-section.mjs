import isEqual from "lodash/isEqual.js";
import YAML from "yaml";
import {
  getUpdateSectionInputJsonSchema,
  getUpdateSectionOutputJsonSchema,
  validateUpdateSectionInput,
} from "../../../types/page-detail-schema.mjs";
import { YAML_STRINGIFY_OPTIONS } from "../../../utils/constants.mjs";
import {
  handleFailure,
  initializeFailureCount,
  userContextAt,
} from "../../../utils/retry-utils.mjs";
import { validateSingleSection } from "../../../utils/utils.mjs";

export default async function updateSection(input, options) {
  initializeFailureCount(options);

  // Validate input using Zod schema
  const validation = validateUpdateSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail: input.pageDetail,
      error: { message: errorMessage },
    };
  }

  const { name, updates, path } = validation.data;
  const { componentLibrary } = input;
  const pageDetailCtx = userContextAt(options, `currentPageDetails.${path}`);
  let pageDetail = pageDetailCtx.get();

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputsCtx = userContextAt(options, `lastToolInputs.${path}`);
  const lastToolInputs = lastToolInputsCtx.get() || {};
  const currentInput = { name, updates };

  if (lastToolInputs.updateSection && isEqual(lastToolInputs.updateSection, currentInput)) {
    const errorMessage = `Cannot update section: This operation has already been processed. Please do not call updateSection again with the same parameters.`;
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
    const errorMessage = `Cannot update section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Parse updates YAML string to object
  let parsedUpdates;
  try {
    parsedUpdates = YAML.parse(updates);
  } catch (error) {
    const errorMessage = `Cannot update section: Unable to parse updates YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Check if any update fields are provided
  const updateFields = Object.keys(parsedUpdates);
  if (updateFields.length === 0) {
    const errorMessage = "Cannot update section: No properties specified for update.";
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    const errorMessage = "Cannot update section: No sections array found in page detail.";
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Find the section to update
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    const errorMessage = `Cannot update section: Section '${name}' not found. Please choose an existing section to update.`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  const originalSection = parsedPageDetail.sections[sectionIndex];

  // Create updated section object
  const updatedSection = {
    ...originalSection,
    ...parsedUpdates,
  };

  // Validate updated section field combination against component library
  const validationResult = validateSingleSection({
    section: updatedSection,
    sectionPath: `section '${name}'`,
    componentLibrary,
  });

  if (!validationResult.isValid) {
    const errorMessage = `Cannot update section:\n${validationResult.validationFeedback}`;
    console.log(errorMessage);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Create new sections array with the updated section
  const newSections = [...parsedPageDetail.sections];
  newSections[sectionIndex] = updatedSection;

  // Create updated page detail
  const updatedPageDetail = {
    ...parsedPageDetail,
    sections: newSections,
  };

  const successMessage = `updateSection executed successfully.
  Successfully updated section '${name}' on page '${path}' with properties: ${updateFields.join(", ")}.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, YAML_STRINGIFY_OPTIONS);

  // update shared page detail
  pageDetailCtx.set(latestPageDetail);
  // Save current input to prevent duplicate calls
  lastToolInputsCtx.set("updateSection", currentInput);

  return {
    status: "success",
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

updateSection.taskTitle = "Update section";
updateSection.description =
  "Modify properties of an existing section within the page detail configuration";
updateSection.inputSchema = getUpdateSectionInputJsonSchema();
updateSection.outputSchema = getUpdateSectionOutputJsonSchema();
