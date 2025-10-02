import { extname } from "node:path";
import fg from "fast-glob";

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
  "**/LICENSE**",
  "**/tsconfig**",
  "**/.nyc_output/**",

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

  const files = await fg("**/*", {
    cwd: dirPath,
    ignore: [...DEFAULT_IGNORE, ...additionalIgnore],
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
