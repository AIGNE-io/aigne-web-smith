import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { generateFieldConstraints } from "../../../utils/generate-helper.mjs";
import { getFileName } from "../../../utils/utils.mjs";

/**
 * Add links to a single page that should reference newly added pages
 */
export default async function addLinksToPages(input = {}, options = {}) {
  const {
    path,
    newLinks,
    websiteStructure,
    websiteStructureResult,
    tmpDir,
    pagesDir,
    locale,
    mediaFiles,
    componentLibrary,
  } = input;

  const pageInfo = websiteStructureResult.find((item) => item.path === path);

  if (!pageInfo) {
    throw new Error(`Page not found: ${path}`);
  }

  if (!newLinks || newLinks.length === 0) {
    throw new Error(`No new links provided for page: ${path}`);
  }

  // Read existing page content
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({ locale, fileName: flatName });
  const filePath = join(tmpDir, locale, fileFullName);

  let pageDetail = "";
  try {
    pageDetail = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Failed to read page content for ${path}: ${error.message}`);
  }

  // Clear previous tool inputs
  options.context.userContext.lastToolInputs = {};
  options.context.userContext.currentPageDetail = pageDetail;

  // Call updatePageDetail to add links
  const updatePageDetailAgent = options.context.agents["updatePageDetail"];
  const linkPaths = newLinks.join(", ");
  const feedback = `Add the following internal links to this page: ${linkPaths}. Identify suitable places within the existing content — such as relevant sections, navigation items, or CTAs — and insert the links naturally to maintain context and readability.`;

  const fieldConstraints = generateFieldConstraints(componentLibrary);

  await options.context.invoke(updatePageDetailAgent, {
    ...input,
    pageDetail,
    title: pageInfo.title,
    description: pageInfo.description,
    parentId: pageInfo.parentId || null,
    fieldConstraints,
    feedback,
    needDataSources: true,
  });

  const content = options.context.userContext.currentPageDetail;

  // page data for save
  return {
    path,
    content,
    pagesDir,
    tmpDir,
    translates: pageInfo.translates,
    locale,
    title: pageInfo.title,
    description: pageInfo.description,
    sourceIds: pageInfo.sourceIds,
    parentId: pageInfo.parentId || null,
    isTranslate: false,
    isShowMessage: false,
    throwErrorIfInvalid: false,
    componentLibrary,
    websiteStructure,
    mediaFiles,
  };
}

addLinksToPages.taskTitle = "Add links to pages";
addLinksToPages.description = "Add links to existing pages that reference newly added pages";
