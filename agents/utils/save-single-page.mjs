import { savePageWithTranslations } from "../../utils/utils.mjs";

export default async function saveSinglePage({
  path,
  content,
  pagesDir,
  tmpDir,
  translates,
  locale,
  isTranslate = false,
  isShowMessage = false,
}) {
  await savePageWithTranslations({
    path,
    content,
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

  return {};
}

saveSinglePage.task_render_mode = "hide";
