import { savePageWithTranslations, validatePageDetail } from "../../utils/utils.mjs";

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
}) {
  let effectiveContent = content;
  const validation = validatePageDetail({
    pageDetailYaml: effectiveContent,
    allowArrayFallback: true,
  });

  if (!validation.isValid) {
    const error = new Error(validation.validationFeedback || "Page detail validation failed");
    error.validationErrors = validation.errors;
    throw error;
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
