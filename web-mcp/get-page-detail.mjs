import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

const outputDir = path.join(process.cwd(), "./.aigne/web-smith", "output");

export default async function getPageDetail({ pagePath }) {
  try {
    // Normalize page path to filename
    const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-") || "index";

    // Try to find both content and template files
    const contentFile = path.join(outputDir, "content", `${flatName}.md`);
    const templateFile = path.join(outputDir, "templates", `${flatName}.yaml`);

    const result = {
      pagePath,
      success: true,
      content: null,
      template: null,
      contentExists: false,
      templateExists: false,
    };

    // Read content file if exists
    try {
      result.content = await fs.readFile(contentFile, "utf-8");
      result.contentExists = true;
    } catch {
      // Content file doesn't exist, that's okay
    }

    // Read template file if exists
    try {
      const templateContent = await fs.readFile(templateFile, "utf-8");
      result.template = parse(templateContent);
      result.templateExists = true;
    } catch {
      // Template file doesn't exist, that's okay
    }

    if (!result.contentExists && !result.templateExists) {
      return {
        pagePath,
        success: false,
        error: `No content or template found for page: ${pagePath}`,
        content: null,
        template: null,
        contentExists: false,
        templateExists: false,
      };
    }

    return result;
  } catch (error) {
    return {
      pagePath,
      success: false,
      error: error.message,
      content: null,
      template: null,
      contentExists: false,
      templateExists: false,
    };
  }
}

getPageDetail.input_schema = {
  type: "object",
  properties: {
    pagePath: {
      type: "string",
      description: "Page path (e.g., '/about', '/products/feature')",
    },
  },
  required: ["pagePath"],
};

getPageDetail.output_schema = {
  type: "object",
  properties: {
    pagePath: {
      type: "string",
      description: "The requested page path",
    },
    success: {
      type: "boolean",
      description: "Whether the page detail was successfully retrieved",
    },
    content: {
      type: ["string", "null"],
      description: "Markdown content of the page",
    },
    template: {
      type: ["object", "null"],
      description: "YAML template for Pages Kit",
    },
    contentExists: {
      type: "boolean",
      description: "Whether content file exists",
    },
    templateExists: {
      type: "boolean",
      description: "Whether template file exists",
    },
    error: {
      type: "string",
      description: "Error message if retrieval failed",
    },
  },
};

getPageDetail.description = "Get detailed content and template for a specific page";
