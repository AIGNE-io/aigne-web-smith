import YAML from "yaml";

// TODO: Update this function when new properties are added to built-in components.
// Currently supported properties must be manually added to the updates object below.
export default async function updateSection({
  pageDetail,
  name,
  title,
  description,
  image,
  code,
  action,
  list,
  summary,
}) {
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
    ...updates,
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
