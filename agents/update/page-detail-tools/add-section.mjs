import YAML from "yaml";

export default async function addSection({ pageDetail, section, position }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to add section: No page detail provided. Please specify the page detail to modify.",
    );
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
  if (!parsedPageDetail.sections) {
    parsedPageDetail.sections = [];
  }

  // Check if section with same name already exists
  const existingSection = parsedPageDetail.sections.find((s) => s.name === section.name);
  if (existingSection) {
    console.log(
      `⚠️  Unable to add section: A section with name '${section.name}' already exists. Please choose a different name for the new section.`,
    );
    return { pageDetail };
  }

  // Determine insertion position
  let insertIndex = parsedPageDetail.sections.length; // Default to end

  if (position !== undefined) {
    if (typeof position === "number") {
      // Position is an index
      insertIndex = Math.max(0, Math.min(position, parsedPageDetail.sections.length));
    } else if (typeof position === "string") {
      // Position is relative to another section
      const refIndex = parsedPageDetail.sections.findIndex((s) => s.name === position);
      if (refIndex !== -1) {
        insertIndex = refIndex + 1; // Insert after the reference section
      }
    }
  }

  // Create new sections array with the inserted section
  const newSections = [...parsedPageDetail.sections];
  newSections.splice(insertIndex, 0, section);

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
      type: "string",
      description: "Current page detail YAML string",
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
      type: "string",
      description: "Updated page detail YAML string with the new section added",
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
