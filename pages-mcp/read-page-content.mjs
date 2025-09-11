import fs from "node:fs/promises";
import path from "node:path";

import { getFileName } from "../utils/utils.mjs";

const pagesDir = path.join(process.cwd(), "./.aigne/web-smith", "pages");

export default async function readPageContent({
  relevantPagePaths,
  pagesDir: customPagesDir,
  locale,
}) {
  const targetPagesDir = customPagesDir || pagesDir;
  const pageContents = [];

  for (const pagePath of relevantPagePaths) {
    try {
      // Flatten path: remove leading /, replace all / with - (same logic as utils.mjs)
      const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-");
      const fileFullName = getFileName({
        locale: locale || "en",
        fileName: flatName,
      });
      const filePath = path.join(targetPagesDir, fileFullName);

      // Read the page file
      const content = await fs.readFile(filePath, "utf8");

      pageContents.push({
        success: true,
        path: pagePath,
        content,
        filePath,
      });
    } catch (error) {
      pageContents.push({
        success: false,
        path: pagePath,
        error: error.message,
      });
    }
  }

  // Combine all successful page contents into a single text
  const allPagesText = pageContents
    .filter((page) => page.success)
    .map((page) => page.content)
    .join("\n\n---\n\n");

  return {
    pageContents,
    allPagesText,
    totalPages: relevantPagePaths.length,
    successfulReads: pageContents.filter((page) => page.success).length,
  };
}

readPageContent.input_schema = {
  type: "object",
  properties: {
    relevantPagePaths: {
      type: "array",
      items: { type: "string" },
      description: "List of page paths to read",
    },
    pagesDir: {
      type: "string",
      description: "Custom pages directory path (optional)",
    },
  },
  required: ["relevantPagePaths"],
};

readPageContent.output_schema = {
  type: "object",
  properties: {
    pageContents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          path: { type: "string" },
          content: { type: "string" },
          filePath: { type: "string" },
          error: { type: "string" },
        },
      },
    },
    allPagesText: {
      type: "string",
      description: "Combined text content of all successfully read pages",
    },
    totalPages: { type: "number" },
    successfulReads: { type: "number" },
  },
};

readPageContent.description = "Read page content for multiple pages";
