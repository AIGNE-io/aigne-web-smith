export default async function deleteSection({ pageDetail, name }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to delete section: No page detail provided. Please specify the page detail to modify.",
    );
    return { pageDetail };
  }

  if (!name) {
    console.log(
      "⚠️  Unable to delete section: No section name specified. Please clearly indicate which section you want to remove.",
    );
    return { pageDetail };
  }

  // Check if sections array exists
  if (!pageDetail.sections || !Array.isArray(pageDetail.sections)) {
    console.log(
      "⚠️  Unable to delete section: No sections found in the page detail. Please verify the page detail structure.",
    );
    return { pageDetail };
  }

  // Find the section to delete
  const sectionIndex = pageDetail.sections.findIndex((s) => s.name === name);
  if (sectionIndex === -1) {
    console.log(
      `⚠️  Unable to delete section: Section '${name}' doesn't exist in the page detail. Please specify an existing section to remove.`,
    );
    return { pageDetail };
  }

  const sectionToDelete = pageDetail.sections[sectionIndex];

  // Create new sections array without the deleted section
  const newSections = pageDetail.sections.filter((_, index) => index !== sectionIndex);

  // Create updated page detail
  const updatedPageDetail = {
    ...pageDetail,
    sections: newSections,
  };

  return {
    pageDetail: updatedPageDetail,
    deletedSection: sectionToDelete,
  };
}

deleteSection.taskTitle = "Delete a section from page detail";
deleteSection.description = "Remove a section from the page detail by its name";
deleteSection.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Current page detail object",
    },
    name: {
      type: "string",
      description: "Name of the section to delete",
    },
  },
  required: ["pageDetail", "name"],
};
deleteSection.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Updated page detail object with the section removed",
    },
    deletedSection: {
      type: "object",
      description: "The section that was deleted",
    },
  },
  required: ["pageDetail"],
};
