import { join } from "node:path";
import chalk from "chalk";
import pLimit from "p-limit";
import { WEBSITE_SCALE } from "./constants.mjs";
import { getFileName, pathExists, saveValueToConfig } from "./utils.mjs";

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

/**
 * Build a tree structure from a flat website structure array using parentId
 */
export function buildWebsiteTree(structure) {
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

  return { rootNodes, nodeMap };
}

/**
 * Build checkbox choices from tree structure with visual hierarchy
 */
export async function buildChoicesFromTree(nodes, prefix = "", depth = 0, context = {}) {
  const { locale = "en", tmpDir } = context;
  const localeDir = join(tmpDir, locale);
  const choices = [];

  // Limit concurrent file checks to 50 per level to avoid overwhelming the file system
  const limit = pLimit(50);

  // Process nodes with controlled concurrency while maintaining order
  const nodePromises = nodes.map((node, i) =>
    limit(async () => {
      const isLastSibling = i === nodes.length - 1;
      const hasChildren = node.children && node.children.length > 0;

      // Build the tree prefix - top level nodes don't have ├─ or └─
      const treePrefix = depth === 0 ? "" : prefix + (isLastSibling ? "└─ " : "├─ ");
      const flatName = node.path.replace(/^\//, "").replace(/\//g, "-");
      const filename = getFileName({ fileName: flatName, locale });

      // Check file existence if docsDir is provided
      let fileExists = true;
      let missingFileText = "";
      if (localeDir) {
        const filePath = join(localeDir, filename);
        fileExists = await pathExists(filePath);
        if (!fileExists) {
          missingFileText = chalk.red(" - file not found");
        }
      }

      // warningText only shows when file exists, missingFileText has higher priority
      const warningText =
        fileExists && hasChildren ? chalk.yellow(" - will cascade delete all child pages") : "";

      const displayName = `${treePrefix}${node.title} (${filename})${warningText}${missingFileText}`;

      const choice = {
        name: displayName,
        value: node.path,
        short: node.title,
        disabled: !fileExists,
      };

      // Recursively process children
      let childChoices = [];
      if (hasChildren) {
        const childPrefix = depth === 0 ? "" : prefix + (isLastSibling ? "   " : "│  ");
        childChoices = await buildChoicesFromTree(node.children, childPrefix, depth + 1, context);
      }

      return { choice, childChoices };
    }),
  );

  // Wait for all nodes at this level to complete, maintaining order
  const results = await Promise.all(nodePromises);

  // Build choices array in order
  for (const { choice, childChoices } of results) {
    choices.push(choice);
    if (childChoices.length > 0) {
      choices.push(...childChoices);
    }
  }

  return choices;
}

export function formatWebsiteStructure(structure) {
  const { rootNodes } = buildWebsiteTree(structure);

  function printNode(node, depth = 0) {
    const INDENT_SPACES = "  ";
    const FOLDER_ICON = "  📁";
    const FILE_ICON = "  📄";
    const indent = INDENT_SPACES.repeat(depth);
    const prefix = depth === 0 ? FOLDER_ICON : FILE_ICON;

    // Include URL in brackets after the title
    const url = node.path.startsWith("/") ? node.path : `/${node.path}`;
    console.log(`${indent}${prefix} ${node.title} [${url}]`);

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
