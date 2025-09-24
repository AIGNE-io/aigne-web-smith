export default async function addSection({ pageDetail, section, position }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to add section: No page detail provided. Please specify the page detail to modify.",
    );
    return { pageDetail };
  }

  if (!section) {
    console.log(
      "⚠️  Unable to add section: No section data provided. Please specify the section content you want to add.",
    );
    return { pageDetail };
  }

  // Validate section has required properties
  if (!section.name) {
    console.log(
      "⚠️  Unable to add section: Section must have a name. Please provide a unique name for the section.",
    );
    return { pageDetail };
  }

  // Initialize sections array if it doesn't exist
  if (!pageDetail.sections) {
    pageDetail.sections = [];
  }

  // Check if section with same name already exists
  const existingSection = pageDetail.sections.find((s) => s.name === section.name);
  if (existingSection) {
    console.log(
      `⚠️  Unable to add section: A section with name '${section.name}' already exists. Please choose a different name for the new section.`,
    );
    return { pageDetail };
  }

  // Determine insertion position
  let insertIndex = pageDetail.sections.length; // Default to end

  if (position !== undefined) {
    if (typeof position === "number") {
      // Position is an index
      insertIndex = Math.max(0, Math.min(position, pageDetail.sections.length));
    } else if (typeof position === "string") {
      // Position is relative to another section
      const refIndex = pageDetail.sections.findIndex((s) => s.name === position);
      if (refIndex !== -1) {
        insertIndex = refIndex + 1; // Insert after the reference section
      }
    }
  }

  // Create new sections array with the inserted section
  const newSections = [...pageDetail.sections];
  newSections.splice(insertIndex, 0, section);

  // Create updated page detail
  const updatedPageDetail = {
    ...pageDetail,
    sections: newSections,
  };

  return {
    pageDetail: updatedPageDetail,
    addedSection: section,
    insertedAt: insertIndex,
  };
}

addSection.taskTitle = "Add a new section to page detail";
addSection.description = "Add a new section to the page detail at a specified position";
addSection.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Current page detail object",
    },
    section: {
      type: "object",
      description: "Section content to add with at least a name property",
      properties: {
        name: { type: "string" },
        summary: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
      },
      required: ["name"],
    },
    position: {
      type: ["number", "string"],
      description: "Position to insert the section (index number or section name to insert after)",
    },
  },
  required: ["pageDetail", "section"],
};
addSection.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Updated page detail object with the new section added",
    },
    addedSection: {
      type: "object",
      description: "The section that was added",
    },
    insertedAt: {
      type: "number",
      description: "The index where the section was inserted",
    },
  },
  required: ["pageDetail"],
};
