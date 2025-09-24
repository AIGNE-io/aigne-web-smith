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
  translateLanguages = [],
  locale,
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
  try {
    await cleanupInvalidFiles(websiteStructure, pagesDir, translateLanguages, locale);
  } catch (err) {
    console.error("Failed to cleanup invalid .yaml files:", err.message);
  }

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
