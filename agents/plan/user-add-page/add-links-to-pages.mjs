import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getFileName } from "../../../utils/utils.mjs";

/**
 * Add links to a single page that should reference newly added pages
 */
export default async function addLinksToPages(input = {}, options = {}) {
  const {
    path,
    newLinks,
    websiteStructure = [],
    originalWebsiteStructure = [],
    tmpDir,
    pagesDir,
    locale,
    rules = "",
    glossary = "",
  } = input;

  const pageInfo = websiteStructure.find((item) => item.path === path);

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
  const feedback = `Add internal links to the following new pages: ${linkPaths}. Integrate these links naturally into the existing content, such as in relevant sections, navigation lists, or call-to-action areas. Ensure the links are contextually appropriate and enhance the user experience.`;

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

  // pageData for save
  return {
    path,
    content,
    pagesDir,
    tmpDir,
    translates: [],
    locale,
    title: pageInfo.title,
    description: pageInfo.description,
    sourceIds: pageInfo.sourceIds,
    parentId: pageInfo.parentId || null,
    isTranslate: false,
    isShowMessage: false,
    throwErrorIfInvalid: false,
    componentLibrary: [],
    websiteStructure,
    mediaFiles: [],
  };
}

addLinksToPages.taskTitle = "Add links to pages";
addLinksToPages.description = "Add links to existing pages that reference newly added pages";
