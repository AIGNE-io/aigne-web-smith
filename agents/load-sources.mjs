import { readFile } from "node:fs/promises";
import path from "node:path";
import { getFilesWithGlob, loadGitignore } from "../utils/file-utils.mjs";

/**
 * Load website sources and media files
 * @param {Object} input - Input parameters
 * @param {string} input.docsDir - Source directory to scan
 * @param {string[]} input.includePatterns - File patterns to include
 * @param {string[]} input.excludePatterns - File patterns to exclude
 * @returns {Promise<Object>} Processing result with sources and media files
 */
export default async function loadSources({
  docsDir = process.cwd(),
  includePatterns = ["**/*.md", "**/*.yaml", "**/*.yml"],
  excludePatterns = [],
}) {
  // Load gitignore patterns
  const gitignorePatterns = await loadGitignore(docsDir);

  // Get all files
  let files = await getFilesWithGlob(
    docsDir,
    includePatterns,
    excludePatterns,
    gitignorePatterns
  );
  files = [...new Set(files)];

  // Define media file extensions
  const mediaExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".m4v",
  ];

  const sourceFiles = [];
  const mediaFiles = [];
  let allSources = "";

  // Process files
  await Promise.all(
    files.map(async (file) => {
      const ext = path.extname(file).toLowerCase();

      if (mediaExtensions.includes(ext)) {
        // Handle media files
        const relativePath = path.relative(docsDir, file);
        const fileName = path.basename(file);
        const description = path.parse(fileName).name;

        mediaFiles.push({
          name: fileName,
          path: relativePath,
          description,
        });
      } else {
        // Handle source files
        const content = await readFile(file, "utf8");
        const relativePath = path.relative(process.cwd(), file);
        allSources += `// sourceId: ${relativePath}\n${content}\n`;

        sourceFiles.push({
          sourceId: relativePath,
          content,
        });
      }
    })
  );

  // Generate assets content from media files
  let assetsContent = "# Available Media Assets\n\n";

  if (mediaFiles.length > 0) {
    const mediaMarkdown = mediaFiles
      .map((file) => `![${file.description}](${file.path})`)
      .join("\n\n");

    assetsContent += mediaMarkdown;
  }

  return {
    datasources: allSources,
    datasourcesList: sourceFiles,
    files: sourceFiles.map((f) => f.sourceId),
    mediaFiles,
    assetsContent,
    summary: {
      totalFiles: files.length,
      sourceFiles: sourceFiles.length,
      mediaFiles: mediaFiles.length,
      totalWords: allSources.split(/\s+/).filter((word) => word.length > 0)
        .length,
      totalLines: allSources.split("\n").length,
    },
  };
}
