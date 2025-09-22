import { readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { getCurrentGitHead, saveGitHeadToConfig } from "../../utils/utils.mjs";

/**
 * @param {Object} params
 * @param {Array<{path: string, content: string, title: string}>} params.websiteStructure
 * @param {string} params.pagesDir
 * @param {Array<string>} [params.translateLanguages] - Translation languages
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
export default async function savePages({
  websiteStructureResult: websiteStructure,
  pagesDir,
  outputDir,
  // translateLanguages = [],
  // locale,
  projectInfoMessage,
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
    const sitemap = generateSitemapYaml(websiteStructure);
    const sitemapPath = join(outputDir, "_sitemap.yaml");
    await writeFile(sitemapPath, sitemap, "utf8");
  } catch (err) {
    console.error("Failed to save _sitemap.yaml:", err.message);
  }

  // Clean up invalid .yaml files that are no longer in the structure plan
  // try {
  //   // @FIXME
  //   // await cleanupInvalidFiles(websiteStructure, pagesDir, translateLanguages, locale);
  // } catch (err) {
  //   console.error("Failed to cleanup invalid .yaml files:", err.message);
  // }

  const message = `✅ Pages Generated Successfully!

Generated **${websiteStructure.length}** page templates and saved to: \`${pagesDir}\`
  ${projectInfoMessage || ""}
🚀 Next Steps

**Publish Your Pages**
Generate a shareable preview link for your team:

  \`aigne web publish\`

🔧 Optional Improvements

**Update Specific Pages**
Regenerate content for individual pages:

  \`aigne web update\`

**Refine Page Structure**
Review and improve your page structure:

  \`aigne web generate\`

`;

  return {
    message,
  };
}

/**
 * Generate filename based on flatName and language
 * @param {string} flatName - Flattened path name
 * @param {string} language - Language code
 * @returns {string} - Generated filename
 */
function generateFileName(flatName, language) {
  const isEnglish = language === "en";
  return isEnglish ? `${flatName}.yaml` : `${flatName}.${language}.yaml`;
}

/**
 * Clean up .yaml files that are no longer in the structure plan
 * @param {Array<{path: string, title: string}>} websiteStructure
 * @param {string} pagesDir
 * @param {Array<string>} translateLanguages
 * @param {string} locale - Main language locale (e.g., 'en', 'zh', 'fr')
 * @returns {Promise<Array<{ path: string, success: boolean, error?: string }>>}
 */
async function _cleanupInvalidFiles(websiteStructure, pagesDir, translateLanguages, locale) {
  const results = [];

  try {
    // Get all .yaml files in pagesDir
    const files = await readdir(pagesDir);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

    // Generate expected file names from structure plan
    const expectedFiles = new Set();

    // Add main page files
    for (const { path } of websiteStructure) {
      const flatName = path.replace(/^\//, "").replace(/\//g, "-");

      // Main language file
      const mainFileName = generateFileName(flatName, locale);
      expectedFiles.add(mainFileName);

      // Add translation files for each language
      for (const lang of translateLanguages) {
        const translateFileName = generateFileName(flatName, lang);
        expectedFiles.add(translateFileName);
      }
    }

    // Find files to delete (files that are not in expectedFiles and not _sitemap.yaml)
    const filesToDelete = yamlFiles.filter(
      (file) => !expectedFiles.has(file) && !file.startsWith("_"),
    );

    // Delete invalid files
    for (const file of filesToDelete) {
      try {
        const filePath = join(pagesDir, file);
        await unlink(filePath);
        results.push({
          path: filePath,
          success: true,
          message: `Deleted invalid file: ${file}`,
        });
      } catch (err) {
        results.push({
          path: file,
          success: false,
          error: `Failed to delete ${file}: ${err.message}`,
        });
      }
    }

    if (filesToDelete.length > 0) {
      console.log(`Cleaned up ${filesToDelete.length} invalid .yaml files from ${pagesDir}`);
    }
  } catch (err) {
    // If pagesDir doesn't exist or can't be read, that's okay
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return results;
}

// Generate sitemap YAML content, support nested structure, and the order is consistent with websiteStructure
function generateSitemapYaml(websiteStructure) {
  // Build tree structure
  const root = {};
  for (const { path, title, parentId } of websiteStructure) {
    const relPath = path.replace(/^\//, "");
    const segments = relPath.split("/");
    let node = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!node[seg])
        node[seg] = {
          __children: {},
          __title: null,
          __fullPath: segments.slice(0, i + 1).join("/"),
          __parentId: parentId,
        };
      if (i === segments.length - 1) node[seg].__title = title;
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
        const sitemapItem = {
          title: item.__title,
          path: `/${flatFile}`,
        };
        const children = item.__children;
        if (Object.keys(children).length > 0) {
          sitemapItem.children = walk(children, fullSegments);
        }
        items.push(sitemapItem);
      }
    }
    return items;
  }

  const sitemapData = {
    sitemap: walk(root),
  };

  return yamlStringify(sitemapData);
}
