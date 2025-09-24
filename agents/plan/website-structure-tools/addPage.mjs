export default async function addPage({
  websiteStructure,
  title,
  description,
  path,
  parentId,
  sourceIds,
}) {
  // Validate required parameters
  if (
    !title ||
    !description ||
    !path ||
    !sourceIds ||
    !Array.isArray(sourceIds) ||
    sourceIds.length === 0
  ) {
    console.log(
      "⚠️  Unable to add page: Missing required information (title, description, path, or sourceIds). Please provide more specific details about the new page you want to add.",
    );
    return { websiteStructure };
  }

  // Validate path format
  if (!path.startsWith("/")) {
    console.log(
      "⚠️  Unable to add page: Invalid path format. Please specify a valid URL path that starts with '/'. For example: '/about' or '/products/services'.",
    );
    return { websiteStructure };
  }

  // Validate parent exists if parentId is provided
  if (parentId !== null && parentId !== undefined && parentId !== "null" && parentId !== "") {
    const parentExists = websiteStructure.some((item) => item.path === parentId);
    if (!parentExists) {
      console.log(
        `⚠️  Unable to add page: Parent page '${parentId}' doesn't exist. Please specify an existing parent page or set as top-level page.`,
      );
      return { websiteStructure };
    }
  }

  // Check if page with same path already exists
  const existingPage = websiteStructure.find((item) => item.path === path);
  if (existingPage) {
    console.log(
      `⚠️  Unable to add page: Page with path '${path}' already exists. Please choose a different path for the new page.`,
    );
    return { websiteStructure };
  }

  // Create new page object
  const newPage = {
    title,
    description,
    path,
    parentId: parentId || null,
    sourceIds: [...sourceIds], // Create a copy of the array
  };

  // Add the new page to the website structure
  const updatedStructure = [...websiteStructure, newPage];

  return {
    websiteStructure: updatedStructure,
    addedPage: newPage,
  };
}

addPage.taskTitle = "Add a new page to website structure";
addPage.description = "Add a new page to the website structure under a specified parent page";
addPage.inputSchema = {
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
    title: {
      type: "string",
      description: "Title of the new page",
    },
    description: {
      type: "string",
      description: "Description of the new page",
    },
    path: {
      type: "string",
      description:
        "URL path for the new page, must start with /, no language prefix, homepage uses /home",
    },
    parentId: {
      type: ["string", "null"],
      description: "Parent page path, null for top-level pages",
    },
    sourceIds: {
      type: "array",
      description: "Associated sourceIds from datasources, cannot be empty",
      items: { type: "string" },
      minItems: 1,
    },
  },
  required: ["websiteStructure", "title", "description", "path", "sourceIds"],
};
addPage.outputSchema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Updated website structure array with the new page added",
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
    addedPage: {
      type: "object",
      description: "The newly added page object",
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
