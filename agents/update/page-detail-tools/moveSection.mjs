export default async function moveSection({ pageDetail, name, newPosition }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to move section: No page detail provided. Please specify the page detail to modify.",
    );
    return { pageDetail };
  }

  if (!name) {
    console.log(
      "⚠️  Unable to move section: No section name specified. Please clearly indicate which section you want to move.",
    );
    return { pageDetail };
  }

  if (newPosition === undefined) {
    console.log(
      "⚠️  Unable to move section: No target position specified. Please indicate where you want to move the section.",
    );
    return { pageDetail };
  }

  // Check if sections array exists
  if (!pageDetail.sections || !Array.isArray(pageDetail.sections)) {
    console.log(
      "⚠️  Unable to move section: No sections found in the page detail. Please verify the page detail structure.",
    );
    return { pageDetail };
  }

  // Find the section to move
  const sectionIndex = pageDetail.sections.findIndex((s) => s.name === name);
  if (sectionIndex === -1) {
    console.log(
      `⚠️  Unable to move section: Section '${name}' doesn't exist in the page detail. Please specify an existing section to move.`,
    );
    return { pageDetail };
  }

  const sectionToMove = pageDetail.sections[sectionIndex];

  // Determine target position
  let targetIndex;
  if (typeof newPosition === "number") {
    // Position is an index
    targetIndex = Math.max(0, Math.min(newPosition, pageDetail.sections.length - 1));
  } else if (typeof newPosition === "string") {
    // Position is relative to another section
    const refIndex = pageDetail.sections.findIndex((s) => s.name === newPosition);
    if (refIndex === -1) {
      console.log(
        `⚠️  Unable to move section: Reference section '${newPosition}' doesn't exist. Please specify an existing section as reference for the move operation.`,
      );
      return { pageDetail };
    }
    targetIndex = refIndex;
  } else {
    console.log(
      "⚠️  Unable to move section: Invalid position format. Please specify a number (index) or section name as the target position.",
    );
    return { pageDetail };
  }

  // If the section is already at the target position, no change needed
  if (sectionIndex === targetIndex) {
    console.log(`⚠️  Section '${name}' is already at the specified position. No changes were made.`);
    return { pageDetail };
  }

  // Create new sections array with the moved section
  const newSections = [...pageDetail.sections];

  // Remove section from current position
  newSections.splice(sectionIndex, 1);

  // Adjust target index if we removed an item before it
  const adjustedTargetIndex = sectionIndex < targetIndex ? targetIndex - 1 : targetIndex;

  // Insert section at new position
  newSections.splice(adjustedTargetIndex, 0, sectionToMove);

  // Create updated page detail
  const updatedPageDetail = {
    ...pageDetail,
    sections: newSections,
  };

  return {
    pageDetail: updatedPageDetail,
    movedSection: sectionToMove,
    fromIndex: sectionIndex,
    toIndex: adjustedTargetIndex,
  };
}

moveSection.taskTitle = "Move a section to a new position";
moveSection.description = "Move a section to a different position in the page detail";
moveSection.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Current page detail object",
    },
    name: {
      type: "string",
      description: "Name of the section to move",
    },
    newPosition: {
      type: ["number", "string"],
      description: "Target position (index number or section name to position relative to)",
    },
  },
  required: ["pageDetail", "name", "newPosition"],
};
moveSection.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Updated page detail object with the section moved",
    },
    movedSection: {
      type: "object",
      description: "The section that was moved",
    },
    fromIndex: {
      type: "number",
      description: "The original index of the section",
    },
    toIndex: {
      type: "number",
      description: "The new index of the section",
    },
  },
  required: ["pageDetail"],
};
