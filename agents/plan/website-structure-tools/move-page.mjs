export default async function movePage({ websiteStructure, path, newParentId }) {
  // Validate required parameters
  if (!path) {
    console.log(
      "⚠️  Unable to move page: No page specified. Please clearly indicate which page you want to move and where it should be placed.",
    );
    return { websiteStructure };
  }

  // Find the page to move
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    console.log(
      `⚠️  Unable to move page: Page '${path}' doesn't exist in the website structure. Please specify an existing page to move.`,
    );
    return { websiteStructure };
  }

  const pageToMove = websiteStructure[pageIndex];

  // Validate new parent exists if newParentId is provided
  if (newParentId !== null && newParentId !== undefined && newParentId !== "null") {
    const newParentExists = websiteStructure.some((item) => item.path === newParentId);
    if (!newParentExists) {
      console.log(
        `⚠️  Unable to move page: Target parent page '${newParentId}' doesn't exist. Please specify an existing parent page for the move operation.`,
      );
      return { websiteStructure };
    }

    // Check for circular dependency: the new parent cannot be a descendant of the page being moved
    const isDescendant = (parentPath, childPath) => {
      const children = websiteStructure.filter((item) => item.parentId === parentPath);
      for (const child of children) {
        if (child.path === childPath || isDescendant(child.path, childPath)) {
          return true;
        }
      }
      return false;
    };

    if (isDescendant(path, newParentId)) {
      console.log(
        `⚠️  Unable to move page: Moving '${path}' under '${newParentId}' would create an invalid hierarchy. Please choose a different parent page that isn't nested under the page being moved.`,
      );
      return { websiteStructure };
    }
  }

  // Create updated page object with new parent
  const updatedPage = {
    ...pageToMove,
    parentId: newParentId || null,
  };

  // Update the website structure
  const updatedStructure = [...websiteStructure];
  updatedStructure[pageIndex] = updatedPage;

  return {
    websiteStructure: updatedStructure,
    originalPage: pageToMove,
    updatedPage,
  };
}

movePage.taskTitle = "Move a page to a new parent in website structure";
movePage.description = "Move a page to a different parent in the website structure hierarchy";
movePage.inputSchema = {
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
      description: "URL path of the page to move",
    },
    newParentId: {
      type: ["string", "null"],
      description: "Path of the new parent page, null to move to top-level",
    },
  },
  required: ["websiteStructure", "path"],
};
movePage.outputSchema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Updated website structure array with the page moved",
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
      description: "The original page object before moving",
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
      description: "The updated page object after moving",
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
