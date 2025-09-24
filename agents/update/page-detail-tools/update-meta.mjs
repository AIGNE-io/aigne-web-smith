export default async function updateMeta({ pageDetail, title, description }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to update meta: No page detail provided. Please specify the page detail to modify.",
    );
    return { pageDetail };
  }

  // At least one update field must be provided
  if (!title && !description) {
    console.log(
      "⚠️  Unable to update meta: No changes specified. Please provide details about what meta information you want to modify (title, description, seoTitle, or seoDescription).",
    );
    return { pageDetail };
  }

  // Create updated page detail object
  const updatedPageDetail = {
    ...pageDetail,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };

  return {
    pageDetail: updatedPageDetail,
    originalPageDetail: pageDetail,
    updatedPageDetail,
  };
}

updateMeta.taskTitle = "Update page meta information";
updateMeta.description =
  "Update page meta information including title, description, SEO title and SEO description";
updateMeta.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Current page detail object",
    },
    title: {
      type: "string",
      description: "New page title (optional)",
    },
    description: {
      type: "string",
      description: "New page description (optional)",
    },
  },
  required: ["pageDetail"],
  anyOf: [{ required: ["title"] }, { required: ["description"] }],
};
updateMeta.outputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "object",
      description: "Updated page detail object with modified meta information",
    },
    originalPageDetail: {
      type: "object",
      description: "The original page detail before update",
    },
    updatedPageDetail: {
      type: "object",
      description: "The updated page detail after modification",
    },
  },
  required: ["pageDetail"],
};
