import {
  getMovePageInputJsonSchema,
  getMovePageOutputJsonSchema,
  validateMovePageInput,
} from "../../../types/website-structure-schema.mjs";

export default async function movePage(input) {
  // Validate input using Zod schema
  const validation = validateMovePageInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot move page: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure: input.websiteStructure,
      message: errorMessage,
    };
  }

  const { websiteStructure, path, newParentId, newPath } = validation.data;

  // Find the page to move
  const pageIndex = websiteStructure.findIndex((item) => item.path === path);
  if (pageIndex === -1) {
    const errorMessage = `Cannot move page: Page '${path}' does not exist. Please select an existing page to move.`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      websiteStructure,
      message: errorMessage,
    };
  }

  const pageToMove = websiteStructure[pageIndex];

  // Validate new parent exists if newParentId is provided
  if (
    newParentId &&
    newParentId !== "null"
  ) {
    const newParentExists = websiteStructure.some((item) => item.path === newParentId);
    if (!newParentExists) {
      const errorMessage = `Cannot move page: Target parent page '${newParentId}' does not exist. Please select an existing parent page.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        websiteStructure,
        message: errorMessage,
      };
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
      const errorMessage = `Cannot move page: Moving '${path}' under '${newParentId}' would create an invalid hierarchy. Please select a parent that is not nested under the page being moved.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        websiteStructure,
        message: errorMessage,
      };
    }
  }

  // Validate newPath if provided
  if (newPath && newPath !== path) {
    // Check if newPath already exists
    const pathExists = websiteStructure.some((item) => item.path === newPath);
    if (pathExists) {
      const errorMessage = `Cannot move page: A page with path '${newPath}' already exists. Choose a different path.`;
      console.log(`⚠️  ${errorMessage}`);
      return {
        websiteStructure,
        message: errorMessage,
      };
    }

    // Check if any pages have the current path as parent and would be affected
    const childPages = websiteStructure.filter((item) => item.parentId === path);
    if (childPages.length > 0) {
      // Update all child pages to use the new path as parent
      console.log(`Note: Will update ${childPages.length} child page(s) to reference new parent path.`);
    }
  }

  // Create updated page object with new parent and path
  const finalPath = newPath || path;
  const updatedPage = {
    ...pageToMove,
    path: finalPath,
    parentId: newParentId || null,
  };

  // Update the website structure
  const updatedStructure = [...websiteStructure];
  updatedStructure[pageIndex] = updatedPage;

  // Update child pages if path changed
  if (newPath && newPath !== path) {
    for (let i = 0; i < updatedStructure.length; i++) {
      if (updatedStructure[i].parentId === path) {
        updatedStructure[i] = {
          ...updatedStructure[i],
          parentId: newPath,
        };
      }
    }
  }

  const oldParentText = pageToMove.parentId ? ` from parent '${pageToMove.parentId}'` : " from top-level";
  const newParentText = newParentId ? ` to parent '${newParentId}'` : " to top-level";
  const pathChangeText =
    newPath && newPath !== path ? ` and changed path from '${path}' to '${newPath}'` : "";
  const childUpdateText =
    newPath &&
    newPath !== path &&
    websiteStructure.filter((item) => item.parentId === path).length > 0
      ? ` (also updated ${websiteStructure.filter((item) => item.parentId === path).length} child page(s))`
      : "";
  const successMessage = `Successfully moved page '${pageToMove.title}'${oldParentText}${newParentText}${pathChangeText}${childUpdateText}.`;

  return {
    websiteStructure: updatedStructure,
    message: successMessage,
  };
}

movePage.taskTitle = "Move page";
movePage.description = "Move a page to a different parent in the website structure";
movePage.inputSchema = getMovePageInputJsonSchema();
movePage.outputSchema = getMovePageOutputJsonSchema();
