import fs from "node:fs/promises";
import path from "node:path";
import { WEB_SMITH_DIR } from "../utils/constants.mjs";

const pagesDir = path.join(process.cwd(), WEB_SMITH_DIR, "pages");

export default async function getPageDetail({ path: pagePath }) {
  try {
    // Flatten path: remove leading /, replace all / with - (same logic as utils.mjs)
    const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-");
    const fileFullName = `${flatName}.yaml`;
    const filePath = path.join(pagesDir, fileFullName);

    // Read the yaml file
    const content = await fs.readFile(filePath, "utf8");

    return {
      success: true,
      path: pagePath,
      content,
      filePath,
    };
  } catch (error) {
    return {
      success: false,
      path: pagePath,
      error: error.message,
    };
  }
}

getPageDetail.input_schema = {
  type: "object",
  properties: {
    path: {
      type: "string",
      description: "The path of the page to retrieve details for.",
    },
  },
};

getPageDetail.description = "Get single page detail";
