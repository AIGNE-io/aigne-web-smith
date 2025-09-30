import YAML from "yaml";
import {
  getAddSectionInputJsonSchema,
  getAddSectionOutputJsonSchema,
  validateAddSectionInput,
} from "../../../types/page-detail-schema.mjs";

export default async function addSection(input) {
  // Validate input using Zod schema
  const validation = validateAddSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot add section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail: input.pageDetail,
      message: errorMessage,
    };
  }

  const { pageDetail, section, position } = validation.data;

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot add section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Parse section YAML string to object
  let parsedSection;
  try {
    parsedSection = YAML.parse(section);
  } catch (error) {
    const errorMessage = `Cannot add section: Unable to parse section YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Validate section has required properties
  if (!parsedSection.sectionName) {
    const errorMessage = "Cannot add section: Section must have a 'sectionName' property.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Initialize sections array if it doesn't exist
  if (!parsedPageDetail.sections) {
    parsedPageDetail.sections = [];
  }

  // Check if section with same name already exists
  const existingSection = parsedPageDetail.sections.find(
    (s) => s.sectionName === parsedSection.sectionName,
  );
  if (existingSection) {
    const errorMessage = `Cannot add section: A section with name '${parsedSection.sectionName}' already exists. Choose a different name.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Determine insertion position
  let insertIndex = parsedPageDetail.sections.length; // Default to end

  if (position !== undefined) {
    if (typeof position === "number") {
      // Position is an index
      insertIndex = Math.max(0, Math.min(position, parsedPageDetail.sections.length));
    } else if (typeof position === "string") {
      // Position is relative to another section
      const refIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === position);
      if (refIndex !== -1) {
        insertIndex = refIndex + 1; // Insert after the reference section
      }
    }
  }

  // Create new sections array with the inserted section
  const newSections = [...parsedPageDetail.sections];
  newSections.splice(insertIndex, 0, parsedSection);

  // Create updated page detail
  const updatedPageDetail = {
    ...parsedPageDetail,
    sections: newSections,
  };

  const positionText =
    position !== undefined
      ? ` at position ${insertIndex}`
      : ` at the end (position ${insertIndex})`;
  const successMessage = `Successfully added section '${parsedSection.sectionName}'${positionText}.\nCheck if the latest version of pageDetail meets user feedback, if so, return the latest version directly.`;

  return {
    pageDetail: YAML.stringify(updatedPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
    message: successMessage,
  };
}

addSection.taskTitle = "Add new section";
addSection.description = "Add a new section to the page detail";
addSection.inputSchema = getAddSectionInputJsonSchema();
addSection.outputSchema = getAddSectionOutputJsonSchema();
