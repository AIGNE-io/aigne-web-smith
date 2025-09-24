export default async function updatePage({
  websiteStructure,
  path,
  title,
  description,
  sourceIds,
}) {
  // Validate required parameters
  if (!path) {
    console.log(
      "⚠️  Unable to update page: No page specified. Please clearly indicate which page you want to modify.",
    );
    return { websiteStructure };
  }

  // At least one update field must be provided
  if (!title && !description && !sourceIds) {
    console.log(
      "⚠️  Unable to update page: No changes specified. Please provide details about what you want to modify (title, description, or content sources).",
    );
    return { websiteStructure };
  }

  // Find the page to update
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    console.log(
      `⚠️  Unable to update page: Page '${path}' doesn't exist in the website structure. Please specify an existing page to update.`,
    );
    return { websiteStructure };
  }

  const originalPage = websiteStructure[pageIndex];

  // Validate sourceIds if provided
  if (sourceIds !== undefined) {
    if (!Array.isArray(sourceIds) || sourceIds.length === 0) {
      console.log(
        "⚠️  Unable to update page: Invalid content sources specified. Please provide valid source references for the page content.",
      );
      return { websiteStructure };
    }
  }

  // Create updated page object
  const updatedPage = {
    ...originalPage,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(sourceIds !== undefined && { sourceIds: [...sourceIds] }), // Create a copy of the array
  };

  // Update the website structure
  const updatedStructure = [...websiteStructure];
  updatedStructure[pageIndex] = updatedPage;

  return {
    websiteStructure: updatedStructure,
    originalPage,
    updatedPage,
  };
}

updatePage.taskTitle = "Update properties of an existing page in website structure";
updatePage.description =
  "Update one or more properties (title, description, sourceIds) of an existing page in website structure";
updatePage.inputSchema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Current website structure array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          path: { type: "string" },
          parentId: { type: ["string", "null"] },
          sourceIds: { type: "array", items: { type: "string" } },
        },
      },
    },
    path: {
      type: "string",
      description: "URL path of the page to update",
    },
    title: {
      type: "string",
      description: "New title for the page (optional)",
    },
    description: {
      type: "string",
      description: "New description for the page (optional)",
    },
    sourceIds: {
      type: "array",
      description: "New sourceIds for the page (optional), cannot be empty if provided",
      items: { type: "string" },
      minItems: 1,
    },
  },
  required: ["websiteStructure", "path"],
  anyOf: [{ required: ["title"] }, { required: ["description"] }, { required: ["sourceIds"] }],
};
updatePage.outputSchema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Updated website structure array with the page modified",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          path: { type: "string" },
          parentId: { type: ["string", "null"] },
          sourceIds: { type: "array", items: { type: "string" } },
        },
      },
    },
    originalPage: {
      type: "object",
      description: "The original page object before update",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        path: { type: "string" },
        parentId: { type: ["string", "null"] },
        sourceIds: { type: "array", items: { type: "string" } },
      },
    },
    updatedPage: {
      type: "object",
      description: "The updated page object after modification",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        path: { type: "string" },
        parentId: { type: ["string", "null"] },
        sourceIds: { type: "array", items: { type: "string" } },
      },
    },
  },
  required: ["websiteStructure"],
};
