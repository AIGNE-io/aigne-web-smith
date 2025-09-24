import { WEBSITE_SCALE } from "./constants.mjs";
import { saveValueToConfig } from "./utils.mjs";

export function getWebsiteScaleByPageCount(pageCount) {
  // Sort scales by max value (ascending)
  const scalesWithMax = Object.entries(WEBSITE_SCALE)
    .filter(([, scale]) => scale.max !== undefined)
    .sort(([, a], [, b]) => a.max - b.max);

  // Find the first scale where pageCount <= max
  for (const [key, scale] of scalesWithMax) {
    if (pageCount <= scale.max) {
      return key;
    }
  }

  // If pageCount exceeds all max values, return comprehensive
  return "comprehensive";
}

export async function updateWebsiteScaleIfNeeded(originalWebsiteScale, pageCount) {
  if (originalWebsiteScale !== "aiDecide") {
    const newWebsiteScale = getWebsiteScaleByPageCount(pageCount);

    if (newWebsiteScale !== originalWebsiteScale) {
      await saveValueToConfig("websiteScale", newWebsiteScale);
      return newWebsiteScale;
    }
  }
  return originalWebsiteScale;
}

export function formatWebsiteStructure(structure) {
  // Build a tree structure for better display
  const nodeMap = new Map();
  const rootNodes = [];

  // First pass: create node map
  structure.forEach((node) => {
    nodeMap.set(node.path, {
      ...node,
      children: [],
    });
  });

  // Second pass: build tree structure
  structure.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(nodeMap.get(node.path));
      } else {
        rootNodes.push(nodeMap.get(node.path));
      }
    } else {
      rootNodes.push(nodeMap.get(node.path));
    }
  });

  function printNode(node, depth = 0) {
    const INDENT_SPACES = "  ";
    const FOLDER_ICON = "  📁";
    const FILE_ICON = "  📄";
    const indent = INDENT_SPACES.repeat(depth);
    const prefix = depth === 0 ? FOLDER_ICON : FILE_ICON;

    console.log(`${indent}${prefix} ${node.title}`);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        printNode(child, depth + 1);
      });
    }
  }

  return { rootNodes, printNode };
}

export function printWebsiteStructure(structure) {
  console.log(`\n  ${"-".repeat(50)}`);
  console.log("  Current Website Structure");
  console.log(`  ${"-".repeat(50)}`);

  const { rootNodes, printNode } = formatWebsiteStructure(structure);

  if (rootNodes.length === 0) {
    console.log("  No website structure found.");
  } else {
    rootNodes.forEach((node) => printNode(node));
  }
  console.log();
}
