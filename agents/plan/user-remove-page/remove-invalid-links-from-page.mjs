import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getFileName } from "../../../utils/utils.mjs";
import checkDetailResult from "../../utils/check-detail-result.mjs";
import fixDetailCheckErrors from "../../utils/fix-detail-check-errors.mjs";

const MAX_FIX_ATTEMPTS = 5;

export default async function removeInvalidLinksFromPage(input = {}, options = {}) {
  const {
    path,
    websiteStructureResult,
    websiteStructure,
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

  // Read existing page content
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({ fileName: flatName });
  const filePath = join(tmpDir, locale, fileFullName);

  let reviewContent = "";
  try {
    reviewContent = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Failed to read page content for ${path}: ${error.message}`);
  }

  // Try to fix invalid links with check-detail-result and fix-detail-check-errors
  let currentContent = reviewContent;
  let attemptCount = 0;

  while (attemptCount < MAX_FIX_ATTEMPTS) {
    attemptCount++;

    // Check for errors
    const checkResult = await checkDetailResult(
      {
        ...input,
        websiteStructure,
        reviewContent: currentContent,
        allowArrayFallback: true,
        locale,
        componentLibrary,
        mediaFiles: mediaFiles || [],
      },
      options,
    );

    // If approved, we're done
    if (checkResult.isApproved) {
      break;
    }

    // If this is the last attempt, warn user and break
    if (attemptCount >= MAX_FIX_ATTEMPTS) {
      console.warn(
        `⚠️  Warning: Failed to fix all invalid links in page ${path} after ${MAX_FIX_ATTEMPTS} attempts.`,
      );
      console.warn(`Remaining errors:\n${checkResult.detailFeedback}`);
      break;
    }

    // Try to fix errors
    const fixResult = await fixDetailCheckErrors(
      {
        ...input,
        websiteStructure,
        reviewContent: currentContent,
        isApproved: checkResult.isApproved,
        detailFeedback: checkResult.detailFeedback,
        errors: checkResult.errors,
        allowArrayFallback: true,
        locale,
        componentLibrary,
        mediaFiles: mediaFiles || [],
      },
      options,
    );

    // Update content for next iteration
    currentContent = fixResult.reviewContent || fixResult.content || currentContent;

    console.log(`${filePath} ${attemptCount} isApproved: `, fixResult.isApproved)

    // If fix result is approved, we're done
    if (fixResult.isApproved) {
      break;
    }
  }

  // page data for save
  return {
    path,
    content: currentContent,
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
