import YAML from "yaml";

export default async function updateSection({ pageDetail, name, updates }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log("⚠️  Update failed: Missing required page detail parameter");
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
    console.log("⚠️  Update failed: Missing required section name parameter");
    return { pageDetail };
  }

  if (!updates) {
    console.log("⚠️  Update failed: Missing required updates parameter");
    return { pageDetail };
  }

  // Parse updates YAML string to object
  let parsedUpdates;
  try {
    parsedUpdates = YAML.parse(updates);
  } catch (error) {
    console.log("⚠️  Unable to parse updates YAML:", error.message);
    return { pageDetail };
  }

  // Check if any update fields are provided
  const updateFields = Object.keys(parsedUpdates);
  if (updateFields.length === 0) {
    console.log("⚠️  Update failed: No section properties specified for update");
    return { pageDetail };
  }

  // Check if sections array exists
  if (!parsedPageDetail.sections || !Array.isArray(parsedPageDetail.sections)) {
    console.log("⚠️  Update failed: Page detail contains no sections array");
    return { pageDetail };
  }

  // Find the section to update
  const sectionIndex = parsedPageDetail.sections.findIndex((s) => s.name === name);
  if (sectionIndex === -1) {
    console.log(`⚠️  Update failed: Section '${name}' not found`);
    return { pageDetail };
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

  return {
    pageDetail: YAML.stringify(updatedPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
    originalSection,
    updatedSection,
  };
}

updateSection.taskTitle = "Update section properties";
updateSection.description = "Modify properties of an existing section in the page detail";
updateSection.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "string",
      description: "Current page detail YAML string",
    },
    name: {
      type: "string",
      description: "Name of the section to update",
    },
    updates: {
      type: "string",
      description:
        "YAML string containing the properties to update (e.g., 'title: New Title\\ndescription: New description'). Any valid section properties can be included.",
    },
  },
  required: ["pageDetail", "name", "updates"],
};
updateSection.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "string",
      description: "Updated page detail YAML string with the section modified",
    },
    originalSection: {
      type: "object",
      description: "The original section before update",
    },
    updatedSection: {
      type: "object",
      description: "The updated section after modification",
    },
  },
  required: ["pageDetail"],
};
