import { recordUpdate } from "../../../utils/history-utils.mjs";
import saveOutput from "../../utils/save-output.mjs";

export default async function saveStructureAfterRemoval(
  { originalWebsiteStructure, deletedPages, tmpDir, translateLanguages },
  options,
) {
  const deletedPagesSet = new Set(deletedPages);
  const websiteStructure = originalWebsiteStructure.filter((v) => !deletedPagesSet.has(v.path));
  const transformWebsiteStructure = options.context.agents["transformWebsiteStructure"];
  const { websiteStructureResult } = await options.context.invoke(transformWebsiteStructure, {
    websiteStructure,
    translateLanguages,
  });

  const result = await saveOutput({
    saveKey: "websiteStructure",
    savePath: tmpDir,
    fileName: "website-structure.yaml",
    websiteStructure,
  });

  recordUpdate({
    operation: "structure_update",
    feedback: `Removed pages: ${deletedPages.join(", ")}`,
  });

  return {
    ...result,
    originalWebsiteStructure: websiteStructure, // Regenerate navigation after deleting pages
    websiteStructureResult, // Exclude deleted pages
  };
}
