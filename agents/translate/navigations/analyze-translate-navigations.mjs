import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import _ from "lodash";
import { parse, stringify } from "yaml";
import { NAVIGATIONS_FILE_NAME } from "../../../utils/constants.mjs";
import { ensureDir } from "../../../utils/utils.mjs";

/**
 * Analyze page content to determine what needs to be translated
 * @param {Object} params
 * @param {Array} params.selectedPages - Selected pages to analyze
 * @returns {Promise<Object>} Analysis result with pages that need translation
 */
export default async function analyzeTranslateNavigations(input, options) {
  const { originalWebsiteStructure, websiteStructure = [], tmpDir, locales, locale } = input;

  if (!originalWebsiteStructure?.length) {
    // skip
    return {};
  }

  // use the latest website structure to analyze
  const websiteMap = new Set(websiteStructure.map((v) => v.path));
  const currentStructure = originalWebsiteStructure.filter((v) => websiteMap.has(v.path));

  const selectedNavigationsMap = {};

  await Promise.all(
    locales.map(async (currentLocale) => {
      // find if existing navigation is translated
      const mainFileTmpDir = join(tmpDir, currentLocale);

      let localeNavigations = [];
      const navigationsFilePath = join(mainFileTmpDir, NAVIGATIONS_FILE_NAME);

      try {
        localeNavigations = parse(await readFile(navigationsFilePath, "utf-8"));
      } catch (_error) {
        // find if existing navigation is translated
        if (currentLocale === locale) {
          localeNavigations = currentStructure.map((page) => {
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

      currentStructure.forEach((page) => {
        const { navigation: baseNavigation, path } = page;
        const item = localeNavigationsGroupByPath?.[path];
        selectedNavigationsMap[path] ??= {
          path: path,
          baseNavigation,
          navigation: {
            [locale]: baseNavigation,
          },
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
    const formatNeedTranslateNavigations = needTranslateNavigations.map((item) => {
      return {
        ...item,
        content: stringify(item.navigation, {
          aliasDuplicateObjects: false,
        }),
        missingLanguages: Array.from(item.missingLanguages).filter((item) => item !== locale),
      };
    });

    const translateNavigationsResult = await options.context.invoke(
      options.context.agents["translateNavigationsTeam"],
      {
        ...input,
        needTranslateNavigations: formatNeedTranslateNavigations,
        mainLocale: locale,
      },
      {
        ...options,
        streaming: false,
      },
    );

    translateNavigationsResult.needTranslateNavigations?.map(async (item) => {
      const { path, navigationTranslation } = item;
      const translationMap = parse(navigationTranslation);
      selectedNavigationsMap[path].navigation = {
        ...selectedNavigationsMap[path].navigation,
        ...translationMap,
      };
    });
  }

  const navigationOutputByLocale = {};

  Object.values(selectedNavigationsMap).forEach(({ path, navigation }) => {
    Object.entries(navigation).forEach(([currentLocale, navigationContent]) => {
      navigationOutputByLocale[currentLocale] ??= [];
      navigationOutputByLocale[currentLocale].push({
        path,
        navigation: navigationContent,
      });
    });
  });

  await Promise.all(
    Object.entries(navigationOutputByLocale).map(([currentLocale, navigations]) => {
      const mainFileTmpDir = join(tmpDir, currentLocale);
      const navigationsFilePath = join(mainFileTmpDir, NAVIGATIONS_FILE_NAME);

      ensureDir(dirname(navigationsFilePath));

      return writeFile(
        navigationsFilePath,
        stringify(navigations, {
          aliasDuplicateObjects: false,
        }),
      );
    }),
  );

  return {};
}
analyzeTranslateNavigations.task_title =
  "Analyze navigations to determine what needs to be translated";
