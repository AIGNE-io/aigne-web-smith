import choosePages from "../utils/choose-pages.mjs";
import chooseLanguage from "./choose-language.mjs";

/**
 * Analyze page content to determine what needs to be translated
 * @param {Object} params
 * @param {Array} params.selectedPages - Selected pages to analyze
 * @returns {Promise<Object>} Analysis result with pages that need translation
 */
export default async function analyzeTranslatePageDetail(input, options) {
  const {
    websiteStructureResult,
    translateLanguages,
    skipIfExists = false,
    selectedPages = [],
  } = input;

  const langs = translateLanguages;

  if (!langs.length === 0 || !websiteStructureResult?.length) {
    // skip
    return {
      selectedPages: [],
    };
  }

  const pages = websiteStructureResult
    ?.map((item) => item.path)
    .filter((path) => {
      return (
        !selectedPages ||
        selectedPages.length === 0 ||
        selectedPages.some((page) => page.path === path)
      );
    });

  const choosePagesResult = await choosePages(
    {
      ...input,
      pages,
      requiredFeedback: false,
    },
    options,
  );

  const chooseLanguagesResult = await chooseLanguage(
    {
      ...input,
      ...choosePagesResult,
      skipIfExists,
      langs,
      requiredFeedback: false,
    },
    options,
  );

  // 提取需要翻译的页面
  const needTranslateSelectedPages = chooseLanguagesResult?.selectedPages?.filter((page) => {
    return page?.translates?.length > 0;
  });

  return {
    websiteStructureResult,
    ...choosePagesResult,
    ...chooseLanguagesResult,
    selectedPages: needTranslateSelectedPages,
  };
}

analyzeTranslatePageDetail.task_title =
  "Analyze page content to determine what needs to be translated";
