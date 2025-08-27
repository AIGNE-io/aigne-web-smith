import fs from "node:fs/promises";
import path from "node:path";

const structureDir = path.join(
  process.cwd(),
  "./.aigne/web-smith",
  "output",
  "structure-plan.json",
);

export default async function getWebsiteStructure() {
  try {
    const structure = await fs.readFile(structureDir, "utf-8");
    return {
      structure: JSON.parse(structure),
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      structure: null,
    };
  }
}

getWebsiteStructure.description = "Get current website structure planning result";

getWebsiteStructure.output_schema = {
  type: "object",
  properties: {
    structure: {
      type: ["array", "null"],
      description: "Website structure plan array or null if not found",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          path: { type: "string" },
          parentId: { type: ["string", "null"] },
        },
      },
    },
    success: {
      type: "boolean",
      description: "Whether the structure was successfully loaded",
    },
    error: {
      type: "string",
      description: "Error message if loading failed",
    },
  },
};
