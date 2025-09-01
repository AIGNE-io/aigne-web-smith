import { saveDocWithTranslations } from "../utils/utils.mjs";

export default async function saveSingleDoc({
  path,
  content,
  docsDir,
  translates,
  labels,
  locale,
  isTranslate = false,
  isShowMessage = false,
}) {
  const _results = await saveDocWithTranslations({
    path,
    content,
    docsDir,
    translates,
    labels,
    locale,
    isTranslate,
  });

  if (isShowMessage) {
    const message = isTranslate
      ? `✅ Translation completed successfully`
      : `✅ Document updated successfully`;
    return { message };
  }

  return {};
}

saveSingleDoc.task_render_mode = "hide";
