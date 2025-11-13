import { recordUpdate } from "../../../utils/history-utils.mjs";

export default async function mergePagesWithTranslations(
  { pagesWithNewLinks, newPages, translateLanguages = [], allFeedback },
  options,
) {
  const currentStructure = options.context?.userContext?.currentStructure || [];
  const updatedPages = new Set(pagesWithNewLinks.map((v) => v.path));

  let selectedPages = [...currentStructure.filter((v) => updatedPages.has(v.path)), ...newPages];
  const transformWebsiteStructure = options.context.agents["transformWebsiteStructure"];
  const { websiteStructureResult } = await options.context.invoke(transformWebsiteStructure, {
    websiteStructure: selectedPages,
    translateLanguages,
  });

  selectedPages = websiteStructureResult;

  // Record the update
  recordUpdate({
    operation: "structure_update",
    feedback: allFeedback.join("\n"),
  });

  return {
    selectedPages,
    originalWebsiteStructure: JSON.parse(JSON.stringify(currentStructure)), // for analyze navigation
  };
}
