import {
  buildAllowedLinksFromStructure,
  buildAllowedMediaFilesFromList,
} from "../../utils/protocol-utils.mjs";
import { getFileName, savePageWithTranslations, validatePageDetail } from "../../utils/utils.mjs";

export default async function saveSinglePage({
  path,
  content,
  pagesDir,
  tmpDir,
  translates,
  locale,
  title,
  description,
  sourceIds,
  parentId,
  isTranslate = false,
  isShowMessage = false,
  throwErrorIfInvalid = false,
  componentLibrary,
  websiteStructure,
  mediaFiles,
}) {
  let effectiveContent = content;

  // Build allowed links from website structure
  const allowedLinks = buildAllowedLinksFromStructure(websiteStructure, locale, getFileName);

  // Build allowed media files from media files list
  const allowedMediaFiles = buildAllowedMediaFilesFromList(mediaFiles);

  const validation = validatePageDetail({
    pageDetailYaml: effectiveContent,
    allowArrayFallback: true,
    componentLibrary,
    allowedLinks,
    allowedMediaFiles,
  });

  if (!validation.isValid) {
    if (throwErrorIfInvalid) {
      const error = new Error(validation.validationFeedback || "Page detail validation failed");
      error.validationErrors = validation.errors;
      throw error;
    }
    // Only log the error with formatted output.
    console.error(`⚠️ Page Detail Validation Failed:\n${validation.validationFeedback}`);
  }

  if (validation.normalizedContent) {
    effectiveContent = validation.normalizedContent;
  }

  await savePageWithTranslations({
    path,
    content: effectiveContent,
    pagesDir,
    tmpDir,
    translates,
    locale,
    isTranslate,
  });

  if (isShowMessage) {
    const message = isTranslate
      ? `✅ Translation completed successfully`
      : `✅ Page updated successfully`;
    return { message };
  }

  return {
    path,
    content: effectiveContent,
    title,
    description,
    sourceIds,
    parentId,
    translates,
  };
}

saveSinglePage.task_render_mode = "hide";
