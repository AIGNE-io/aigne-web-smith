import { recordUpdate } from "../../../utils/history-utils.mjs";

export default async function mergePagesWithTranslations(
  { pagesWithNewLinks, newPages, translateLanguages = [], allFeedback },
  options,
) {
  let selectedPages = [...pagesWithNewLinks, ...newPages];
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
  };
}
