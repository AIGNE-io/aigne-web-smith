import isEqual from "lodash/isEqual.js";

import YAML from "yaml";
import {
  getAddSectionInputJsonSchema,
  getAddSectionOutputJsonSchema,
  validateAddSectionInput,
} from "../../../types/page-detail-schema.mjs";
import { validateSingleSection } from "../../../utils/utils.mjs";

export default async function addSection(input, options) {
  // Validate input using Zod schema
  const validation = validateAddSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot add section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: 'error',
      pageDetail: input.pageDetail,
      error: { message: errorMessage },
    };
  }

  const { section, position } = validation.data;
  const { componentLibrary } = input;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Check for duplicate calls by comparing with last input
  const lastAddSectionInput = options.context?.userContext?.lastAddSectionInput;
  const currentInput = { section, position };

  if (lastAddSectionInput && isEqual(lastAddSectionInput, currentInput)) {
    const errorMessage = `Cannot add section: This operation has already been processed. Please do not call addSection again with the same parameters.`;
    return {
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot add section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
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
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Validate section has required properties
  if (!parsedSection.sectionName) {
    const errorMessage = "Cannot add section: Section must have a 'sectionName' property.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Validate section field combination against component library
  const validationResult = validateSingleSection({
    section: parsedSection,
    sectionPath: `section '${parsedSection.sectionName}'`,
    componentLibrary,
  });
  console.log("validationResult", validationResult);

  if (!validationResult.isValid) {
    const summary =
      validationResult.errorCount === 1
        ? "Found 1 validation error:"
        : `Found ${validationResult.errorCount} validation errors:`;
    const details = validationResult.errors
      .map((error, index) => `${index + 1}. ${error.path}: ${error.message}`)
      .join("\n");
    const errorMessage = `Cannot add section:\n${summary}\n${details}`;
    return {
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
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
      status: 'error',
      pageDetail,
      error: { message: errorMessage },
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
  const successMessage = `addSection executed successfully.
  Successfully added section '${parsedSection.sectionName}'${positionText}.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
    lineWidth: 0,
  });
  // update shared page detail
  options.context.userContext.currentPageDetail = latestPageDetail;

  // Save current input to prevent duplicate calls
  options.context.userContext.lastAddSectionInput = currentInput;

  return {
    status: 'success',
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

addSection.taskTitle = "Add section";
addSection.description = "Add a new section to the specified page detail at an optional position";
addSection.inputSchema = getAddSectionInputJsonSchema();
addSection.outputSchema = getAddSectionOutputJsonSchema();
