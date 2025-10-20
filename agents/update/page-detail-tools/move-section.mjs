import isEqual from "lodash/isEqual.js";
import YAML from "yaml";
import {
  getMoveSectionInputJsonSchema,
  getMoveSectionOutputJsonSchema,
  validateMoveSectionInput,
} from "../../../types/page-detail-schema.mjs";

export default async function moveSection(input, options) {
  // Validate input using Zod schema
  const validation = validateMoveSectionInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot move section: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail: input.pageDetail,
      error: { message: errorMessage },
    };
  }

  const { name, position: newPosition } = validation.data;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Check for duplicate calls by comparing with last input
  const lastMoveSectionInput = options.context?.userContext?.lastMoveSectionInput;
  const currentInput = { name, position: newPosition };

  if (lastMoveSectionInput && isEqual(lastMoveSectionInput, currentInput)) {
    const errorMessage = `Cannot move section: This operation has already been processed. Please do not call moveSection again with the same parameters.`;
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
    const errorMessage = `Cannot move section: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    const errorMessage = "Cannot move section: No sections array found in page detail.";
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Find the section to move
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    const errorMessage = `Cannot move section: Section '${name}' not found. Please choose an existing section to move.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  const sectionToMove = parsedPageDetail.sections[sectionIndex];

  // Determine target position
  let targetIndex;
  if (typeof newPosition === "number") {
    // Position is an index
    targetIndex = Math.max(0, Math.min(newPosition, parsedPageDetail.sections.length - 1));
  } else if (typeof newPosition === "string") {
    // Position is relative to another section
    const refIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === newPosition);
    if (refIndex === -1) {
      const errorMessage = `Cannot move section: Reference section '${newPosition}' not found.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        status: "error",
        pageDetail,
        error: { message: errorMessage },
      };
    }
    targetIndex = refIndex;
  }

  // If the section is already at the target position, no change needed
  if (sectionIndex === targetIndex) {
    const errorMessage = `Cannot move section: Section '${name}' is already at the specified position.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Create new sections array with the moved section
  const newSections = [...parsedPageDetail.sections];

  // Remove section from current position
  newSections.splice(sectionIndex, 1);

  // Adjust target index if we removed an item before it
  const adjustedTargetIndex = sectionIndex < targetIndex ? targetIndex - 1 : targetIndex;

  // Insert section at new position
  newSections.splice(adjustedTargetIndex, 0, sectionToMove);

  // Create updated page detail
  const updatedPageDetail = {
    ...parsedPageDetail,
    sections: newSections,
  };

  const successMessage = `moveSection executed successfully.
  Successfully moved section '${sectionToMove.sectionName}' from position ${sectionIndex} to position ${adjustedTargetIndex}.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
    lineWidth: 0,
  });
  // update shared page detail
  options.context.userContext.currentPageDetail = latestPageDetail;

  // Save current input to prevent duplicate calls
  options.context.userContext.lastMoveSectionInput = currentInput;

  return {
    status: "success",
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

moveSection.taskTitle = "Move section";
moveSection.description = "Moves a section to a specified position within the page detail";
moveSection.inputSchema = getMoveSectionInputJsonSchema();
moveSection.outputSchema = getMoveSectionOutputJsonSchema();
