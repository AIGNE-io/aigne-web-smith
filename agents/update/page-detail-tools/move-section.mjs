import YAML from "yaml";

export default async function moveSection({ pageDetail, name, newPosition }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log("⚠️  Unable to move section: No page detail provided");
    return { pageDetail };
  }

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    console.log("⚠️  Unable to parse page detail YAML:", error.message);
    return { pageDetail };
  }

  if (!name) {
    console.log("⚠️  Unable to move section: No section name specified");
    return { pageDetail };
  }

  if (newPosition === undefined) {
    console.log("⚠️  Unable to move section: No target position specified");
    return { pageDetail };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    console.log("⚠️  Unable to move section: No sections found in page detail");
    return { pageDetail };
  }

  // Find the section to move
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.sectionName === name);
  if (sectionIndex === -1) {
    console.log(`⚠️  Unable to move section: Section '${name}' not found`);
    return { pageDetail };
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
      console.log(`⚠️  Unable to move section: Reference section '${newPosition}' not found`);
      return { pageDetail };
    }
    targetIndex = refIndex;
  } else {
    console.log("⚠️  Unable to move section: Invalid position format");
    return { pageDetail };
  }

  // If the section is already at the target position, no change needed
  if (sectionIndex === targetIndex) {
    console.log(`⚠️  Section '${name}' already at specified position`);
    return { pageDetail };
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

  return {
    pageDetail: YAML.stringify(updatedPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
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
      type: "string",
      description: "Current page detail YAML string",
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
      type: "string",
      description: "Updated page detail YAML string with the section moved",
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
