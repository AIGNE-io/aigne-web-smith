import { extname } from "node:path";
import fg from "fast-glob";
import { loadGitignore } from "../../utils/file-utils.mjs";

// Common patterns to ignore
const DEFAULT_IGNORE = [
  // Dependencies
  "**/node_modules/**",
  "**/bower_components/**",
  "**/vendor/**",
  "**/packages/*/node_modules/**",

  // Build outputs
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/.next/**",
  "**/.nuxt/**",
  "**/public/build/**",
  "**/target/**",

  // Caches
  "**/.cache/**",
  "**/.parcel-cache/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/.nyc_output/**",

  // Version control
  "**/.git/**",
  "**/.svn/**",
  "**/.hg/**",

  // Python
  "**/__pycache__/**",
  "**/.pytest_cache/**",
  "**/.venv/**",
  "**/venv/**",
  "**/*.pyc",

  // IDEs
  "**/.vscode/**",
  "**/.idea/**",
  "**/*.swp",
  "**/*.swo",

  // OS files
  "**/.DS_Store",
  "**/Thumbs.db",
  "**/desktop.ini",

  // Lock files
  "**/package-lock.json",
  "**/yarn.lock",
  "**/lerna.json",
  "**/turbo.json",
  "**/pnpm-lock.yaml",
  "**/composer.lock",
  "**/Gemfile.lock",
  "**/Cargo.lock",

  // Logs
  "**/*.log",
  "**/npm-debug.log*",
  "**/logs/**",

  // Temp files
  "**/tmp/**",
  "**/temp/**",
  "**/*.tmp",

  // Coverage files
  "**/coverage**",
  "**/babel**",
  "**/jest**",
  "**/eslint**",
  "**/LICENSE**",
  "**/tsconfig**",

  // Test files (JavaScript, TypeScript, Python, Ruby, Go, Rust, etc.)
  "**/*.test.js",
  "**/*.cy.js",
  "**/*.test.jsx",
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.js",
  "**/*.spec.jsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
  "**/__tests__/**",
  "**/__mocks__/**",
  "**/*.test.mjs",
  "**/*.spec.mjs",
  "**/*.test.cjs",
  "**/*.spec.cjs",
  "**/*.test.py",
  "**/test_*.py",
  "**/tests/**",
  "**/*.spec.rb",
  "**/*.test.rb",
  "**/test_*.rb",
  "**/*.test.go",
  "**/*.spec.go",
  "**/*_test.go",
  "**/*.test.rs",
  "**/*.spec.rs",
  "**/*_test.rs",
  "**/*.test.java",
  "**/*.spec.java",
  "**/*Test.java",
  "**/Test*.java",
  "**/*.test.kt",
  "**/*.spec.kt",
  "**/*Test.kt",
  "**/*.test.swift",
  "**/*.spec.swift",
  "**/*Tests.swift",
];

export async function listRepoFiles(dirPath, options = {}) {
  const {
    additionalIgnore = [],
    includeHidden = false,
    maxSize = 1 * 1024 * 1024, // 1MB default
  } = options;

  const gitignorePatterns = await loadGitignore(dirPath);

  const files = await fg("**/*", {
    cwd: dirPath,
    ignore: Array.from(
      new Set([...DEFAULT_IGNORE, ...additionalIgnore, ...(gitignorePatterns || [])]),
    ),
    onlyFiles: true,
    dot: includeHidden,
    stats: true,
    followSymbolicLinks: false,
    suppressErrors: true, // don't throw on permission errors
  });

  // Filter by size and return formatted
  return files
    .filter((file) => file.stats && file.stats.size <= maxSize)
    .map((file) => ({
      path: file.path,
      name: file.name,
      size: file.stats?.size,
      extension: extname(file.path),
    }));
}

export async function listContentRelevantFiles(dirPath, options = {}) {
  const allFiles = await listRepoFiles(dirPath, options);

  // Content-relevant extensions
  const contentExtensions = new Set([
    ".md",
    ".mdx",
    ".txt",
    ".rst", // Documentation
    ".json",
    ".yaml",
    ".yml",
    ".toml", // Structured data (non-lock)
    ".csv",
    ".tsv", // Data files
  ]);

  // Content-relevant filenames (case-insensitive)
  const contentFilenames = new Set([
    "readme",
    "contributing",
    "changelog",
    "license",
    "package.json",
    "composer.json",
    "cargo.toml",
  ]);

  return allFiles.filter((file) => {
    const filename = file.name.toLowerCase();
    const ext = file.extension.toLowerCase();

    // Include by extension
    if (contentExtensions.has(ext)) return true;

    // Include by filename
    const nameWithoutExt = filename.replace(ext, "");
    if (contentFilenames.has(nameWithoutExt)) return true;

    // Include docs/content directories
    if (file.path.match(/^(docs|content|documentation|pages|blog)\//)) return true;

    return false;
  });
}
