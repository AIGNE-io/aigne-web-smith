import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { joinURL, withLeadingSlash } from "ufo";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { NAVIGATIONS_FILE_NAME } from "../../utils/constants.mjs";
import {
  formatRoutePath,
  generateNavigationId,
  getCurrentGitHead,
  saveGitHeadToConfig,
} from "../../utils/utils.mjs";

/**
 * @param {Object} params
 * @param {Array<{path: string, content: string, title: string}>} params.websiteStructure
 * @param {string} params.pagesDir
 * @param {Array<string>} [params.translateLanguages] - Translation languages
 * @param {Array<{filePath: string, content: string}>} [params.allPagesKitYaml]
 * @param {string} [params.projectName]
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
export default async function savePages({
  websiteStructureResult: websiteStructure,
  pagesDir,
  outputDir,
  translateLanguages = [],
  locale,
  projectInfoMessage,
  allPagesKitYaml,
  projectName,
}) {
  // Save current git HEAD to config.yaml for change detection
  try {
    const gitHead = getCurrentGitHead();
    await saveGitHeadToConfig(gitHead);
  } catch (err) {
    console.warn("Failed to save git HEAD:", err.message);
  }

  // Generate _sitemap.yaml
  try {
    let navigationLocalesMap = new Map();
    try {
      navigationLocalesMap = await loadNavigationLocalesMap(pagesDir, [
        locale,
        ...translateLanguages,
      ]);
    } catch (err) {
      console.warn("Failed to load localized navigations:", err.message);
    }

    const sitemap = generateSitemapYaml(
      websiteStructure,
      allPagesKitYaml,
      locale,
      translateLanguages,
      projectName,
      navigationLocalesMap,
    );
    const sitemapPath = join(outputDir, "_sitemap.yaml");

    await writeFile(sitemapPath, sitemap, "utf8");
  } catch (err) {
    console.error("Failed to save _sitemap.yaml:", err.message);
  }

  // Clean up invalid .yaml files that are no longer in the structure plan
  try {
    await cleanupInvalidFiles(websiteStructure, pagesDir, translateLanguages, locale);
  } catch (err) {
    console.error("Failed to cleanup invalid .yaml files:", err.message);
  }

  const pageCount = websiteStructure.length;
  const pageWord = pageCount === 1 ? "page" : "pages";
  const message = `✅ Pages generated successfully! (\`${pageCount}\` ${pageWord} → \`${pagesDir}\`)${projectInfoMessage ? `\n${projectInfoMessage}` : ""}

🚀 Next: Make your website live and generate a shareable link, run: \`aigne web publish\`
💡 Optional: Update specific pages (\`aigne web update\`) or refine website structure (\`aigne web generate\`)
`;

  return {
    message,
  };
}

/**
 * Clean up .yaml files that are no longer in the structure plan
 * @param {Array<{path: string, title: string}>} websiteStructure
 * @param {string} pagesDir - Base pages directory containing workspace and output subdirectories
 * @param {Array<string>} translateLanguages
 * @param {string} locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
async function cleanupInvalidFiles(websiteStructure, pagesDir, translateLanguages, locale) {
  const results = [];

  // Generate expected file names from structure plan (no language suffixes since files are organized by folders)
  const expectedFiles = new Set();
  for (const { path } of websiteStructure) {
    const flatName = path.replace(/^\//, "").replace(/\//g, "-");
    const fileName = `${flatName}.yaml`;
    expectedFiles.add(fileName);
  }

  // Clean up workspace files (tmpDir/locale subdirectories)
  const workspaceDir = join(pagesDir, "workspace");
  try {
    // Clean main locale directory
    const mainLocaleDir = join(workspaceDir, locale);
    await cleanupDirectoryFiles(mainLocaleDir, expectedFiles, results, "workspace");

    // Clean translation locale directories
    for (const lang of translateLanguages) {
      const langDir = join(workspaceDir, lang);
      await cleanupDirectoryFiles(langDir, expectedFiles, results, "workspace");
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`Failed to cleanup workspace files: ${err.message}`);
    }
  }

  // Clean up output files (outputDir directly) - same expected files, preserve _sitemap.yaml
  const outputDir = join(pagesDir, "output");
  try {
    await cleanupDirectoryFiles(outputDir, expectedFiles, results, "output");
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`Failed to cleanup output files: ${err.message}`);
    }
  }

  return results;
}

/**
 * Clean up files in a specific directory
 * @param {string} dirPath - Directory path to clean
 * @param {Set<string>} expectedFiles - Set of expected file names
 * @param {Array} results - Results array to append to
 * @param {string} dirType - Directory type for logging ("workspace" or "output")
 */
async function cleanupDirectoryFiles(dirPath, expectedFiles, results, dirType) {
  try {
    const files = await readdir(dirPath);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

    // Find files to delete (files that are not in expectedFiles and not _sitemap.yaml)
    const filesToDelete = yamlFiles.filter(
      (file) => !expectedFiles.has(file) && !file.startsWith("_"),
    );

    // Delete invalid files
    for (const file of filesToDelete) {
      try {
        const filePath = join(dirPath, file);
        await unlink(filePath);
        results.push({
          path: filePath,
          success: true,
          message: `Successfully deleted invalid file from ${dirType} directory: ${file}`,
        });
      } catch (err) {
        results.push({
          path: file,
          success: false,
          error: `Failed to delete file from ${dirType} directory: ${file}: ${err.message}`,
        });
      }
    }

    if (filesToDelete.length > 0) {
      console.log(
        `Cleaned up ${filesToDelete.length} invalid .yaml files from ${dirType} directory: ${dirPath}`,
      );
    }
  } catch (err) {
    // If directory doesn't exist, that's okay
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}

async function loadNavigationLocalesMap(pagesDir, locales = []) {
  const map = new Map();
  if (!pagesDir) return map;

  const uniqueLocales = Array.from(new Set((locales || []).filter(Boolean)));
  if (uniqueLocales.length === 0) {
    return map;
  }

  const workspaceDir = join(pagesDir, "workspace");

  await Promise.all(
    uniqueLocales.map(async (localeKey) => {
      const navigationsFilePath = join(workspaceDir, localeKey, NAVIGATIONS_FILE_NAME);
      let fileContent;

      try {
        fileContent = await readFile(navigationsFilePath, "utf8");
      } catch (err) {
        if (err?.code !== "ENOENT") {
          console.warn(`Failed to read navigation file (${navigationsFilePath}): ${err.message}`);
        }
        return;
      }

      let parsed;
      try {
        parsed = yamlParse(fileContent);
      } catch (err) {
        console.warn(`Failed to parse navigation file (${navigationsFilePath}): ${err.message}`);
        return;
      }

      if (!Array.isArray(parsed)) {
        return;
      }

      parsed.forEach((entry) => {
        if (!entry || typeof entry.path !== "string") return;
        const normalizedPath = withLeadingSlash(entry.path);
        if (!normalizedPath || typeof entry.navigation !== "object") return;

        const navigationLocales = map.get(normalizedPath) ?? {};
        navigationLocales[localeKey] = entry.navigation;
        map.set(normalizedPath, navigationLocales);
      });
    }),
  );

  return map;
}

// Generate sitemap YAML content, support nested structure, and the order is consistent with websiteStructure
function generateSitemapYaml(
  websiteStructure,
  allPagesKitYaml = [],
  mainLocale,
  translateLanguages = [],
  projectName,
  navigationLocalesMap = new Map(),
) {
  const pageMetaMap = buildPageMetaMap(allPagesKitYaml);
  const navigationEntries = [];
  const usedNavigationIds = new Set();
  const pathToNavigationId = new Map();

  // Build tree structure
  const root = {};
  for (const { path, title, parentId } of websiteStructure) {
    const relPath = path.replace(/^\//, "");
    const segments = relPath.split("/").filter(Boolean);
    if (segments.length === 0) {
      // Keep placeholder for root ("/") paths to avoid generating empty keys
      segments.push("");
    }
    let node = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!node[seg])
        node[seg] = {
          __children: {},
          __title: null,
          __fullPath: segments.slice(0, i + 1).join("/"),
          __parentId: parentId,
          __metaKey: normalizePathToKey(segments.slice(0, i + 1).join("/")),
        };
      if (i === segments.length - 1) {
        node[seg].__title = title;
        node[seg].__metaKey = normalizePathToKey(segments.slice(0, i + 1).join("/"));
      }
      node = node[seg].__children;
    }
  }
  // Recursively generate YAML sitemap structure
  function walk(node, parentSegments = []) {
    const items = [];
    for (const key of Object.keys(node)) {
      const item = node[key];
      const fullSegments = [...parentSegments, key];
      // const flatFile = `${fullSegments.join("-")}.yaml`;

      const flatFile = fullSegments.join("/");
      if (item.__title) {
        const fullPath = `/${flatFile}`;
        const sitemapItem = {
          title: item.__title,
          path: fullPath,
        };
        const metaKey = item.__metaKey || normalizePathToKey(fullSegments.join("/"));
        const pageMeta = pageMetaMap.get(metaKey);
        if (pageMeta) {
          if (pageMeta.locales && Object.keys(pageMeta.locales).length > 0) {
            sitemapItem.locales = pageMeta.locales;
          }
          if (pageMeta.meta && Object.keys(pageMeta.meta).length > 0) {
            sitemapItem.meta = pageMeta.meta;
          }
        }
        const parentPath = parentSegments.length > 0 ? `/${parentSegments.join("/")}` : undefined;
        const navigationLocalesForPath =
          navigationLocalesMap instanceof Map
            ? navigationLocalesMap.get(fullPath)
            : navigationLocalesMap?.[fullPath];
        const navigationEntry = buildNavigationEntry({
          path: fullPath,
          title: item.__title,
          parentPath,
          pageMeta,
          usedNavigationIds,
          pathToNavigationId,
          mainLocale,
          translateLanguages,
          navigationLocales: navigationLocalesForPath,
        });

        if (navigationEntry.length > 0) {
          navigationEntries.push(...navigationEntry);
        }

        const children = item.__children;
        if (Object.keys(children).length > 0) {
          sitemapItem.children = walk(children, fullSegments);
        }
        items.push(sitemapItem);
      }
    }
    return items;
  }

  const sitemapItems = walk(root);

  const sitemapData = {
    sitemap: sitemapItems,
  };

  // append root node if multi pages
  if (
    Array.isArray(sitemapItems) &&
    sitemapItems.length > 1 &&
    typeof projectName === "string" &&
    projectName.trim().length > 0
  ) {
    const normalizedProjectName = projectName.trim();
    const localeKeys = new Set([mainLocale, ...translateLanguages].filter(Boolean));
    if (localeKeys.size === 0) {
      localeKeys.add("en");
    }

    const rootNavigationId = generateNavigationId(`/${normalizedProjectName}`, usedNavigationIds);

    const rootTitleLocales = {};
    const rootLinkLocales = {};
    for (const localeKey of localeKeys) {
      rootTitleLocales[localeKey] = normalizedProjectName;
      rootLinkLocales[localeKey] = formatRoutePath(withLeadingSlash(joinURL(`${localeKey}`, "/")));
    }

    const rootNavEntries = [
      {
        id: `${rootNavigationId}-header`,
        section: "header",
        visible: true,
        title: rootTitleLocales,
        link: rootLinkLocales,
        description: "",
        parent: "",
      },
      {
        id: `${rootNavigationId}-footer`,
        section: "footer",
        visible: true,
        title: rootTitleLocales,
        link: rootLinkLocales,
        description: "",
        parent: "",
      },
    ];

    navigationEntries
      .filter((entry) => !entry.parent)
      .forEach((entry) => {
        const targetRoot = entry.section === "footer" ? rootNavEntries[1].id : rootNavEntries[0].id;
        entry.parent = targetRoot;
      });

    navigationEntries.unshift(...rootNavEntries);
  }

  if (navigationEntries.length > 0) {
    sitemapData.navigations = navigationEntries;
  }

  return yamlStringify(sitemapData, {
    aliasDuplicateObjects: false,
  });
}

function buildPageMetaMap(allPagesKitYaml = []) {
  const map = new Map();
  if (!Array.isArray(allPagesKitYaml)) return map;

  for (const entry of allPagesKitYaml) {
    if (!entry || typeof entry.filePath !== "string" || typeof entry.content !== "string") {
      continue;
    }

    let parsed;
    try {
      parsed = yamlParse(entry.content);
    } catch (err) {
      console.warn(
        `Failed to parse page YAML for sitemap metadata (${entry.filePath}): ${err.message}`,
      );
      continue;
    }

    const localesMeta = extractLocalesMeta(parsed?.locales);
    const pageMeta = pickDefined({
      file: entry.filePath,
      id: parsed?.id,
      createdAt: parsed?.createdAt,
      updatedAt: parsed?.updatedAt,
      publishedAt: parsed?.publishedAt,
      isPublic: parsed?.isPublic,
    });

    const key = normalizePathToKey(entry.filePath);

    map.set(key, {
      locales: localesMeta,
      meta: pageMeta,
    });
  }

  return map;
}

function extractLocalesMeta(locales) {
  if (!locales || typeof locales !== "object") return {};

  const allowedFields = ["title", "description", "image", "style", "backgroundColor", "header"];
  const localeMeta = {};

  for (const [locale, data] of Object.entries(locales)) {
    if (!data || typeof data !== "object") continue;
    const sanitized = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sanitized[field] = data[field];
      }
    }

    if (Object.keys(sanitized).length > 0) {
      localeMeta[locale] = sanitized;
    }
  }

  return localeMeta;
}

function normalizePathToKey(value) {
  if (typeof value !== "string" || value.length === 0) return "";
  return value
    .replace(/^\//, "")
    .replace(/\.ya?ml$/i, "")
    .replace(/\//g, "-");
}

function pickDefined(object) {
  return Object.fromEntries(
    Object.entries(object || {}).filter(([, value]) => value !== undefined && value !== null),
  );
}

function buildNavigationEntry({
  path,
  title,
  parentPath,
  pageMeta,
  usedNavigationIds,
  pathToNavigationId,
  mainLocale,
  translateLanguages = [],
  navigationLocales = {},
}) {
  if (!path) return [];

  const sections = determineNavigationSections(pageMeta?.meta);
  if (sections.length === 0) {
    return [];
  }

  const baseNavigationId = generateNavigationId(path, usedNavigationIds);

  const locales = pageMeta?.locales || {};
  const localeKeys = new Set(
    [mainLocale, ...translateLanguages, ...Object.keys(locales || {})].filter(Boolean),
  );

  const titleLocales = buildLocaleStrings(locales, localeKeys, "title", title, navigationLocales);
  const descriptionLocales = buildLocaleStrings(
    locales,
    localeKeys,
    "description",
    undefined,
    navigationLocales,
  );
  const linkLocales = buildLinkLocales(locales, localeKeys, path);

  const parentId = parentPath ? pathToNavigationId.get(parentPath) : undefined;

  const entries = sections.map((section, index) => {
    const navigation = {
      id:
        index === 0
          ? baseNavigationId
          : generateNavigationId(`${path}#${section}`, usedNavigationIds),
      section,
      visible: true,
      title: titleLocales,
      link: linkLocales,
    };

    if (Object.keys(descriptionLocales).length > 0) {
      navigation.description = descriptionLocales;
    }

    if (parentId) {
      navigation.parent = parentId;
    }

    return navigation;
  });

  if (entries.length > 0) {
    pathToNavigationId.set(path, entries[0].id);
  }

  return entries;
}

function buildLocaleStrings(locales, localeKeys, field, fallback, navigationLocales = {}) {
  const result = {};
  for (const locale of localeKeys) {
    const navigationValue = navigationLocales?.[locale]?.[field];
    if (
      navigationValue !== undefined &&
      navigationValue !== null &&
      `${navigationValue}`.length > 0
    ) {
      result[locale] = navigationValue;
      continue;
    }

    const value = locales?.[locale]?.[field];
    if (value !== undefined && value !== null && `${value}`.length > 0) {
      result[locale] = value;
    } else if (fallback !== undefined && field === "title") {
      result[locale] = fallback;
    }
  }
  return result;
}

function buildLinkLocales(locales, localeKeys, defaultPath) {
  const result = {};
  for (const locale of localeKeys) {
    const localeLink = locales?.[locale]?.link;
    if (typeof localeLink === "string" && localeLink.trim().length > 0) {
      result[locale] = formatRoutePath(localeLink.trim());
    } else {
      // unnecessary combine locale and path
      result[locale] = formatRoutePath(withLeadingSlash(defaultPath));
    }
  }
  return result;
}

function determineNavigationSections(meta = {}) {
  const rawSection = meta?.navigationSection ?? meta?.section;

  let sections = [];
  if (Array.isArray(rawSection)) {
    sections = rawSection;
  } else if (typeof rawSection === "string" && rawSection.trim().length > 0) {
    sections = rawSection
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (sections.length === 0) {
    sections = ["header", "footer"];
  }

  return Array.from(new Set(sections));
}
