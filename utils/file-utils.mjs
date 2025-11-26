import { execSync } from "node:child_process";
import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { minimatch } from "minimatch";
import { WEB_SMITH_DIR } from "./constants.mjs";
import { isGlobPattern } from "./utils.mjs";

/**
 * Check if a directory is inside a git repository using git command
 * @param {string} dir - Directory path to check
 * @returns {boolean} True if inside a git repository
 */
export function isInGitRepository(dir) {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: dir,
      stdio: "pipe",
      encoding: "utf8",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find git repository root directory using git command
 * @param {string} startDir - Starting directory path
 * @returns {string|null} Git repository root path or null if not found
 */
function findGitRoot(startDir) {
  try {
    const gitRoot = execSync("git rev-parse --show-toplevel", {
      cwd: startDir,
      stdio: "pipe",
      encoding: "utf8",
    }).trim();
    return gitRoot;
  } catch {
    return null;
  }
}

/**
 * Convert gitignore patterns to glob-compatible patterns
 * @param {string} pattern - A single gitignore pattern
 * @returns {string[]} Array of glob patterns that match gitignore behavior
 */
function gitignoreToGlobPatterns(pattern) {
  const patterns = [];

  // Remove leading slash (already handled by gitignore parsing)
  const cleanPattern = pattern.replace(/^\//, "");

  // If pattern doesn't contain wildcards and doesn't end with /
  // it could match both files and directories
  if (!cleanPattern.includes("*") && !cleanPattern.includes("?") && !cleanPattern.endsWith("/")) {
    // Add patterns to match both file and directory
    patterns.push(cleanPattern); // Exact match
    patterns.push(`${cleanPattern}/**`); // Directory contents
    patterns.push(`**/${cleanPattern}`); // Nested exact match
    patterns.push(`**/${cleanPattern}/**`); // Nested directory contents
  } else if (cleanPattern.endsWith("/")) {
    // Directory-only pattern
    const dirPattern = cleanPattern.slice(0, -1);
    patterns.push(`${dirPattern}/**`);
    patterns.push(`**/${dirPattern}/**`);
  } else {
    // Pattern with wildcards or specific file
    patterns.push(cleanPattern);
    if (!cleanPattern.startsWith("**/")) {
      patterns.push(`**/${cleanPattern}`);
    }
  }

  return patterns;
}

/**
 * Parse .gitignore content into patterns
 * @param {string} content - .gitignore file content
 * @returns {string[]} Array of ignore patterns converted to glob format
 */
function parseGitignoreContent(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.replace(/^\//, "")); // Remove leading slash

  // Convert each gitignore pattern to glob patterns
  const allPatterns = [];
  for (const line of lines) {
    allPatterns.push(...gitignoreToGlobPatterns(line));
  }

  return [...new Set(allPatterns)]; // Remove duplicates
}

/**
 * Load .gitignore patterns from multiple directories (current + all parent directories up to git root)
 * @param {string} dir - Directory path (will search up to find all .gitignore files)
 * @returns {string[]|null} Array of merged ignore patterns or null if no .gitignore found
 */
export async function loadGitignore(dir) {
  // First, check if we're in a git repository
  const inGitRepo = isInGitRepository(dir);
  if (!inGitRepo) {
    // Not in a git repository, just check the current directory
    const gitignorePath = path.join(dir, ".gitignore");
    try {
      await access(gitignorePath);
      const gitignoreContent = await readFile(gitignorePath, "utf8");
      const ignorePatterns = parseGitignoreContent(gitignoreContent);
      return ignorePatterns.length > 0 ? ignorePatterns : null;
    } catch {
      return null;
    }
  }

  // We're in a git repository, collect all .gitignore files from current dir to git root
  const gitRoot = findGitRoot(dir);
  if (!gitRoot) {
    return null;
  }

  const allPatterns = [];
  let currentDir = path.resolve(dir);

  // Collect .gitignore patterns from current directory up to git root
  while (currentDir.startsWith(gitRoot)) {
    const gitignorePath = path.join(currentDir, ".gitignore");
    try {
      await access(gitignorePath);
      const gitignoreContent = await readFile(gitignorePath, "utf8");
      const patterns = parseGitignoreContent(gitignoreContent);

      // Add patterns with context of which directory they came from
      // Patterns from deeper directories take precedence
      allPatterns.unshift(...patterns);
    } catch {
      // .gitignore doesn't exist in this directory, continue
    }

    // Move up one directory
    if (currentDir === gitRoot) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  return allPatterns.length > 0 ? [...new Set(allPatterns)] : null;
}

// Shared extension → MIME type table
const EXT_TO_MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".mpg": "video/mpg",
  ".mov": "video/mov",
  ".avi": "video/avi",
  ".flv": "video/x-flv",
  ".mkv": "video/x-matroska",
  ".webm": "video/webm",
  ".wmv": "video/wmv",
  ".m4v": "video/x-m4v",
  ".3gpp": "video/3gpp",
  ".json": "application/json",
};

// Build reverse mapping: MIME → extensions
const MIME_TO_EXTS = Object.entries(EXT_TO_MIME).reduce((acc, [ext, mime]) => {
  const key = mime.toLowerCase();
  acc[key] = acc[key] || [];
  acc[key].push(ext);
  return acc;
}, {});

/**
 * Get MIME type from file path.
 * Returns "application/octet-stream" if unknown.
 */
export function getMimeType(filePath) {
  const ext = path.extname(filePath || "").toLowerCase();
  return EXT_TO_MIME[ext] || "application/octet-stream";
}

/**
 * Get file extension (without dot) from content type.
 * Handles content types with parameters (e.g., "image/jpeg; charset=utf-8").
 */
export function getExtnameFromContentType(contentType) {
  if (!contentType) return "";
  const base = String(contentType).split(";")[0].trim().toLowerCase();
  const exts = MIME_TO_EXTS[base];
  if (exts?.length) return exts[0].slice(1);
  const parts = base.split("/");
  return parts[1] || "";
}

/**
 * Get media description cache file path
 * @returns {string} Absolute path to media-description.yaml
 */
export function getMediaDescriptionCachePath() {
  return path.join(process.cwd(), WEB_SMITH_DIR, "media-description.yaml");
}

/**
 * Get cover image file path
 * @param {string} [projectCover] - Optional project cover path from config
 * @returns {string} Absolute path to cover image
 */
export function getCoverImagePath(projectCover) {
  if (projectCover) {
    return path.isAbsolute(projectCover) ? projectCover : path.join(process.cwd(), projectCover);
  }
  // Default path
  return path.join(process.cwd(), WEB_SMITH_DIR, "cover.png");
}

/**
 * Get files using glob patterns
 * @param {string} dir - Directory to search
 * @param {string[]} includePatterns - Include patterns
 * @param {string[]} excludePatterns - Exclude patterns
 * @param {string[]} gitignorePatterns - .gitignore patterns
 * @returns {Promise<string[]>} Array of file paths
 */
export async function getFilesWithGlob(dir, includePatterns, excludePatterns, gitignorePatterns) {
  // Prepare all ignore patterns
  const allIgnorePatterns = [];

  if (excludePatterns) {
    allIgnorePatterns.push(...excludePatterns);
  }

  if (gitignorePatterns) {
    allIgnorePatterns.push(...gitignorePatterns);
  }

  // Add default exclusions if not already present
  const defaultExclusions = ["node_modules/**", "test/**", "temp/**"];
  for (const exclusion of defaultExclusions) {
    if (!allIgnorePatterns.includes(exclusion)) {
      allIgnorePatterns.push(exclusion);
    }
  }

  // Convert patterns to be relative to the directory
  const patterns = includePatterns.map((pattern) => {
    // If pattern doesn't start with / or **, make it relative to dir
    if (!pattern.startsWith("/") && !pattern.startsWith("**")) {
      return `**/${pattern}`; // Use ** to search recursively
    }
    return pattern;
  });

  try {
    const files = await glob(patterns, {
      cwd: dir,
      ignore: allIgnorePatterns.length > 0 ? allIgnorePatterns : undefined,
      absolute: true,
      nodir: true, // Only return files, not directories
      dot: false, // Don't include dot files by default
      gitignore: true, // Enable .gitignore support
    });

    return files;
  } catch (error) {
    console.warn(`Warning: Error during glob search in ${dir}: ${error.message}`);
    return [];
  }
}

/**
 * Load files from source paths (files, directories, or glob patterns)
 * @param {string|string[]} sourcesPath - File path, directory path, or glob pattern(s)
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.includePatterns - Glob patterns to include
 * @param {string|string[]} options.excludePatterns - Glob patterns to exclude
 * @param {boolean} options.useDefaultPatterns - Whether to merge with default patterns
 * @param {string[]} options.defaultIncludePatterns - Default include patterns
 * @param {string[]} options.defaultExcludePatterns - Default exclude patterns
 * @returns {Promise<string[]>} Array of file paths
 */
export async function loadFilesFromSourcePaths(
  sourcesPath,
  {
    includePatterns,
    excludePatterns,
    useDefaultPatterns = true,
    defaultIncludePatterns = [],
    defaultExcludePatterns = [],
  } = {},
) {
  const paths = Array.isArray(sourcesPath) ? sourcesPath : [sourcesPath];
  let allFiles = [];

  for (const dir of paths) {
    try {
      if (typeof dir !== "string") {
        console.warn(`Invalid source path: ${dir}`);
        continue;
      }

      // First try to access as a file or directory
      const stats = await stat(dir);

      if (stats.isFile()) {
        // If it's a file, add it directly without filtering
        allFiles.push(dir);
      } else if (stats.isDirectory()) {
        // If it's a directory, use the existing glob logic
        // Load .gitignore for this directory
        const gitignorePatterns = await loadGitignore(dir);

        // Prepare patterns
        let finalIncludePatterns = null;
        let finalExcludePatterns = null;

        if (useDefaultPatterns) {
          // Merge with default patterns
          const userInclude = includePatterns
            ? Array.isArray(includePatterns)
              ? includePatterns
              : [includePatterns]
            : [];
          const userExclude = excludePatterns
            ? Array.isArray(excludePatterns)
              ? excludePatterns
              : [excludePatterns]
            : [];

          finalIncludePatterns = [...defaultIncludePatterns, ...userInclude];
          finalExcludePatterns = [...defaultExcludePatterns, ...userExclude];
        } else {
          // Use only user patterns
          if (includePatterns) {
            finalIncludePatterns = Array.isArray(includePatterns)
              ? includePatterns
              : [includePatterns];
          }
          if (excludePatterns) {
            finalExcludePatterns = Array.isArray(excludePatterns)
              ? excludePatterns
              : [excludePatterns];
          }
        }

        // Get files using glob
        const filesInDir = await getFilesWithGlob(
          dir,
          finalIncludePatterns,
          finalExcludePatterns,
          gitignorePatterns,
        );
        allFiles = allFiles.concat(filesInDir);
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        // Path doesn't exist as file or directory, try as glob pattern
        try {
          // Check if it looks like a glob pattern
          const isGlobPatternResult = isGlobPattern(dir);

          if (isGlobPatternResult) {
            // Use glob to find matching files from current working directory
            const matchedFiles = await glob(dir, {
              absolute: true,
              nodir: true, // Only files, not directories
              dot: false, // Don't include hidden files
            });

            if (matchedFiles.length > 0) {
              allFiles = allFiles.concat(matchedFiles);
            }
          }
        } catch (globErr) {
          console.warn(`Failed to process glob pattern "${dir}": ${globErr.message}`);
        }
      } else {
        throw err;
      }
    }
  }

  return allFiles;
}

/**
 * Check if a string is an HTTP/HTTPS URL
 * @param {string} fileUrl - The string to check
 * @returns {boolean} - True if the string starts with http:// or https://
 */
export function isRemoteFile(fileUrl) {
  if (typeof fileUrl !== "string") return false;

  try {
    const url = new URL(fileUrl);
    // Only accept http and https url
    if (["http:", "https:"].includes(url.protocol)) {
      return true;
    }
    // other protocol will be treated as bad url
    return false;
  } catch {
    return false;
  }
}

// Media file extensions constants
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".heic",
  ".heif",
];
const VIDEO_EXTENSIONS = [
  ".mp4",
  ".mpeg",
  ".mpg",
  ".mov",
  ".avi",
  ".flv",
  ".mkv",
  ".webm",
  ".wmv",
  ".m4v",
  ".3gpp",
];
const JSON_EXTENSIONS = [".json"];
const MEDIA_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS, ...JSON_EXTENSIONS];

/**
 * Check if a file is a media file (image or video)
 * @param {string} filePath - File path
 * @returns {boolean} True if the file is a media file
 */
export function isMediaFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MEDIA_EXTENSIONS.includes(ext);
}

/**
 * Check if a file is an image file
 * @param {string} filePath - File path
 * @returns {boolean} True if the file is an image
 */
export function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Check if a file is a video file
 * @param {string} filePath - File path
 * @returns {boolean} True if the file is a video
 */
export function isVideoFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext);
}

/**
 * Get file type from file path based on extension
 * @param {string} filePath - File path
 * @returns {string} File type: 'image', 'video', or 'media'
 */
export function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  if (ext === ".json") return "json";
  return "media";
}

/**
 * Load media files from assets directory
 * @param {string} assetsDir - Assets directory path
 * @returns {Promise<string[]>} Array of media file paths
 */
export async function loadMediaFilesFromAssets(assetsDir) {
  try {
    await access(assetsDir);
    const files = await readdir(assetsDir, { withFileTypes: true });

    // Filter only files (not directories) and only media files
    const mediaFiles = files
      .filter((dirent) => dirent.isFile() && isMediaFile(dirent.name))
      .map((dirent) => path.join(assetsDir, dirent.name));

    return mediaFiles;
  } catch {
    // Assets directory doesn't exist or lacks read permissions
    return [];
  }
}

/**
 * Copy generated images from temp directory to assets directory
 * @param {Array} imageRequirements - Array of image generation results
 * @param {string} assetsDir - Target assets directory path
 * @returns {Promise<Array>} Array of processed image information
 */
export async function copyGeneratedImages(imageRequirements, assetsDir) {
  // Ensure assets directory exists
  await mkdir(assetsDir, { recursive: true });

  const processedImages = [];

  for (const imageReq of imageRequirements) {
    if (!imageReq.images || imageReq.images.length === 0) {
      continue;
    }

    const processedImagePaths = [];

    for (const image of imageReq.images) {
      if (image.type === "local" && image.path) {
        try {
          // Get file extension from source path
          let ext = path.extname(image.path);

          // If no extension found, try to determine from mimeType
          if (!ext && image.mimeType) {
            const extFromMime = getExtnameFromContentType(image.mimeType);
            if (extFromMime) {
              ext = `.${extFromMime}`;
            }
          }

          // Ensure we have a file extension
          if (!ext) {
            console.warn(
              `Could not determine file extension for image "${imageReq.imageName}" - skipping file`,
            );
            continue;
          }

          // Create new filename using imageName
          const newFilename = `${imageReq.imageName}${ext}`;
          const destPath = path.join(assetsDir, newFilename);

          // Copy file from temp to assets directory
          await copyFile(image.path, destPath);

          // Create metadata markdown file
          const mdFilename = `${imageReq.imageName}.md`;
          const mdPath = path.join(assetsDir, mdFilename);

          // Write image file description
          if (imageReq.imageDescription) {
            await writeFile(mdPath, imageReq.imageDescription, "utf8");
          }

          processedImagePaths.push({
            imageName: imageReq.imageName,
            path: destPath,
            mimeType: image.mimeType,
            metadataPath: mdPath,
          });
        } catch (copyError) {
          console.error(
            `Failed to copy image from ${image.path} to assets directory: ${copyError.message}`,
          );
        }
      }
    }

    if (processedImagePaths.length > 0) {
      processedImages.push({
        imageName: imageReq.imageName,
        images: processedImagePaths,
      });
    }
  }

  return processedImages;
}

/**
 * Get caches file path
 * @returns {Array<string>} Absolute path to translation-cache.yaml
 */
export function getTranslationCachePath() {
  const translationCachePath = path.join(process.cwd(), WEB_SMITH_DIR, "translation-cache.yaml");
  return translationCachePath;
}

/**
 * Extract the path prefix from a glob pattern until the first glob character
 */
export function getPathPrefix(pattern) {
  const segments = pattern.split("/");
  const result = [];

  for (const segment of segments) {
    if (isGlobPattern(segment)) {
      break;
    }
    result.push(segment);
  }

  return result.join("/") || ".";
}

/**
 * Check if a dir matches any exclude pattern
 */
export function isDirExcluded(dir, excludePatterns) {
  if (!dir || typeof dir !== "string") {
    return false;
  }

  let normalizedDir = dir.replace(/\\/g, "/").replace(/^\.\/+/, "");
  normalizedDir = normalizedDir.endsWith("/") ? normalizedDir : `${normalizedDir}/`;

  for (const excludePattern of excludePatterns) {
    if (minimatch(normalizedDir, excludePattern, { dot: true })) {
      return true;
    }
  }

  return false;
}

/**
 * Return source paths that would be excluded by exclude patterns (files are skipped, directories use minimatch, glob patterns use path prefix heuristic)
 */
export async function findInvalidSourcePaths(sourcePaths, excludePatterns) {
  if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
    return { excluded: [], notFound: [] };
  }

  if (!Array.isArray(excludePatterns) || excludePatterns.length === 0) {
    return { excluded: [], notFound: [] };
  }

  const excluded = [];
  const notFound = [];

  for (const sourcePath of sourcePaths) {
    if (typeof sourcePath !== "string" || !sourcePath) {
      continue;
    }

    // Skip paths starting with "!" (exclusion patterns)
    if (sourcePath.startsWith("!")) {
      continue;
    }

    // Skip remote URLs
    if (isRemoteFile(sourcePath)) {
      continue;
    }

    // Check glob pattern: use heuristic algorithm
    if (isGlobPattern(sourcePath)) {
      const representativePath = getPathPrefix(sourcePath);
      if (isDirExcluded(representativePath, excludePatterns)) {
        excluded.push(sourcePath);
      }
      continue;
    }

    try {
      const stats = await stat(sourcePath);
      // Skip file
      if (stats.isFile()) {
        continue;
      }
      // Check dir with minimatch
      if (stats.isDirectory()) {
        if (isDirExcluded(sourcePath, excludePatterns)) {
          excluded.push(sourcePath);
        }
      }
    } catch {
      // Path doesn't exist
      notFound.push(sourcePath);
    }
  }

  return { excluded, notFound };
}

/**
 * Cleans up files in a specific directory
 * @param {Object} options - Cleanup options
 * @param {string} options.dirPath - Directory path to clean
 * @param {Set<string>} [options.expectedFiles] - Set of expected file names (if not provided, deletes all .yaml files except those starting with _)
 * @param {Array} [options.results] - Results array to append to
 * @param {string} [options.dirType] - Directory type for logging (e.g., "workspace" or "output")
 * @returns {Promise<void>}
 */
export async function cleanupDirectoryFiles({ dirPath, expectedFiles, results, dirType }) {
  try {
    const files = await readdir(dirPath);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

    let filesToDelete;
    if (expectedFiles) {
      // Find files to delete (files that are not in expectedFiles and not starting with _)
      filesToDelete = yamlFiles.filter((file) => !expectedFiles.has(file) && !file.startsWith("_"));
    } else {
      // Delete all .yaml files except those starting with _
      filesToDelete = yamlFiles.filter((file) => !file.startsWith("_"));
    }

    // Delete files
    for (const file of filesToDelete) {
      try {
        const filePath = path.join(dirPath, file);
        await unlink(filePath);
        if (results) {
          results.push({
            path: filePath,
            success: true,
            message: dirType
              ? `Successfully deleted invalid file from ${dirType} directory: ${file}`
              : `Successfully deleted file: ${file}`,
          });
        }
      } catch (err) {
        if (results) {
          results.push({
            path: file,
            success: false,
            error: dirType
              ? `Failed to delete file from ${dirType} directory: ${file}: ${err.message}`
              : `Failed to delete file: ${file}: ${err.message}`,
          });
        }
      }
    }

    if (filesToDelete.length > 0 && dirType) {
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
