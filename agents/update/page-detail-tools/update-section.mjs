// FIXME: The updated properties are currently hardcoded. 
// If new properties are added to built-in components, manual updates are required here
export default async function updateSection({ pageDetail, name, title, description, image, code, action, list, summary }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to update section: No page detail provided. Please specify the page detail to modify.",
    );
    return { pageDetail };
  }

  if (!name) {
    console.log(
      "⚠️  Unable to update section: No section name specified. Please clearly indicate which section you want to modify.",
    );
    return { pageDetail };
  }

  // Define supported update fields and collect provided values
  const updates = {};

  // Only include defined (non-undefined) supported fields
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (image !== undefined) updates.image = image;
  if (code !== undefined) updates.code = code;
  if (action !== undefined) updates.action = action;
  if (list !== undefined) updates.list = list;
  if (summary !== undefined) updates.summary = summary;

  // Check if any update fields are provided
  const updateFields = Object.keys(updates);
  if (updateFields.length === 0) {
    console.log(
      "⚠️  Unable to update section: No changes specified. Please provide details about what section properties you want to modify.",
    );
    return { pageDetail };
  }

  // Check if sections array exists
  if (!pageDetail.sections || !Array.isArray(pageDetail.sections)) {
    console.log(
      "⚠️  Unable to update section: No sections found in the page detail. Please verify the page detail structure.",
    );
    return { pageDetail };
  }

  // Find the section to update
  const sectionIndex = pageDetail.sections.findIndex((s) => s.name === name);
  if (sectionIndex === -1) {
    console.log(
      `⚠️  Unable to update section: Section '${name}' doesn't exist in the page detail. Please specify an existing section to update.`,
    );
    return { pageDetail };
  }

  const originalSection = pageDetail.sections[sectionIndex];

  // Create updated section object
  const updatedSection = {
    ...originalSection,
    ...updates,
  };

  // Create new sections array with the updated section
  const newSections = [...pageDetail.sections];
  newSections[sectionIndex] = updatedSection;

  // Create updated page detail
  const updatedPageDetail = {
    ...pageDetail,
    sections: newSections,
  };

  return {
    pageDetail: updatedPageDetail,
    originalSection,
    updatedSection,
  };
}

updateSection.taskTitle = "Update properties of an existing section";
updateSection.description =
  "Update one or more properties of an existing section in the page detail";
updateSection.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Current page detail object",
    },
    name: {
      type: "string",
      description: "Name of the section to update",
    },
    summary: {
      type: "string",
      description: "New section summary (optional)",
    },
    title: {
      type: "string",
      description: "New section title (optional)",
    },
    description: {
      type: "string",
      description: "New section description (optional)",
    },
  },
  required: ["pageDetail", "name"],
  additionalProperties: true,
};
updateSection.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Updated page detail object with the section modified",
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
