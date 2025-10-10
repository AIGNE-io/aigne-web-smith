import { readFile } from "node:fs/promises";
import { join } from "node:path";
import _ from "lodash";
import { parse, stringify } from "yaml";
import { NAVIGATIONS_FILE_NAME } from "../../../utils/constants.mjs";

/**
 * Analyze page content to determine what needs to be translated
 * @param {Object} params
 * @param {Array} params.selectedPages - Selected pages to analyze
 * @returns {Promise<Object>} Analysis result with pages that need translation
 */
export default async function analyzeTranslateNavigations(input, options) {
  const { originalWebsiteStructure, tmpDir, locales, locale } = input;

  if (!originalWebsiteStructure?.length) {
    // skip
    return {
      selectedNavigations: [],
    };
  }

  const selectedNavigationsMap = {};

  await Promise.all(
    locales.map(async (currentLocale) => {
      // find if existing navigation is translated
      const mainFileTmpDir = join(tmpDir, currentLocale);

      let localeNavigations = [];

      try {
        localeNavigations = parse(
          await readFile(join(mainFileTmpDir, NAVIGATIONS_FILE_NAME), "utf-8"),
        );
      } catch (_error) {
        // find if existing navigation is translated
        if (currentLocale === locale) {
          localeNavigations = originalWebsiteStructure.map((page) => {
            return {
              path: page.path,
              navigation: page.navigation,
            };
          });
        } else {
          localeNavigations = [];
        }
      }

      let localeNavigationsGroupByPath = null;

      if (localeNavigations?.length) {
        localeNavigationsGroupByPath = _.keyBy(localeNavigations, "path");
      }

      originalWebsiteStructure.forEach((page) => {
        const { navigation, path } = page;
        const item = localeNavigationsGroupByPath?.[path];
        selectedNavigationsMap[path] ??= {
          path: path,
          baseNavigation: navigation,
          navigation: {},
          missingLanguages: new Set(),
        };

        if (!item) {
          selectedNavigationsMap[path].missingLanguages.add(currentLocale);
        } else if (item?.navigation) {
          selectedNavigationsMap[path].navigation[currentLocale] = item?.navigation;
        }
      });
    }),
  );

  const needTranslateNavigations = Object.values(selectedNavigationsMap).filter(
    (item) => item?.missingLanguages?.size > 0,
  );

  if (needTranslateNavigations?.length) {
    console.warn(2222, needTranslateNavigations);

    const formatNeedTranslateNavigations = needTranslateNavigations.map((item) => {
      return {
        ...item,
        content: stringify(item.baseNavigation),
        missingLanguages: Array.from(item.missingLanguages),
      };
    });

    const translateNavigationsResult = await options.context.invoke(
      options.context.agents["translateNavigationsTeam"],
      {
        ...input,
        needTranslateNavigations: formatNeedTranslateNavigations,
      },
      {
        ...options,
        streaming: false,
      },
    );

    console.warn(2222, needTranslateNavigations, translateNavigationsResult);
  }

  return {
    selectedNavigations: needTranslateNavigations,
  };
}
analyzeTranslateNavigations.task_title =
  "Analyze navigations to determine what needs to be translated";
