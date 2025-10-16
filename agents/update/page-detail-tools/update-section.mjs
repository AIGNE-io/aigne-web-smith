import YAML from "yaml";
import {
  getUpdateSectionInputJsonSchema,
  getUpdateSectionOutputJsonSchema,
  validateUpdateSectionInput,
} from "../../../types/page-detail-schema.mjs";

export default async function updateSection(input, options) {
  // Validate input using Zod schema
  const validation = validateUpdateSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail: input.pageDetail,
      message: errorMessage,
    };
  }

  const { name, updates } = validation.data;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot update section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Parse updates YAML string to object
  let parsedUpdates;
  try {
    parsedUpdates = YAML.parse(updates);
  } catch (error) {
    const errorMessage = `Cannot update section: Unable to parse updates YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Check if any update fields are provided
  const updateFields = Object.keys(parsedUpdates);
  if (updateFields.length === 0) {
    const errorMessage = "Cannot update section: No properties specified for update.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    const errorMessage = "Cannot update section: No sections array found in page detail.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Find the section to update
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    const errorMessage = `Cannot update section: Section '${name}' not found. Please choose an existing section to update.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  const originalSection = parsedPageDetail.sections[sectionIndex];

  // Create updated section object
  const updatedSection = {
    ...originalSection,
    ...parsedUpdates,
  };

  // Create new sections array with the updated section
  const newSections = [...parsedPageDetail.sections];
  newSections[sectionIndex] = updatedSection;

  // Create updated page detail
  const updatedPageDetail = {
    ...parsedPageDetail,
    sections: newSections,
  };

  const successMessage = `updateSection executed successfully.
  Successfully updated section '${name}' with properties: ${updateFields.join(", ")}.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
    lineWidth: 0,
  });
  // update shared page detail
  options.context.userContext.currentPageDetail = latestPageDetail;

  return {
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

updateSection.taskTitle = "Update section";
updateSection.description =
  "Modify properties of an existing section within the page detail configuration";
updateSection.inputSchema = getUpdateSectionInputJsonSchema();
updateSection.outputSchema = getUpdateSectionOutputJsonSchema();
