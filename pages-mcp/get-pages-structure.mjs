import fs from "node:fs/promises";
import path from "node:path";
import { PAGES_OUTPUT_DIR } from "../utils/constants.mjs";

const structureDir = path.join(
  process.cwd(),
  "./.aigne/web-smith",
  PAGES_OUTPUT_DIR,
  "website-structure.yaml",
);

export default async function getPagesStructure() {
  const structure = await fs.readFile(structureDir, "utf-8");
  return { structure };
}

getPagesStructure.description = "Get pages structure";
