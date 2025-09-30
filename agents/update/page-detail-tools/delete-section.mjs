import YAML from "yaml";
import {
  getDeleteSectionInputJsonSchema,
  getDeleteSectionOutputJsonSchema,
  validateDeleteSectionInput,
} from "../../../types/page-detail-schema.mjs";

export default async function deleteSection(input) {
  // Validate input using Zod schema
  const validation = validateDeleteSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot delete section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail: input.pageDetail,
      message: errorMessage,
    };
  }

  const { pageDetail, name } = validation.data;

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot delete section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    const errorMessage = "Cannot delete section: No sections array found in page detail.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Find the section to delete
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    const errorMessage = `Cannot delete section: Section '${name}' not found. Please choose an existing section to delete.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
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

  const successMessage = `Successfully deleted section '${sectionToDelete.sectionName}'.\nCheck if the latest version of pageDetail meets user feedback, if so, return the latest version directly.`;

  return {
    pageDetail: YAML.stringify(updatedPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
    message: successMessage,
  };
}

deleteSection.taskTitle = "Delete section";
deleteSection.description = "Delete a section from the page detail";
deleteSection.inputSchema = getDeleteSectionInputJsonSchema();
deleteSection.outputSchema = getDeleteSectionOutputJsonSchema();
