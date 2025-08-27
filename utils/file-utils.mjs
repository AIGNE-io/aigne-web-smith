import { execSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

/**
 * Check if a directory is inside a git repository
 * @param {string} dir - Directory path to check
 * @returns {boolean} True if inside a git repository
 */
function isInGitRepository(dir) {
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
 * Find git repository root directory
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
 * @returns {string[]} Array of glob patterns
 */
function gitignoreToGlobPatterns(pattern) {
  const patterns = [];
  const cleanPattern = pattern.replace(/^\//, "");

  if (
    !cleanPattern.includes("*") &&
    !cleanPattern.includes("?") &&
    !cleanPattern.endsWith("/")
  ) {
    patterns.push(cleanPattern);
    patterns.push(`${cleanPattern}/**`);
    patterns.push(`**/${cleanPattern}`);
    patterns.push(`**/${cleanPattern}/**`);
  } else if (cleanPattern.endsWith("/")) {
    const dirPattern = cleanPattern.slice(0, -1);
    patterns.push(`${dirPattern}/**`);
    patterns.push(`**/${dirPattern}/**`);
  } else {
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
 * @returns {string[]} Array of ignore patterns
 */
function parseGitignoreContent(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.replace(/^\//, ""));

  const allPatterns = [];
  for (const line of lines) {
    allPatterns.push(...gitignoreToGlobPatterns(line));
  }

  return [...new Set(allPatterns)];
}

/**
 * Load .gitignore patterns from directories
 * @param {string} dir - Directory path
 * @returns {string[]|null} Array of ignore patterns or null
 */
export async function loadGitignore(dir) {
  const inGitRepo = isInGitRepository(dir);
  if (!inGitRepo) {
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

  const gitRoot = findGitRoot(dir);
  if (!gitRoot) {
    return null;
  }

  const allPatterns = [];
  let currentDir = path.resolve(dir);

  while (currentDir.startsWith(gitRoot)) {
    const gitignorePath = path.join(currentDir, ".gitignore");
    try {
      await access(gitignorePath);
      const gitignoreContent = await readFile(gitignorePath, "utf8");
      const patterns = parseGitignoreContent(gitignoreContent);
      allPatterns.unshift(...patterns);
    } catch {
      // Continue if .gitignore doesn't exist
    }

    if (currentDir === gitRoot) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  return allPatterns.length > 0 ? [...new Set(allPatterns)] : null;
}

/**
 * Get files using glob patterns
 * @param {string} dir - Directory to search
 * @param {string[]} includePatterns - Include patterns
 * @param {string[]} excludePatterns - Exclude patterns
 * @param {string[]} gitignorePatterns - .gitignore patterns
 * @returns {Promise<string[]>} Array of file paths
 */
export async function getFilesWithGlob(
  dir,
  includePatterns,
  excludePatterns,
  gitignorePatterns
) {
  const allIgnorePatterns = [];

  if (excludePatterns) {
    allIgnorePatterns.push(...excludePatterns);
  }

  if (gitignorePatterns) {
    allIgnorePatterns.push(...gitignorePatterns);
  }

  // Add default exclusions
  const defaultExclusions = [
    "node_modules/**",
    "test/**",
    "temp/**",
    ".aigne/**",
  ];
  for (const exclusion of defaultExclusions) {
    if (!allIgnorePatterns.includes(exclusion)) {
      allIgnorePatterns.push(exclusion);
    }
  }

  const patterns = includePatterns.map((pattern) => {
    if (!pattern.startsWith("/") && !pattern.startsWith("**")) {
      return `**/${pattern}`;
    }
    return pattern;
  });

  try {
    const files = await glob(patterns, {
      cwd: dir,
      ignore: allIgnorePatterns.length > 0 ? allIgnorePatterns : undefined,
      absolute: true,
      nodir: true,
      dot: false,
      gitignore: true,
    });

    return files;
  } catch (error) {
    console.warn(
      `Warning: Error during glob search in ${dir}: ${error.message}`
    );
    return [];
  }
}

/**
 * Process media files from file list
 * @param {string[]} files - Array of file paths
 * @param {string} docsDir - Base directory for relative paths
 * @returns {Array} Array of media file objects
 */
export function processMediaFiles(files, docsDir) {
  const mediaFiles = [];

  // Media file extensions
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

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (mediaExtensions.includes(ext)) {
      const relativePath = path.relative(docsDir, file);
      const fileName = path.basename(file);
      const description = path.parse(fileName).name;

      mediaFiles.push({
        name: fileName,
        path: relativePath,
        description,
      });
    }
  });

  return mediaFiles;
}
