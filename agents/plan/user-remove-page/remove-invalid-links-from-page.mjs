import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getFileName } from "../../../utils/utils.mjs";

export default async function removeInvalidLinksFromPage(input = {}, options = {}) {
  const {
    path,
    invalidLinks: rawInvalidLinks,
    websiteStructureResult,
    websiteStructure,
    tmpDir,
    pagesDir,
    locale,
    rules,
    originalWebsiteStructure,
    glossary,
    mediaFiles,
    componentLibrary,
  } = input;
  const pageInfo = websiteStructureResult.find((item) => item.path === path);

  // Extract actual link URLs from error messages
  const invalidLinks = rawInvalidLinks
    .map((msg) => {
      const match = msg.match(/Invalid internal link: ([^\s.]+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  if (!pageInfo) {
    throw new Error(`Page not found: ${path}`);
  }

  // Read existing page content
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({ fileName: flatName });
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

  // Call updatePageDetail to remove invalid links
  const updatePageDetailAgent = options.context.agents["updatePageDetail"];
  const feedback = `Remove invalid internal links: ${invalidLinks.join(
    ", ",
  )}. Delete any sections or content that reference these links.`;

  await options.context.invoke(updatePageDetailAgent, {
    pageDetail,
    rules,
    locale,
    originalWebsiteStructure,
    title: pageInfo.title,
    description: pageInfo.description,
    path,
    parentId: pageInfo.parentId || null,
    glossary: glossary || "",
    fieldConstraints: "",
    feedback,
    needDataSources: false,
    datasources: "",
  });

  const content = options.context.userContext.currentPageDetail;

  // pagData for save
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
