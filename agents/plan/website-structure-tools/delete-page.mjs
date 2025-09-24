export default async function deletePage({ websiteStructure, path }) {
  // Validate required parameters
  if (!path) {
    console.log(
      "⚠️  Unable to delete page: No page specified. Please clearly indicate which page you want to remove from the website structure.",
    );
    return { websiteStructure };
  }

  // Find the page to delete
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    console.log(
      `⚠️  Unable to delete page: Page '${path}' doesn't exist in the website structure. Please specify an existing page to delete.`,
    );
    return { websiteStructure };
  }

  const pageToDelete = websiteStructure[pageIndex];

  // Check if any other pages have this page as parent
  const childPages = websiteStructure.filter((item) => item.parentId === path);
  if (childPages.length > 0) {
    console.log(
      `⚠️  Unable to delete page: Page '${path}' has ${childPages.length} child page(s) (${childPages.map((p) => p.path).join(", ")}). Please first move these pages to a different parent or delete them before removing this page.`,
    );
    return { websiteStructure };
  }

  // Remove the page from the website structure
  const updatedStructure = websiteStructure.filter((_, index) => index !== pageIndex);

  return {
    websiteStructure: updatedStructure,
    deletedPage: pageToDelete,
  };
}

deletePage.taskTitle = "Delete a page from website structure";
deletePage.description = "Delete a page from the website structure by its path";
deletePage.inputSchema = {
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
      description: "URL path of the page to delete",
    },
  },
  required: ["websiteStructure", "path"],
};
deletePage.outputSchema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Updated website structure array with the page removed",
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
    deletedPage: {
      type: "object",
      description: "The deleted page object",
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
