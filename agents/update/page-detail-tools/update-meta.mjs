import YAML from "yaml";

export default async function updateMeta({ pageDetail, title, description }) {
  // Validate required parameters
  if (!pageDetail) {
    console.log(
      "⚠️  Unable to update meta: No page detail provided. Please specify the page detail to modify.",
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

  // At least one update field must be provided
  if (!title && !description) {
    console.log(
      "⚠️  Unable to update meta: No changes specified. Please provide details about what meta information you want to modify (title, description, seoTitle, or seoDescription).",
    );
    return { pageDetail };
  }

  // Create updated page detail object
  const updatedPageDetail = {
    ...parsedPageDetail,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };

  return {
    pageDetail: YAML.stringify(updatedPageDetail),
    originalPageDetail: pageDetail,
    updatedPageDetail: YAML.stringify(updatedPageDetail),
  };
}

updateMeta.taskTitle = "Update page meta information";
updateMeta.description =
  "Update page meta information including title, description, SEO title and SEO description";
updateMeta.inputSchema = {
  type: "object",
  properties: {
    pageDetail: {
      type: "string",
      description: "Current page detail YAML string",
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
      type: "string",
      description: "Updated page detail YAML string with modified meta information",
    },
    originalPageDetail: {
      type: "string",
      description: "The original page detail YAML string before update",
    },
    updatedPageDetail: {
      type: "string",
      description: "The updated page detail YAML string after modification",
    },
  },
  required: ["pageDetail"],
};
