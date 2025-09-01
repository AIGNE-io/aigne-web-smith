import fs from "node:fs/promises";
import path from "node:path";

const structureDir = path.join(
  process.cwd(),
  "./.aigne/web-smith",
  "output",
  "structure-plan.json",
);

export default async function getPagesStructure() {
  const structure = await fs.readFile(structureDir, "utf-8");
  return { structure };
}

getPagesStructure.description = "Get pages structure";
