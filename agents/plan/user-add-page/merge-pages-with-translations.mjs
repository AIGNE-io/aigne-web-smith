export default async function mergePagesWithTranslations(
  { pagesWithNewLinks, newPages, translateLanguages = [] },
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

  return {
    selectedPages,
    originalWebsiteStructure: JSON.parse(JSON.stringify(currentStructure)), // for analyze navigation
  };
}
